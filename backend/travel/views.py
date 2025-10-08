from django.shortcuts import render
from .models import (Destination, Itinerary, DayPlan, Category, Tag, DestinationView,Attraction, Restaurant, 
                     Experience, Rating, DayBudget, BudgetBreakdown, FavoriteItinerary)
from .serializers import (HomeDestinationSerializer, HomeCategorySerializer,DestinationWithItinerariesSerializer, 
                          ItinerarySerializer, ItineraryDetailSerializer, ItineraryListSerializer, DestinationDwellSerializer, 
                          DestinationDetailSerializer,AttractionSerializer,RestaurantSerializer, DestinationListSerializer, ItineraryCardSerializer,
                          ItineraryWriteSerializer,FavoriteItinerarySerializer, DestinationRecommendationSerializer,ItineraryRecommendationSerializer,
                          AttractionSearchSerializer)
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now, timedelta
from django.db.models import Count, Sum, Q, Avg
from .serializers import RatingSerializer
from django.contrib.contenttypes.models import ContentType
from django.core.cache import cache
from rest_framework.pagination import PageNumberPagination
from django.contrib.postgres.search import TrigramSimilarity
from django.db import connection
from cloudinary import config as cloudinary_config
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.db import transaction, IntegrityError
from .utils import clone_itinerary_for_user, compute_recommended_destinations, compute_recommended_itineraries
from rest_framework.pagination import CursorPagination, Cursor
from django.db import models
from django.db.models import Value, CharField, F

@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes([AllowAny])  
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def home(request):
    trending_places = Destination.objects.filter(is_trending=True)
    return render(request, "home.html", {"trending_places": trending_places})


# @api_view(['GET'])# Keeping this api for million users
# def trending_destinations_api(request):
#     trending_destinations = Destination.objects.filter(is_trending=True).order_by('-id')[:10]
#     serializer = HomeDestinationSerializer(trending_destinations, many=True)
#     return Response({"trending_destinations": serializer.data})

@api_view(['GET'])
def trending_destinations_api(request):
    trending = Destination.objects.order_by("-trending_score")[:10]
    serializer = HomeDestinationSerializer(trending, many=True)
    return Response({"trending_destinations": serializer.data})


from django.db.models import Prefetch
@api_view(['GET'])
def destination_detail_api(request, slug=None):
    category_slug = request.query_params.get("category")
    duration_days = request.query_params.get("duration_days")
    budget_max = request.query_params.get("budget_max")

    # ----- Single destination -----
    if slug:
        
        destination = (
            Destination.objects
            .prefetch_related(
                Prefetch("itineraries__days__attractions", queryset=Attraction.objects.prefetch_related("images")),
                Prefetch("itineraries__days__restaurants", queryset=Restaurant.objects.all()),
                Prefetch("itineraries__days__extra_experiences", queryset=Experience.objects.all()),
                Prefetch("itineraries__days__budget", queryset=DayBudget.objects.all()),
            )
            .select_related("location")
            .filter(slug=slug)
            .first()
        )
        if not destination:
            return Response({"error": "Destination not found"}, status=404)

        itineraries = destination.itineraries.all().order_by("id")

        if category_slug:
            itineraries = itineraries.filter(category__slug=category_slug)
        if duration_days:
            itineraries = itineraries.filter(duration_days=duration_days)
        if budget_max:
            itineraries = itineraries.filter(total_budget__lte=budget_max)

        # paginate itineraries
        paginator = StandardResultsSetPagination()
        itineraries_page = paginator.paginate_queryset(itineraries, request)

        destination_data = DestinationWithItinerariesSerializer(destination).data
        destination_data["itineraries"] = ItinerarySerializer(itineraries_page, many=True).data

        return paginator.get_paginated_response(destination_data)

    # ----- All destinations -----
    destinations = (
        Destination.objects
        .prefetch_related("itineraries")
        .select_related("location")
        .all()
        .order_by("id")
    )
    dest_paginator = StandardResultsSetPagination()
    dest_page = dest_paginator.paginate_queryset(destinations, request)

    results = []
    for destination in dest_page:
        itineraries = destination.itineraries.all().order_by("id")
        if category_slug:
            itineraries = itineraries.filter(category__slug=category_slug)
        if duration_days:
            itineraries = itineraries.filter(duration_days=duration_days)
        if budget_max:
            itineraries = itineraries.filter(total_budget__lte=budget_max)

        # paginate itineraries per destination
        itin_paginator = StandardResultsSetPagination()
        itin_page = itin_paginator.paginate_queryset(itineraries, request)

        dest_data = DestinationWithItinerariesSerializer(destination).data
        dest_data["itineraries"] = {
            "count": itin_paginator.page.paginator.count,
            "next": itin_paginator.get_next_link(),
            "previous": itin_paginator.get_previous_link(),
            "results": ItinerarySerializer(itin_page, many=True).data,
        }
        results.append(dest_data)

    return dest_paginator.get_paginated_response(results)



@api_view(['GET'])
def itineraries_by_tag(request, tag_slug):
    tag = get_object_or_404(Tag, slug=tag_slug)
    itineraries = tag.itineraries.select_related("destination").all()

    # Optional filters
    destination_slug = request.query_params.get("destination")
    budget_max = request.query_params.get("budget_max")

    if destination_slug:
        itineraries = itineraries.filter(destination__slug=destination_slug)
    if budget_max:
        itineraries = itineraries.filter(total_budget__lte=budget_max)

    serializer = ItineraryListSerializer(itineraries, many=True)
    return Response({
        "tag": {"id": tag.id, "name": tag.name, "slug": tag.slug},
        "itineraries": serializer.data
    })



