from celery import shared_task
from .models import Destination
from celery import shared_task
from django.db.models import Count, Sum, Q
from django.utils.timezone import now, timedelta
from .models import Destination,Location, Category
from django.core.cache import cache
from .serializers import  DestinationDetailSerializer, ItinerarySerializer, DestinationRecommendationSerializer, ItineraryRecommendationSerializer
from django.test import RequestFactory
from .views import destination_list_api, itineraries_by_category
from .utils import compute_recommended_destinations, compute_recommended_itineraries
from django.contrib.auth import get_user_model



@shared_task
def update_trending_destinations():
    # Example: mark last 3 destinations as trending
    latest = Destination.objects.order_by("-id")[:3]
    for d in latest:
        d.is_trending = True
        d.save()
    return f"Updated {len(latest)} destinations"


@shared_task
def precache_destinations():
    """
    Precompute and cache all destination list responses
    for common query params (trending, country, pagination).
    """
    factory = RequestFactory()
    base_queries = [
        {},  # default
        {"trending": "true"},
    ]

    # add country filters
    countries = Location.objects.values_list("country", flat=True).distinct()
    for c in countries:
        base_queries.append({"country": c})

    pages = [1, 2, 3]
    sizes = [10, 25]

    count = 0
    for q in base_queries:
        for page in pages:
            for size in sizes:
                params = {**q, "page": page, "page_size": size}
                req = factory.get("/api/destinations/", data=params)
                resp = destination_list_api(req)  # directly call your API view
                cache_key = f"destinations:{req.get_full_path()}"
                cache.set(cache_key, resp.data, timeout=None)
                count += 1

    return f"✅ Precomputed {count} destination cache entries"


@shared_task
def compute_trending_destinations():
    last_week = now() - timedelta(days=7)
    qs = (
        Destination.objects
        .annotate(
            views=Count("interactions", filter=Q(interactions__action_type="view", interactions__created_at__gte=last_week)),
            clicks=Count("interactions", filter=Q(interactions__action_type="click", interactions__created_at__gte=last_week)),
            dwell=Sum("interactions__dwell_time", filter=Q(interactions__action_type="dwell", interactions__created_at__gte=last_week)),
        )
    )

    for d in qs:
        score = (d.views or 0) + 2 * (d.clicks or 0) + ((d.dwell or 0) / 60.0)
        d.trending_score = score
        d.save(update_fields=["trending_score"])
        

def clear_pattern(prefix):
    try:
        keys = cache.keys(f"{prefix}*") if hasattr(cache, "keys") else []
        if keys:
            cache.delete_many(keys)
    except Exception:
        pass
        

@shared_task
def rebuild_recommendations():
    # --- Destinations ---
    dests = compute_recommended_destinations()
    dest_data = DestinationRecommendationSerializer(dests, many=True).data
    clear_pattern("recommendations:global:destinations")
    cache.set("recommendations:global:destinations", dest_data, timeout=None)

    itins = compute_recommended_itineraries()
    itin_data = ItineraryRecommendationSerializer(itins, many=True).data
    clear_pattern("recommendations:global:itineraries")
    cache.set("recommendations:global:itineraries", itin_data, timeout=None)

    return f"✅ Recommendations rebuilt (destinations={len(dests)}, itineraries={len(itins)})"



@shared_task
def clear_stale_cache():
    """
    Remove old per-user/session cache entries to save Redis memory.
    Runs nightly via Celery Beat.
    """
    # Per-user recommendations
    try:
        keys = cache.keys("recommendations:user:*") if hasattr(cache, "keys") else []
        if keys:
            cache.delete_many(keys)
            return f"🧹 Cleared {len(keys)} stale user recommendation cache entries"
    except Exception as e:
        return f"⚠️ Error while clearing cache: {e}"

    return "No stale cache found"


@shared_task
def precache_user_recommendations(days_active=7):
    """
    Precompute recs for users active in the last `days_active`.
    """
    User = get_user_model()
    cutoff = now() - timedelta(days=days_active)

    active_users = User.objects.filter(last_login__gte=cutoff).only("id")

    count = 0
    for user in active_users:
        # Destinations
        dests = compute_recommended_destinations(user=user)
        dest_data = DestinationRecommendationSerializer(dests, many=True).data
        cache.set(f"recommendations:user:{user.id}:destinations", dest_data, timeout=3600)

        # Itineraries
        itins = compute_recommended_itineraries(user=user)
        itin_data = ItineraryRecommendationSerializer(itins, many=True).data
        cache.set(f"recommendations:user:{user.id}:itineraries", itin_data, timeout=3600)

        count += 1

    return f"✅ Cached recommendations for {count} active users"

@shared_task
def precache_single_user_recommendations(user_id):
    """
    Precompute recs for one user (triggered when cache is missing).
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return "❌ User not found"

    # Destinations
    dests = compute_recommended_destinations(user=user)
    dest_data = DestinationRecommendationSerializer(dests, many=True).data
    cache.set(f"recommendations:user:{user.id}:destinations", dest_data, timeout=3600)

    # Itineraries
    itins = compute_recommended_itineraries(user=user)
    itin_data = ItineraryRecommendationSerializer(itins, many=True).data
    cache.set(f"recommendations:user:{user.id}:itineraries", itin_data, timeout=3600)

    return f"✅ Cached recs for user {user.id}"

@shared_task
def precache_itineraries_by_category():
    """
    Precompute and cache category itineraries for all combinations of
    categories, destinations, duration, and budget filters.
    """
    factory = RequestFactory()
    categories = Category.objects.only("slug").all()
    destinations = Destination.objects.only("slug").all()

    budgets = [None, 10000, 25000, 50000, 100000]
    durations = [None, 3, 5, 7]
    pages = [1, 2]
    sizes = [10, 25]

    count = 0
    for category in categories:
        for dest in destinations:
            for budget in budgets:
                for duration in durations:
                    for page in pages:
                        for size in sizes:
                            params = {
                                "destination": dest.slug,
                                "budget_max": budget,
                                "duration_days": duration,
                                "page": page,
                                "page_size": size,
                            }
                            # clean out None values
                            params = {k: v for k, v in params.items() if v is not None}

                            req = factory.get(f"/api/categories/type/{category.slug}/", data=params)
                            resp = itineraries_by_category(req, category.slug)
                            cache_key = f"category:{category.slug}:{req.get_full_path()}"
                            cache.set(cache_key, resp.data, timeout=None)
                            count += 1
    return f"✅ Precomputed {count} category-itinerary cache entries"