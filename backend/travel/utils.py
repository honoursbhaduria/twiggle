from django.db.models import Avg, Count
from django.contrib.contenttypes.models import ContentType
from .models import Rating
from django.utils.timezone import now
from datetime import timedelta
from .models import (
    Itinerary, DayPlan, Attraction, Restaurant, Experience, DayBudget, UserTask, Destination, DestinationView,
)
from django.db import transaction
from django.utils.text import slugify
from django.db.models import Q

def get_rating_summary(obj):
    content_type = ContentType.objects.get_for_model(obj.__class__)
    ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)
    return {
        "average_rating": ratings.aggregate(avg=Avg("rating"))["avg"] or 0,
        "total_reviews": ratings.aggregate(count=Count("id"))["count"]
    }
    
    
#FUNCTION TO BE USED IN CELERY from django.db.models import Count, Avg

def update_trending_destinations():
    last_week = now() - timedelta(days=7)
    trending = (
        Destination.objects
        .annotate(view_count=Count("views", filter=Q(views__created_at__gte=last_week)))
        .order_by("-view_count")[:10]
    )

    Destination.objects.update(is_trending=False)
    Destination.objects.filter(id__in=[d.id for d in trending]).update(is_trending=True)
    
@transaction.atomic
def clone_itinerary_for_user(source: Itinerary, user) -> Itinerary:
    # Base copy
    copy = Itinerary.objects.create(
        destination=source.destination,
        title=f"{source.title} (My Copy)",
        short_description=source.short_description,
        duration_days=source.duration_days,
        duration_nights=max(0, source.duration_days - 1),
        total_budget=source.total_budget,
        thumbnail=source.thumbnail,
        highlighted_places=source.highlighted_places,
        popularity_score=0,  # user copy shouldn’t inherit ranking
        created_by=user,
        author_type=Itinerary.AuthorTypes.USER,
        is_public=False,  # start private
    )
    # M2M
    if source.categories.exists():
        copy.categories.add(*source.categories.all())
    if source.tags.exists():
        copy.tags.add(*source.tags.all())

    # Days
    src_days = list(source.days.all().order_by("day_number"))
    day_map = {}  # old_id -> new_day
    for d in src_days:
        day_map[d.id] = DayPlan.objects.create(
            itinerary=copy,
            day_number=d.day_number,
            title=d.title,
            description=d.description,
            locations=d.locations,
        )

    # Attractions
    src_as = list(Attraction.objects.filter(day_plan__in=src_days).order_by("id"))
    Attraction.objects.bulk_create([
        Attraction(
            day_plan=day_map[a.day_plan_id],
            location=a.location,
            name=a.name,
            description=a.description,
            image=a.image,
            latitude=a.latitude,
            longitude=a.longitude,
            google_place_id=a.google_place_id,
            address=a.address,
            estimated_cost=a.estimated_cost,
            duration_minutes=a.duration_minutes,
            start_time=a.start_time,
            end_time=a.end_time,
        ) for a in src_as
    ])

    # Restaurants
    src_rs = list(Restaurant.objects.filter(day_plan__in=src_days).order_by("id"))
    Restaurant.objects.bulk_create([
        Restaurant(
            day_plan=day_map[r.day_plan_id],
            location=r.location,
            name=r.name,
            cuisine=r.cuisine,
            description=r.description,
            image=r.image,
            latitude=r.latitude,
            longitude=r.longitude,
            google_place_id=r.google_place_id,
            address=r.address,
            estimated_cost=r.estimated_cost,
        ) for r in src_rs
    ])

    # Experiences
    src_es = list(Experience.objects.filter(day_plan__in=src_days).order_by("id"))
    Experience.objects.bulk_create([
        Experience(
            day_plan=day_map[e.day_plan_id],
            name=e.name,
            description=e.description,
            image=e.image,
            address=e.address,
            estimated_cost=e.estimated_cost
        ) for e in src_es
    ])

    # Day budgets
    src_bs = list(DayBudget.objects.filter(day_plan__in=src_days))
    DayBudget.objects.bulk_create([
        DayBudget(
            day_plan=day_map[b.day_plan_id],
            attractions_cost=b.attractions_cost,
            restaurants_cost=b.restaurants_cost,
            experiences_cost=b.experiences_cost,
            total_cost=b.total_cost,
            estimated_cost=b.estimated_cost,
            duration_minutes=b.duration_minutes,
            start_time=b.start_time,
            end_time=b.end_time,
        ) for b in src_bs
    ])

    # Add a task for the user
    UserTask.objects.create(
        user=user,
        task_type=UserTask.TaskTypes.CUSTOM_ITINERARY,
        related_itinerary=copy,
        status="pending",
    )
    return copy


# def compute_recommended_destinations(user=None, session_id=None):
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
#         score = (0.2 * (signals["views"] or 0)
#                + 0.4 * (signals["dwell"] or 0)
#                + 0.3 * (signals["clicks"] or 0))
#         results.append((dest, score))

#     results.sort(key=lambda x: x[1], reverse=True)
#     return [dest for dest, score in results]

def compute_recommended_destinations(user=None, session_id=None):
    filters = {"user": user} if user else {"session_id": session_id}
    user_views = (
        DestinationView.objects.filter(**filters)
        .values("destination")
        .annotate(
            views=Count("id", filter=Q(action_type="view")),
            dwell=Avg("dwell_time", filter=Q(action_type="dwell")),
            clicks=Count("id", filter=Q(action_type="click")),
        )
    )
    signal_map = {row["destination"]: row for row in user_views}

    results = []
    for dest in Destination.objects.all():
        signals = signal_map.get(dest.id, {"views": 0, "dwell": 0, "clicks": 0})
        score = (0.2 * (signals["views"] or 0)
               + 0.4 * (signals["dwell"] or 0)
               + 0.3 * (signals["clicks"] or 0))
        results.append((dest, score))

    results.sort(key=lambda x: x[1], reverse=True)

    # ✅ fallback if all scores are zero → use trending_score
    if not any(score > 0 for _, score in results):
        return Destination.objects.order_by("-trending_score")

    return [dest for dest, _ in results]

def compute_recommended_itineraries(user=None, session_id=None):
    filters = {"user": user} if user else {"session_id": session_id}
    user_views = (
        DestinationView.objects.filter(**filters)
        .values("destination")
        .annotate(
            views=Count("id", filter=Q(action_type="view")),
            dwell=Avg("dwell_time", filter=Q(action_type="dwell")),
            clicks=Count("id", filter=Q(action_type="click")),
        )
    )
    signal_map = {row["destination"]: row for row in user_views}

    results = []
    for itin in Itinerary.objects.select_related("destination").all():
        signals = signal_map.get(itin.destination_id, {"views": 0, "dwell": 0, "clicks": 0})
        score = (0.2 * (signals["views"] or 0)
               + 0.4 * (signals["dwell"] or 0)
               + 0.3 * (signals["clicks"] or 0)
               + 0.1 * itin.popularity_score)
        results.append((itin, score))

    results.sort(key=lambda x: x[1], reverse=True)
    return [itin for itin, score in results]