@api_view(["GET"])
def itineraries_by_category(request, category_slug):
    try:
        page_size = min(max(int(request.GET.get("page_size", 25)), 1), 50)
    except ValueError:
        page_size = 25
    try:
        page = max(int(request.GET.get("page", 1)), 1)
    except ValueError:
        page = 1
    offset = (page - 1) * page_size

    destination_slug = request.GET.get("destination")
    budget_max = request.GET.get("budget_max")
    duration_days = request.GET.get("duration_days")
    prefix = _abs_url_prefix()

    cache_key = f"category:{category_slug}:{request.get_full_path()}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)
    
    # ✅ Resolve category_id
    category = get_object_or_404(Category.objects.only("id", "name", "slug"), slug=category_slug)

    # ✅ Resolve destination_id once (avoid join on slug)
    dest_id = None
    if destination_slug:
        dest_id = Destination.objects.only("id").filter(slug=destination_slug).values_list("id", flat=True).first()
        if not dest_id:
            return Response({"count": 0, "results": {"category": {"id": category.id, "name": category.name, "slug": category.slug}, "itineraries": []}})

    # ---- COUNT (cheap) ----
    count_sql = "SELECT COUNT(*) FROM travel_itinerary_categories ic WHERE ic.category_id = %s"
    count_params = [category.id]

    with connection.cursor() as cursor:
        cursor.execute(count_sql, count_params)
        total = cursor.fetchone()[0]

    if total == 0:
        return Response({
            "count": 0, "next": None, "previous": None,
            "results": {"category": {"id": category.id, "name": category.name, "slug": category.slug}, "itineraries": []}
        })

    # ---- DATA ----
    data_sql = """
        SELECT
            i.id,
            i.title,
            i.slug,
            i.duration_days,
            i.duration_nights,
            i.total_budget,
            i.popularity_score,
            i.short_description,
            CASE
                WHEN i.thumbnail IS NULL OR i.thumbnail = '' THEN NULL
                WHEN i.thumbnail LIKE 'http%%' THEN i.thumbnail
                ELSE %s || i.thumbnail
            END AS thumbnail,
            d.id AS destination_id,
            d.name AS destination_name,
            d.slug AS destination_slug
        FROM travel_itinerary i
        JOIN travel_itinerary_categories ic ON ic.itinerary_id = i.id
        JOIN travel_destination d ON i.destination_id = d.id
        WHERE ic.category_id = %s
    """
    data_params = [prefix, category.id]

    if dest_id:
        data_sql += " AND i.destination_id = %s"
        data_params.append(dest_id)
    if budget_max:
        data_sql += " AND i.total_budget <= %s"
        data_params.append(budget_max)
    if duration_days:
        data_sql += " AND i.duration_days = %s"
        data_params.append(duration_days)

    data_sql += " LIMIT %s OFFSET %s"
    data_params.extend([page_size, offset])

    with connection.cursor() as cursor:
        cursor.execute(data_sql, data_params)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    next_url = _build_link(request, page + 1) if (offset + page_size) < total else None
    prev_url = _build_link(request, page - 1) if page > 1 else None
    response_data = {
        "count": total,
        "next": next_url,
        "previous": prev_url,
        "results": {
            "category": {"id": category.id, "name": category.name, "slug": category.slug},
            "itineraries": rows,
        },
    }
    cache.set(cache_key, response_data, timeout=3600)

    return Response(response_data)
    
    
    
# @api_view(["GET"])
# def destination_list_api(request):
#     trending = request.GET.get("trending")
#     country = request.GET.get("country")
#     q = request.GET.get("q")

#     # pagination
#     try:
#         page_size = min(max(int(request.GET.get(PAGE_SIZE_PARAM, DEFAULT_PAGE_SIZE)), 1), MAX_PAGE_SIZE)
#     except ValueError:
#         page_size = DEFAULT_PAGE_SIZE
#     try:
#         page = max(int(request.GET.get(PAGE_PARAM, 1)), 1)
#     except ValueError:
#         page = 1
#     offset = (page - 1) * page_size

#     prefix = _abs_url_prefix()

#     # ---- 1. Count query (cheap, no limit/offset/order) ----
#     count_sql = """
#         SELECT COUNT(*)
#         FROM travel_destination d
#         LEFT JOIN travel_location l ON d.location_id = l.id
#         WHERE 1=1
#     """
#     params = []

#     if trending == "true":
#         count_sql += " AND d.is_trending = TRUE"
#     if country:
#         count_sql += " AND l.country = %s"
#         params.append(country)
#     if q:
#         count_sql += " AND d.name ILIKE %s"
#         params.append(f"%{q}%")

#     with connection.cursor() as cursor:
#         cursor.execute(count_sql, params)
#         total = cursor.fetchone()[0]

#     if total == 0:
#         return Response({"count": 0, "next": None, "previous": None, "results": []})

#     # ---- 2. Data query (fast with limit/offset) ----
#     data_sql = f"""
#         WITH primary_images AS (
#             SELECT DISTINCT ON (di.destination_id) 
#                 di.destination_id,
#                 CASE
#                     WHEN di.image LIKE 'http%%' THEN di.image
#                     ELSE %s || di.image
#                 END AS primary_image
#             FROM travel_destinationimage di
#             WHERE di.is_primary = TRUE
#             ORDER BY di.destination_id, di.id ASC
#         )
#         SELECT
#             d.id,
#             d.name,
#             d.slug,
#             d.description,
#             CASE
#                 WHEN d.image IS NULL OR d.image = '' THEN NULL
#                 WHEN d.image LIKE 'http%%' THEN d.image
#                 ELSE %s || d.image
#             END AS fallback_image,
#             pi.primary_image
#         FROM travel_destination d
#         LEFT JOIN travel_location l ON d.location_id = l.id
#         LEFT JOIN primary_images pi ON pi.destination_id = d.id
#         WHERE 1=1
#     """

#     data_params = [prefix, prefix]

#     if trending == "true":
#         data_sql += " AND d.is_trending = TRUE"
#     if country:
#         data_sql += " AND l.country = %s"
#         data_params.append(country)
#     if q:
#         data_sql += " AND d.name ILIKE %s"
#         data_params.append(f"%{q}%")

#     data_sql += " ORDER BY d.id ASC LIMIT %s OFFSET %s"
#     data_params.extend([page_size, offset])

#     with connection.cursor() as cursor:
#         cursor.execute(data_sql, data_params)
#         cols = [c[0] for c in cursor.description]
#         rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

#     # pagination links
#     next_url = _build_link(request, page + 1) if (offset + page_size) < total else None
#     prev_url = _build_link(request, page - 1) if page > 1 else None

#     return Response({
#         "count": total,
#         "next": next_url,
#         "previous": prev_url,
#         "results": rows,
#     })
    
    
@api_view(["POST"])
def destination_view_api(request, slug):
    destination = get_object_or_404(Destination, slug=slug)
    session_id = request.session.session_key or request.session.create()
    ip = request.META.get("REMOTE_ADDR")

    DestinationView.objects.create(
        destination=destination,
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id,
        ip_address=ip,
        action_type=DestinationView.VIEW
    )
    return Response({"message": "View recorded"})



@api_view(["POST"])
def destination_dwell_api(request, slug):
    destination = get_object_or_404(Destination, slug=slug)
    session_id = request.session.session_key or request.session.create()
    ip = request.META.get("REMOTE_ADDR")

    dwell_time = int(request.data.get("dwell_time", 0))

    DestinationView.objects.create(
        destination=destination,
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id,
        ip_address=ip,
        action_type=DestinationView.DWELL,
        dwell_time=dwell_time
    )
    return Response({"message": f"Dwell time {dwell_time}s recorded"})


@api_view(["POST"])
def destination_click_api(request, slug):
    destination = get_object_or_404(Destination, slug=slug)
    session_id = request.session.session_key or request.session.create()
    ip = request.META.get("REMOTE_ADDR")

    click_target = request.data.get("click_target", "unknown")

    DestinationView.objects.create(
        destination=destination,
        user=request.user if request.user.is_authenticated else None,
        session_id=session_id,
        ip_address=ip,
        action_type=DestinationView.CLICK,
        click_target=click_target
    )
    return Response({"message": f"Click recorded on {click_target}"})


def log_destination_view(request, destination):
    session_id = request.session.session_key or request.session.create()
    ip = request.META.get("REMOTE_ADDR")
    DestinationView.objects.create(destination=destination, session_id=session_id, ip_address=ip)




MODEL_MAP = {
    "itinerary": Itinerary,
    "attraction": Attraction,
    "restaurant": Restaurant,
    "experience": Experience,
}

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])  # only logged-in users can rate
# def add_rating(request, model_name, object_id):
#     if model_name not in MODEL_MAP:
#         return Response({"error": "Invalid model"}, status=400)

#     model = MODEL_MAP[model_name]
#     try:
#         obj = model.objects.get(id=object_id)
#     except model.DoesNotExist:
#         return Response({"error": "Object not found"}, status=404)

#     rating_value = int(request.data.get("rating", 0))
#     review_text = request.data.get("review", "")

#     if rating_value < 1 or rating_value > 5:
#         return Response({"error": "Rating must be between 1 and 5"}, status=400)

#     # save or update rating
#     content_type = ContentType.objects.get_for_model(model)
#     rating, created = Rating.objects.update_or_create(
#         user=request.user,
#         content_type=content_type,
#         object_id=obj.id,
#         defaults={"rating": rating_value, "review": review_text}
#     )

#     return Response(RatingSerializer(rating).data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])  # only logged-in users can rate
def add_rating(request, model_name, object_id):
    model = MODEL_MAP.get(model_name)
    if not model:
        return Response({"error": "Invalid model"}, status=400)

    # Only fetch ID, not full object (faster than .get())
    if not model.objects.filter(id=object_id).exists():
        return Response({"error": "Object not found"}, status=404)

    try:
        rating_value = int(request.data.get("rating", 0))
    except (TypeError, ValueError):
        return Response({"error": "Invalid rating value"}, status=400)

    if rating_value < 1 or rating_value > 5:
        return Response({"error": "Rating must be between 1 and 5"}, status=400)

    review_text = request.data.get("review", "")

    content_type = ContentType.objects.get_for_model(model, for_concrete_model=False)

    # Use transaction to avoid race conditions
    try:
        with transaction.atomic():
            rating, created = Rating.objects.update_or_create(
                user=request.user,
                content_type=content_type,
                object_id=object_id,
                defaults={"rating": rating_value, "review": review_text},
            )
    except IntegrityError:
        return Response({"error": "Database error while saving rating"}, status=500)

    # Small optimization: only serialize the fields you need
    return Response(
        {
            "id": rating.id,
            "rating": rating.rating,
            "review": rating.review,
            "user": request.user.id,
            "object_id": rating.object_id,
        },
        status=status.HTTP_201_CREATED,
    )

class RatingsCursorPagination(CursorPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100
    ordering = "-created_at"  # newest first


@api_view(["GET"])
@permission_classes([AllowAny])
def get_ratings(request, model_name, object_id):
    model = MODEL_MAP.get(model_name)
    if not model:
        return Response({"error": "Invalid model"}, status=400)

    obj = model.objects.filter(id=object_id).only("id", "name", "title").first()
    if not obj:
        return Response({"error": "Object not found"}, status=404)

    content_type = ContentType.objects.get_for_model(model, for_concrete_model=False)

    ratings_qs = Rating.objects.filter(
        content_type=content_type,
        object_id=obj.id
    ).values("id", "user_id", "rating", "review", "created_at")

    paginator = RatingsCursorPagination()
    ratings_page = paginator.paginate_queryset(ratings_qs, request)

    agg = ratings_qs.aggregate(avg=Avg("rating"), count=Count("id"))

    return paginator.get_paginated_response({
        "object": {
            "id": obj.id,
            "name": getattr(obj, "title", getattr(obj, "name", "")),
        },
        "ratings": list(ratings_page),
        "average_rating": agg["avg"] or 0,
        "total_reviews": agg["count"],
    })

# @api_view(["GET"])
# @permission_classes([AllowAny])  # anyone can view ratings
# def get_ratings(request, model_name, object_id):
#     if model_name not in MODEL_MAP:
#         return Response({"error": "Invalid model"}, status=400)

#     model = MODEL_MAP[model_name]
#     try:
#         obj = model.objects.get(id=object_id)
#     except model.DoesNotExist:
#         return Response({"error": "Object not found"}, status=404)

#     content_type = ContentType.objects.get_for_model(model)
#     ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)

#     serializer = RatingSerializer(ratings, many=True)
#     avg_rating = ratings.aggregate(avg=Avg("rating"))["avg"]
#     total_reviews = ratings.aggregate(count=Count("id"))["count"]

#     return Response({
#         "object": {"id": obj.id, "name": getattr(obj, "title", getattr(obj, "name", ""))},
#         "ratings": serializer.data,
#         "average_rating": avg_rating or 0,
#         "total_reviews": total_reviews
#     })

@api_view(["GET"])
def recommended_destinations_api(request):
    user = request.user if request.user.is_authenticated else None
    session_id = request.session.session_key or request.session.create()

    try:
        limit = min(max(int(request.GET.get("limit", 5)), 1), 20)
    except ValueError:
        limit = 5

    # 🔹 Anonymous → Global recommendations
    if not user:
        cached = cache.get("recommendations:global:destinations")
        if cached:
            return Response({
                "recommended": cached[:limit],
                "all_destinations": cached
            })
        return Response({"recommended": [], "all_destinations": []})

    # 🔹 Authenticated → User recommendations
    cache_key = f"recommendations:user:{user.id}:destinations"
    cached = cache.get(cache_key)

    if cached:
        return Response({
            "recommended": cached[:limit],
            "all_destinations": cached
        })

    # No cache → return empty but trigger async recompute
    from .tasks import precache_single_user_recommendations
    precache_single_user_recommendations.delay(user.id)

    return Response({
        "recommended": [],
        "all_destinations": []
    })


# @api_view(["GET"])
# def recommended_destinations_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     try:
#         limit = min(max(int(request.GET.get("limit", 5)), 1), 20)
#     except ValueError:
#         limit = 5

#     # 🔹 Anonymous users → global precomputed cache only
#     if not user:
#         cached = cache.get("recommendations:global:destinations")
#         if cached:
#             return Response({
#                 "recommended": cached[:limit],
#                 "all_destinations": cached
#             })
#         return Response({"recommended": [], "all_destinations": []})  # no fallback

#     # 🔹 Logged-in users → per-user/session cache
#     cache_key = f"recommendations:user:{user.id if user else session_id}:limit:{limit}"
#     cached = cache.get(cache_key)
#     if cached:
#         return Response({"recommended": cached, "all_destinations": cached})

#     # If not cached, enqueue async compute
#     from .tasks import rebuild_recommendations
#     rebuild_recommendations.delay()  # background recompute
#     return Response({"recommended": [], "all_destinations": []})


# @api_view(["GET"])
# def recommended_destinations_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     # ✅ configurable limit (default 5, max 20)
#     try:
#         limit = min(max(int(request.GET.get("limit", 5)), 1), 20)
#     except ValueError:
#         limit = 5

#     # 🔹 Global cache for anonymous users
#     if not user:
#         cached = cache.get("recommendations:global:destinations")
#         if cached:
#             return Response({
#                 "recommended": cached[:limit],
#                 "all_destinations": cached
#             })

#         # fallback if cache empty (rare, e.g., after restart)
#         results = compute_recommended_destinations()
#         serializer = DestinationRecommendationSerializer(results, many=True)
#         return Response({
#             "recommended": serializer.data[:limit],
#             "all_destinations": serializer.data
#         })

#     # 🔹 Per-user/session cache
#     cache_key = f"recommendations:user:{user.id if user else session_id}:limit:{limit}"
#     cached = cache.get(cache_key)
#     if cached:
#         return Response({"recommended": cached, "all_destinations": cached})

#     results = compute_recommended_destinations(user=user, session_id=session_id)
#     serializer = DestinationRecommendationSerializer(results, many=True)
#     data = serializer.data

#     # cache only "all" once, always slice by limit
#     cache.set(cache_key, data, timeout=300)

#     return Response({
#         "recommended": data[:limit],
#         "all_destinations": data
#     })

# @api_view(["GET"])
# def recommended_destinations_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     # Global cache for anonymous users
#     if not user:
#         cached = cache.get("recommendations:global:destinations")
#         if cached:
#             return Response({"recommended": cached[:5], "all_destinations": cached})

#     # Per-user/session cache
#     cache_key = f"recommendations:user:{user.id if user else session_id}"
#     cached = cache.get(cache_key)
#     if cached:
#         return Response(cached)

#     results = compute_recommended_destinations(user=user, session_id=session_id)

#     serializer = DestinationRecommendationSerializer(results, many=True)
#     data = {
#         "recommended": serializer.data[:5],
#         "all_destinations": serializer.data
#     }

#     cache.set(cache_key, data, timeout=300)
#     return Response(data)

# @api_view(["GET"])
# def recommended_destinations_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     if not user:  # Anonymous → use precomputed cache
#         cached = cache.get("recommendations:global:destinations")
#         if cached:
#             return Response({"recommended": cached[:5], "all_destinations": cached})

#     # Logged-in → per-user cache
#     cache_key = f"recommendations:user:{user.id if user else session_id}"
#     cached = cache.get(cache_key)
#     if cached:
#         return Response(cached)

#     results = compute_recommended_destinations(user=user, session_id=session_id)
#     serializer = DestinationDetailSerializer(results, many=True)
#     data = {"recommended": serializer.data[:5], "all_destinations": serializer.data}
#     cache.set(cache_key, data, timeout=300)
#     return Response(data)

# @api_view(["GET"])
# def recommended_destinations_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     # Track either by user or anonymous session
#     filters = {"user": user} if user else {"session_id": session_id}
#     user_views = (
#         DestinationView.objects.filter(**filters)
#         .values("destination")
#         .annotate(
#             views=Count("id", filter=Q(action_type="view")),
#             dwell=Avg("dwell_time", filter=Q(action_type="dwell")),
#             clicks=Count("id", filter=Q(action_type="click")),
#         )
#     )
#     signal_map = {row["destination"]: row for row in user_views}

#     results = []
#     for dest in Destination.objects.all():
#         signals = signal_map.get(dest.id, {"views": 0, "dwell": 0, "clicks": 0})
#         views = signals["views"] or 0
#         dwell = signals["dwell"] or 0
#         clicks = signals["clicks"] or 0

#         # Aggregate popularity from itineraries
#         popularity = (
#             Itinerary.objects.filter(destination=dest)
#             .aggregate(total_pop=Sum("popularity_score"))["total_pop"] or 0
#         )

#         score = (0.2 * views) + (0.4 * dwell) + (0.3 * clicks) + (0.1 * popularity)
#         results.append((dest, score))

#     results.sort(key=lambda x: x[1], reverse=True)
#     sorted_destinations = [dest for dest, score in results]

#     if not user_views:
#         trending = list(Destination.objects.filter(is_trending=True))
#         trending_ids = [t.id for t in trending]
#         sorted_destinations = trending + [d for d in Destination.objects.exclude(id__in=trending_ids)]

#     serializer = DestinationDetailSerializer(sorted_destinations, many=True)
#     return Response({
#         "recommended": serializer.data[:5],
#         "all_destinations": serializer.data
#     })

@api_view(["GET"])
def recommended_itineraries_api(request):
    user = request.user if request.user.is_authenticated else None
    session_id = request.session.session_key or request.session.create()

    # configurable limit param (default 5, max 20)
    try:
        limit = min(max(int(request.GET.get("limit", 5)), 1), 20)
    except ValueError:
        limit = 5

    cache_key = f"recommendations:itineraries:{user.id if user else session_id}:limit:{limit}"
    cached = cache.get(cache_key)
    if cached:
        return Response({"recommended": cached})

    # Compute recommendations
    results = compute_recommended_itineraries(user=user, session_id=session_id)

    serializer = ItineraryRecommendationSerializer(results, many=True)
    data = {"recommended": serializer.data[:limit]}  # ✅ configurable limit

    cache.set(cache_key, data["recommended"], timeout=300)
    return Response(data)

# @api_view(["GET"])
# def recommended_itineraries_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     cache_key = f"recommendations:itineraries:{user.id if user else session_id}"
#     cached = cache.get(cache_key)
#     if cached:
#         return Response({"recommended": cached})

#     # Compute recommendations
#     results = compute_recommended_itineraries(user=user, session_id=session_id)

#     serializer = ItineraryRecommendationSerializer(results, many=True)
#     data = {"recommended": serializer.data[:5]}  # ✅ only recommended, not all

#     cache.set(cache_key, data["recommended"], timeout=300)
#     return Response(data)


# @api_view(["GET"])
# def recommended_itineraries_api(request):
#     user = request.user if request.user.is_authenticated else None
#     session_id = request.session.session_key or request.session.create()

#     filters = {"user": user} if user else {"session_id": session_id}
#     user_views = (
#         DestinationView.objects.filter(**filters)
#         .values("destination")
#         .annotate(
#             views=Count("id", filter=Q(action_type="view")),
#             dwell=Avg("dwell_time", filter=Q(action_type="dwell")),
#             clicks=Count("id", filter=Q(action_type="click")),
#         )
#     )
#     signal_map = {row["destination"]: row for row in user_views}

#     results = []
#     for itin in Itinerary.objects.select_related("destination").all():
#         signals = signal_map.get(itin.destination_id, {"views": 0, "dwell": 0, "clicks": 0})
#         views = signals["views"] or 0
#         dwell = signals["dwell"] or 0
#         clicks = signals["clicks"] or 0

#         score = (0.2 * views) + (0.4 * dwell) + (0.3 * clicks) + (0.1 * itin.popularity_score)
#         results.append((itin, score))

#     results.sort(key=lambda x: x[1], reverse=True)
#     sorted_itineraries = [itin for itin, score in results]

#     if not user_views:
#         trending = list(Itinerary.objects.filter(destination__is_trending=True))
#         trending_ids = [t.id for t in trending]
#         sorted_itineraries = trending + [i for i in Itinerary.objects.exclude(id__in=trending_ids)]

#     serializer = ItinerarySerializer(sorted_itineraries, many=True)
#     return Response({
#         "recommended": serializer.data[:5],
#         "all_itineraries": serializer.data
#     })
    
    
@api_view(["GET"])
def search_suggestions(request):
    query = request.GET.get("q", "").strip().lower()
    if not query:
        return Response({"results": []})

    cache_key = f"search_suggestions:{query}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)

    limit = 5  # small and fast

    # Use .values() instead of serializing whole objects
    destinations = list(
        Destination.objects.filter(name__icontains=query)
        .only("id", "name", "slug", "image")
        .values("id", "name", "slug", "image")[:limit]
    )

    itineraries = list(
        Itinerary.objects.filter(
            Q(title__icontains=query) | Q(highlighted_places__icontains=query)
        )
        .only("id", "title", "slug", "thumbnail")
        .values("id", "title", "slug", "thumbnail")[:limit]
    )

    attractions = list(
        Attraction.objects.filter(name__icontains=query)
        .only("id", "name", "image")
        .values("id", "name", "image")[:limit]
    )

    data = {
        "destinations": destinations,
        "itineraries": itineraries,
        "attractions": attractions,
    }

    # Cache results for 30s
    cache.set(cache_key, data, timeout=30)

    return Response(data)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 50


@api_view(["GET"])
def search_results(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response({"results": []})

    # Filters
    min_budget = request.GET.get("min_budget")
    max_budget = request.GET.get("max_budget")
    category = request.GET.get("category")
    min_days = request.GET.get("min_days")
    max_days = request.GET.get("max_days")
    sort = request.GET.get("sort")

    # --- Destinations ---
    if connection.vendor == "sqlite":
        destinations = Destination.objects.filter(name__icontains=query).values(
            "id", "name", "slug", "image"
        )[:10]
    else:
        destinations = Destination.objects.annotate(
            similarity=TrigramSimilarity("name", query)
        ).filter(similarity__gt=0.3).order_by("-similarity").values(
            "id", "name", "slug", "image"
        )[:10]

    # --- Itineraries ---
    if connection.vendor == "sqlite":
        itineraries = Itinerary.objects.filter(
            title__icontains=query
        ) | Itinerary.objects.filter(
            highlighted_places__icontains=query
        )
    else:
        itineraries = Itinerary.objects.annotate(
            similarity=TrigramSimilarity("title", query) +
                       TrigramSimilarity("highlighted_places", query)
        ).filter(similarity__gt=0.3)

    # Apply filters
    if min_budget:
        itineraries = itineraries.filter(total_budget__gte=min_budget)
    if max_budget:
        itineraries = itineraries.filter(total_budget__lte=max_budget)
    if category:
        itineraries = itineraries.filter(category__slug=category)
    if min_days:
        itineraries = itineraries.filter(duration_days__gte=min_days)
    if max_days:
        itineraries = itineraries.filter(duration_days__lte=max_days)

    # Apply sorting
    if sort == "budget_asc":
        itineraries = itineraries.order_by("total_budget")
    elif sort == "budget_desc":
        itineraries = itineraries.order_by("-total_budget")
    elif sort == "duration_asc":
        itineraries = itineraries.order_by("duration_days")
    elif sort == "duration_desc":
        itineraries = itineraries.order_by("-duration_days")
    elif sort == "popularity":
        itineraries = itineraries.order_by("-popularity_score")
    else:
        if connection.vendor == "sqlite":
            itineraries = itineraries.order_by("title")
        else:
            itineraries = itineraries.order_by("-similarity")

    # Pagination
    paginator = StandardResultsSetPagination()
    paginated_itineraries = paginator.paginate_queryset(
        itineraries.values(
            "id", "title", "slug", "duration_days", "duration_nights",
            "total_budget", "thumbnail", "popularity_score"
        ),
        request
    )

    # --- Attractions ---
    if connection.vendor == "sqlite":
        attractions = Attraction.objects.filter(
            name__icontains=query
        ).values("id", "name", "image")[:10]
    else:
        attractions = Attraction.objects.annotate(
            similarity=TrigramSimilarity("name", query)
        ).filter(similarity__gt=0.3).order_by("-similarity").values(
            "id", "name", "image"
        )[:10]

    return paginator.get_paginated_response({
        "destinations": list(destinations),
        "itineraries": list(paginated_itineraries),
        "attractions": list(attractions)
    })
    

@api_view(["GET"])
def search_attractions(request):
    query = request.GET.get("q", "").strip()
    city = request.GET.get("city", "").strip()
    state = request.GET.get("state", "").strip()
    country = request.GET.get("country", "").strip()

    if not query and not any([city, state, country]):
        return Response({"count": 0, "results": []})

    # Cache hot queries (5–15 mins)
    cache_key = f"attractions:{query}:{city}:{state}:{country}:{request.GET.get('page',1)}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)

    # Build filters (denormalized fields → no JOINs)
    filters = Q()
    if city:
        filters &= Q(city__iexact=city)
    if state:
        filters &= Q(state__iexact=state)
    if country:
        filters &= Q(country__iexact=country)

    # Base queryset — lightweight fields only
    qs = (
        Attraction.objects
        .only(
            "id", "name", "description", "image",
            "estimated_cost", "latitude", "longitude",
            "google_place_id", "address",
            "city", "state", "country"
        )
        .filter(filters)
        .order_by("id")
    )

    # Typo-tolerant fuzzy search on name
    if query:
        qs = qs.annotate(similarity=TrigramSimilarity("name", query)) \
               .filter(similarity__gt=0.2) \
               .order_by("-similarity")

        # Fallback: icontains if trigram fails
        if not qs.exists():
            qs = Attraction.objects.filter(filters & Q(name__icontains=query))

    # Pagination
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(qs, request)
    serializer = AttractionSearchSerializer(page, many=True)

    response_data = paginator.get_paginated_response(serializer.data).data
    cache.set(cache_key, response_data, 900)  # 15 min cache

    return Response(response_data)

# @api_view(["GET"])
# def search_attractions(request):
#     """
#     Search attractions by name, city, state, or country.
#     Example: /api/attractions/search/?name=beach&city=Goa&country=India
#     """
#     name = request.GET.get("name")
#     city = request.GET.get("city")
#     state = request.GET.get("state")
#     country = request.GET.get("country")

#     queryset = Attraction.objects.select_related("location").all()

#     if name:
#         queryset = queryset.filter(name__icontains=name)
#     if city:
#         queryset = queryset.filter(location__city__iexact=city)
#     if state:
#         queryset = queryset.filter(location__state__iexact=state)
#     if country:
#         queryset = queryset.filter(location__country__iexact=country)


    
#     paginator = StandardResultsSetPagination()
#     result_page = paginator.paginate_queryset(queryset, request)
#     serializer = AttractionSerializer(result_page, many=True)

#     return paginator.get_paginated_response(serializer.data)



PAGE_PARAM = "page"
PAGE_SIZE_PARAM = "page_size"
DEFAULT_PAGE_SIZE = 25
MAX_PAGE_SIZE = 50

def _abs_url_prefix():
    cloud_name = cloudinary_config().cloud_name or "" 
    return f"https://res.cloudinary.com/{cloud_name}/"

def _build_link(request, page):
    # rebuild URL with a different ?page=
    url = request.build_absolute_uri()
    parsed = urlparse(url)
    q = parse_qs(parsed.query)
    q[PAGE_PARAM] = [str(page)]
    new_q = urlencode({k: v[0] if isinstance(v, list) else v for k, v in q.items()})
    return urlunparse(parsed._replace(query=new_q))

import time
@api_view(["GET"])  #v1 500ms
def destination_list_api(request):
    
    cache_key = f"destinations:{request.get_full_path()}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)

    
    cache_key = f"destinations:{request.get_full_path()}"
    start = time.time()
    cached = cache.get(cache_key)
    if cached:
        print(f"[CACHE HIT] {cache_key} in {time.time()-start:.4f}s")
        return Response(cached)
    print(f"[CACHE MISS] {cache_key}")
    
    trending = request.GET.get("trending")
    country = request.GET.get("country")
    q = request.GET.get("q")

    # pagination inputs
    try:
        page_size = int(request.GET.get(PAGE_SIZE_PARAM, DEFAULT_PAGE_SIZE))
    except ValueError:
        page_size = DEFAULT_PAGE_SIZE
    page_size = min(max(page_size, 1), MAX_PAGE_SIZE)

    try:
        page = int(request.GET.get(PAGE_PARAM, 1))
    except ValueError:
        page = 1
    page = max(page, 1)

    offset = (page - 1) * page_size
    prefix = _abs_url_prefix()

    # ---- RAW SQL with absolute Cloudinary URLs + total_count window ----
    sql = """
        SELECT
            d.id,
            d.name,
            d.slug,
            d.description,
            CASE
                WHEN d.image IS NULL OR d.image = '' THEN NULL
                WHEN d.image LIKE 'http%%' THEN d.image
                ELSE %s || d.image
            END AS fallback_image,
            COALESCE(
                (
                    SELECT CASE
                               WHEN di.image LIKE 'http%%' THEN di.image
                               ELSE %s || di.image
                           END
                    FROM travel_destinationimage di
                    WHERE di.destination_id = d.id AND di.is_primary = TRUE
                    ORDER BY di.id ASC
                    LIMIT 1
                ),
                CASE
                    WHEN d.image IS NULL OR d.image = '' THEN NULL
                    WHEN d.image LIKE 'http%%' THEN d.image
                    ELSE %s || d.image
                END
            ) AS primary_image,
            ARRAY(
                SELECT CASE
                           WHEN di.image LIKE 'http%%' THEN di.image
                           ELSE %s || di.image
                       END
                FROM travel_destinationimage di
                WHERE di.destination_id = d.id
                ORDER BY di."order", di.id
            ) AS images,
            COUNT(*) OVER() AS total_count
        FROM travel_destination d
        LEFT JOIN travel_location l ON d.location_id = l.id
        WHERE 1=1
    """

    params = [prefix, prefix, prefix, prefix]

    if trending == "true":
        sql += " AND d.is_trending = TRUE"
    if country:
        sql += " AND l.country = %s"
        params.append(country)
    if q:
        sql += " AND d.name ILIKE %s"
        params.append(f"%{q}%")

    sql += " ORDER BY d.id ASC LIMIT %s OFFSET %s"
    params.extend([page_size, offset])

    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    total = rows[0]["total_count"] if rows else 0
    for r in rows:
        r.pop("total_count", None)

    next_url = _build_link(request, page + 1) if (offset + page_size) < total else None
    prev_url = _build_link(request, page - 1) if page > 1 else None

    response_data = {
        "count": total,
        "next": next_url,
        "previous": prev_url,
        "results": rows,
    }
    cache.set(cache_key, response_data, timeout=60)

    return Response(response_data)

class ItineraryCursorPagination(CursorPagination):
    page_size = 30
    page_size_query_param = "page_size"
    max_page_size = 50
    ordering = "id"  # or "-popularity_score" if you want popularity first


@api_view(["GET"])
def destination_itineraries_api(request, slug):
    paginator = ItineraryCursorPagination()
    page_size = paginator.get_page_size(request)

    # Decode cursor (position = last seen ID)
    cursor = paginator.decode_cursor(request)
    reverse = cursor and cursor.reverse
    position = cursor.position[0] if cursor else None

    # WHERE clause based on cursor
    params = [slug]
    where_clause = ""
    if position:
        if reverse:
            where_clause = "AND i.id < %s"
        else:
            where_clause = "AND i.id > %s"
        params.append(position)

    sql = f"""
        SELECT i.id, i.title, i.slug, i.thumbnail,
               i.duration_days, i.duration_nights,
               i.total_budget, i.popularity_score,
               i.short_description
        FROM travel_itinerary i
        JOIN travel_destination d ON i.destination_id = d.id
        WHERE d.slug = %s {where_clause}
        ORDER BY i.id {"DESC" if reverse else "ASC"}
        LIMIT %s;
    """
    params.append(page_size + 1)

    cache_key = f"dest:{slug}:cursor:{request.get_full_path()}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)

    with connection.cursor() as cursor_obj:
        cursor_obj.execute(sql, params)
        cols = [c[0] for c in cursor_obj.description]
        rows = cursor_obj.fetchall()

    itineraries = [dict(zip(cols, r)) for r in rows]

    # Detect if there's a next page
    has_more = len(itineraries) > page_size
    if has_more:
        itineraries = itineraries[:page_size]

    # Build cursor links properly using DRF Cursor
    next_link = prev_link = None
    if itineraries:
        last_id = itineraries[-1]["id"]
        first_id = itineraries[0]["id"]

        if has_more:
            next_cursor = Cursor(offset=0, reverse=False, position=[last_id])
            next_link = paginator.encode_cursor(next_cursor)

        if cursor:  # only provide previous if we had a cursor before
            prev_cursor = Cursor(offset=0, reverse=True, position=[first_id])
            prev_link = paginator.encode_cursor(prev_cursor)

    response = {
        "next": f"{request.build_absolute_uri()}?cursor={next_link}" if next_link else None,
        "previous": f"{request.build_absolute_uri()}?cursor={prev_link}" if prev_link else None,
        "results": itineraries,
    }

    cache.set(cache_key, response, timeout=30)
    return Response(response)

# @api_view(["GET"])
# def destination_itineraries_api(request, slug):
#     # Pagination params
#     try:
#         page_size = int(request.GET.get("page_size", 30))
#     except ValueError:
#         page_size = 30
#     page_size = min(max(page_size, 1), 50)

#     try:
#         page = int(request.GET.get("page", 1))
#     except ValueError:
#         page = 1
#     page = max(page, 1)
#     offset = (page - 1) * page_size

#     cache_key = f"dest:{slug}:p:{page}:s:{page_size}"
#     cached = cache.get(cache_key)
#     if cached:
#         return Response(cached)

#     sql = """
#         SELECT i.id, i.title, i.slug, i.thumbnail,
#                i.duration_days, i.duration_nights,
#                i.total_budget, i.popularity_score,
#                i.short_description,
#                COUNT(*) OVER() AS total_count
#         FROM travel_itinerary i
#         JOIN travel_destination d ON i.destination_id = d.id
#         WHERE d.slug = %s
#         ORDER BY i.id
#         LIMIT %s OFFSET %s;
#     """

#     with connection.cursor() as cursor:
#         cursor.execute(sql, [slug, page_size, offset])
#         cols = [c[0] for c in cursor.description]
#         rows = cursor.fetchall()

#     if not rows:
#         return Response({"count": 0, "next": None, "previous": None, "results": []}, status=200)

#     itineraries = [dict(zip(cols, r)) for r in rows]
#     total_count = itineraries[0]["total_count"]

#     for itin in itineraries:
#         itin.pop("total_count")  # remove redundant per-row count

#     # Pagination links
#     base_url = request.build_absolute_uri(request.path)
#     query_params = request.GET.copy()
#     next_page, prev_page = None, None

#     if offset + page_size < total_count:
#         query_params["page"] = page + 1
#         next_page = f"{base_url}?{query_params.urlencode()}"
#     if page > 1:
#         query_params["page"] = page - 1
#         prev_page = f"{base_url}?{query_params.urlencode()}"

#     response = {
#         "count": total_count,
#         "next": next_page,
#         "previous": prev_page,
#         "results": itineraries,
#     }

#     cache.set(cache_key, response, 30)  # cache hot pages
#     return Response(response)
    
 
@api_view(["GET"])
def itinerary_detail_api(request, slug):
    cache_key = f"itinerary_detail:{slug}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached)

    sql = """
    WITH itinerary_base AS (
        SELECT i.id, i.title, i.slug, i.short_description,
               i.duration_days, i.duration_nights,
               i.total_budget, i.thumbnail,
               i.highlighted_places, i.popularity_score
        FROM travel_itinerary i
        WHERE i.slug = %s
        LIMIT 1
    )
    SELECT row_to_json(base)::jsonb || jsonb_build_object(
        'categories', (
            SELECT COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)), '[]'::json)
            FROM travel_itinerary_categories ic
            JOIN travel_category c ON c.id = ic.category_id
            WHERE ic.itinerary_id = base.id
        ),
        'tags', (
            SELECT COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)), '[]'::json)
            FROM travel_itinerary_tags it
            JOIN travel_tag t ON t.id = it.tag_id
            WHERE it.itinerary_id = base.id
        ),
        'budget_breakdown', (
            SELECT to_json(bb)
            FROM (
                SELECT stay, travel, food, misc
                FROM travel_budgetbreakdown bb
                WHERE bb.itinerary_id = base.id
                LIMIT 1
            ) bb
        ),
        'days', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'day_number', d.day_number,
                    'title', d.title,
                    'description', d.description,
                    'locations', d.locations,
                    'attractions', (
                        SELECT COALESCE(json_agg(
                            json_build_object(
                                'id', a.id,
                                'name', a.name,
                                'description', a.description,
                                'image', a.image,
                                'estimated_cost', a.estimated_cost,
                                'latitude', a.latitude,
                                'longitude', a.longitude,
                                'google_place_id', a.google_place_id,
                                'address', a.address
                            )
                        ORDER BY a.id), '[]'::json)
                        FROM travel_attraction a
                        WHERE a.day_plan_id = d.id
                    ),
                    'restaurants', (
                        SELECT COALESCE(json_agg(
                            json_build_object(
                                'id', r.id,
                                'name', r.name,
                                'cuisine', r.cuisine,
                                'description', r.description,
                                'image', r.image,
                                'estimated_cost', r.estimated_cost,
                                'latitude', r.latitude,
                                'longitude', r.longitude,
                                'google_place_id', r.google_place_id,
                                'address', r.address
                            )
                        ORDER BY r.id), '[]'::json)
                        FROM travel_restaurant r
                        WHERE r.day_plan_id = d.id
                    ),
                    'experiences', (
                        SELECT COALESCE(json_agg(
                            json_build_object(
                                'id', e.id,
                                'name', e.name,
                                'description', e.description,
                                'image', e.image,
                                'estimated_cost', e.estimated_cost
                            )
                        ORDER BY e.id), '[]'::json)
                        FROM travel_experience e
                        WHERE e.day_plan_id = d.id
                    ),
                    'budget', (
                        SELECT to_json(db)
                        FROM (
                            SELECT attractions_cost, restaurants_cost, experiences_cost,
                                   total_cost, estimated_cost,
                                   duration_minutes, start_time, end_time
                            FROM travel_daybudget db
                            WHERE db.day_plan_id = d.id
                            LIMIT 1
                        ) db
                    )
                )
            ORDER BY d.day_number), '[]'::json)
            FROM travel_dayplan d
            WHERE d.itinerary_id = base.id
        )
    ) AS full_json
    FROM itinerary_base base;
    """

    with connection.cursor() as cursor:
        cursor.execute(sql, [slug])
        row = cursor.fetchone()

    if not row:
        return Response({"detail": "Not found"}, status=404)

    data = row[0]
    if isinstance(data, str):  # psycopg2 sometimes returns str for json/jsonb
        data = json.loads(data)
    cache.set(cache_key, data, timeout=300)
    return Response(data)



class MyWorksPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def clone_itinerary_api(request, slug):
    """
    Clone any public itinerary to the authenticated user's workspace (My Works).
    """
    src = get_object_or_404(
        Itinerary.objects.select_related("destination"),
        slug=slug
    )
    # # Optional: restrict cloning to public or user’s own
    # if not src.is_public and src.created_by_id != request.user.id:
    #     return Response({"detail": "Not allowed to clone this itinerary."}, status=403)

    copy = clone_itinerary_for_user(src, request.user)
    return Response(
        {
            "message": "Itinerary cloned to your works.",
            "itinerary": ItineraryDetailSerializer(copy).data
        },
        status=201
    )


# @api_view(["GET", "POST"])
# @permission_classes([IsAuthenticated])
# def my_itineraries_api(request):
#     """
#     GET: list my works (custom itineraries + favorites)
#     POST: create a brand-new itinerary (nested).
#     """
#     if request.method == "GET":
#         # ---- 1) Custom Itineraries ----
#         custom_qs = (
#             Itinerary.objects
#             .filter(created_by=request.user)
#             .select_related("destination")
#             .order_by("-id")
#         )

#         # ---- 2) Favorites (with joined itinerary) ----
#         fav_qs = (
#             FavoriteItinerary.objects
#             .filter(user=request.user)
#             .select_related("itinerary", "itinerary__destination")
#             .order_by("-created_at")
#         )

#         # Normalize into a single list
#         combined = []

#         # custom
#         for itin in custom_qs:
#             combined.append({
#                 "type": "custom",
#                 "created_at": itin.created_at if hasattr(itin, "created_at") else None,
#                 "itinerary": ItineraryCardSerializer(itin).data
#             })

#         # favorites
#         for fav in fav_qs:
#             combined.append({
#                 "type": "favorite",
#                 "created_at": fav.created_at,
#                 "itinerary": ItineraryCardSerializer(fav.itinerary).data
#             })

#         # Sort by created_at desc (favorites + customs mixed)
#         combined.sort(key=lambda x: x["created_at"] or "", reverse=True)

#         # paginate combined manually
#         paginator = MyWorksPagination()
#         page = paginator.paginate_queryset(combined, request)
#         return paginator.get_paginated_response(page)

#     # POST (create new itinerary) unchanged
#     serializer = ItineraryWriteSerializer(data=request.data, context={"request": request})
#     if serializer.is_valid():
#         itin = serializer.save()
#         return Response(ItineraryDetailSerializer(itin).data, status=201)
#     return Response(serializer.errors, status=400)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def my_itineraries_api(request):
    if request.method == "GET":
        # ---- 1) Custom itineraries ----
        custom_qs = (
                Itinerary.objects
                .filter(created_by=request.user)
                .select_related("destination")
                .annotate(type=Value("custom", output_field=CharField()))
                .values("id", "created_at", "type")
            )

        # ---- 2) Favorite itineraries ----
        fav_qs = (
                    FavoriteItinerary.objects
                    .filter(user=request.user)
                    .select_related("itinerary", "itinerary__destination")
                    .annotate(
                        type=Value("favorite", output_field=CharField()),
                        target_id=F("itinerary_id")
                    )
                    .values("target_id", "created_at", "type")
                )

        # ---- 3) Combine with UNION ALL ----
        combined = custom_qs.union(fav_qs).order_by("-created_at")

        # ---- 4) Paginate ----
        paginator = MyWorksPagination()
        page = paginator.paginate_queryset(combined, request)

        # ---- 5) Fetch itineraries for page ----
        ids_by_type = [(row["id"], row["type"]) for row in page]
        results = []
        for id, type_ in ids_by_type:
            if type_ == "custom":
                itin = Itinerary.objects.select_related("destination").get(id=id)
                results.append({
                    "type": type_,
                    "created_at": itin.created_at,
                    "itinerary": ItineraryCardSerializer(itin).data
                })
            else:
                fav = FavoriteItinerary.objects.select_related("itinerary__destination").get(itinerary_id=id, user=request.user)
                results.append({
                    "type": type_,
                    "created_at": fav.created_at,
                    "itinerary": ItineraryCardSerializer(fav.itinerary).data
                })

        return paginator.get_paginated_response(results)

    # POST (create new itinerary)
    serializer = ItineraryWriteSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        itin = serializer.save()
        return Response(ItineraryDetailSerializer(itin).data, status=201)
    return Response(serializer.errors, status=400)






@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def my_itinerary_detail_api(request, slug):
    """
    View/modify/delete a single itinerary you own.
    """
    itin = get_object_or_404(Itinerary.objects.select_related("destination"), slug=slug)

    # Ownership check
    if not (request.user.is_staff or itin.created_by_id == request.user.id):
        return Response({"detail": "Not permitted."}, status=403)

    if request.method == "GET":
        return Response(ItineraryDetailSerializer(itin).data)

    if request.method == "PATCH":
        serializer = ItineraryWriteSerializer(itin, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            itin = serializer.save()
            return Response(ItineraryDetailSerializer(itin).data)
        return Response(serializer.errors, status=400)

    # DELETE
    itin.delete()
    return Response(status=204)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_favorite_itinerary(request, slug):
    """
    Mark an itinerary as favorite for current user.
    """
    itin = get_object_or_404(Itinerary, slug=slug)

    fav, created = FavoriteItinerary.objects.get_or_create(
        user=request.user, itinerary=itin
    )
    if created:
        return Response({"message": "Added to favorites."}, status=201)
    return Response({"message": "Already in favorites."}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_favorite_itinerary(request, slug):
    """
    Remove itinerary from favorites.
    """
    itin = get_object_or_404(Itinerary, slug=slug)
    deleted, _ = FavoriteItinerary.objects.filter(
        user=request.user, itinerary=itin
    ).delete()
    if deleted:
        return Response({"message": "Removed from favorites."}, status=200)
    return Response({"message": "Not in favorites."}, status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_favorite_itineraries(request):
    """
    List current user's favorite itineraries.
    """
    qs = (
        FavoriteItinerary.objects
        .filter(user=request.user)
        .select_related("itinerary", "itinerary__destination")
        .order_by("-created_at")
    )
    paginator = MyWorksPagination()
    page = paginator.paginate_queryset(qs, request)
    data = FavoriteItinerarySerializer(page, many=True).data
    return paginator.get_paginated_response(data)