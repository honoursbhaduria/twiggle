from django.shortcuts import render
from .models import Destination, Itinerary, DayPlan, Category, Tag, DestinationView,Attraction, Restaurant, Experience, Rating
from .serializers import (HomeDestinationSerializer, HomeCategorySerializer,DestinationWithItinerariesSerializer, 
                          ItinerarySerializer, ItineraryDetailSerializer, ItineraryListSerializer, DestinationDwellSerializer, 
                          DestinationDetailSerializer,AttractionSerializer,RestaurantSerializer)
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
    trending = (
        Destination.objects.annotate(
            views=Count("interactions", filter=Q(interactions__action_type="view")),
            total_dwell=Sum("interactions__dwell_time", filter=Q(interactions__action_type="dwell")),
            clicks=Count("interactions", filter=Q(interactions__action_type="click")),
        )
        .annotate(
            score=Count("interactions", filter=Q(interactions__action_type="view"))
                 + 2 * Count("interactions", filter=Q(interactions__action_type="click"))
                 + (Sum("interactions__dwell_time", filter=Q(interactions__action_type="dwell")) / 60.0)
        )
        .order_by("-score")[:10]
    )
    serializer = HomeDestinationSerializer(trending, many=True)
    return Response({"trending_destinations": serializer.data})

# @api_view(['GET'])
# def destination_detail_api(request, slug):
#     destination = get_object_or_404(Destination, slug=slug)
    
#     # optional filtering
#     itineraries = destination.itineraries.all()
#     category_slug = request.query_params.get("category")
#     duration_days = request.query_params.get("duration_days")
#     budget_max = request.query_params.get("budget_max")

#     if category_slug:
#         itineraries = itineraries.filter(category__slug=category_slug)
#     if duration_days:
#         itineraries = itineraries.filter(duration_days=duration_days)
#     if budget_max:
#         itineraries = itineraries.filter(total_budget__lte=budget_max)

#     serializer = DestinationWithItinerariesSerializer(destination)
#     data = serializer.data
#     data["itineraries"] = ItinerarySerializer(itineraries, many=True).data

#     return Response(data)
@api_view(['GET'])
def destination_detail_api(request, slug=None):
    category_slug = request.query_params.get("category")
    duration_days = request.query_params.get("duration_days")
    budget_max = request.query_params.get("budget_max")

    # -----2221----- Single destination ------1----
    if slug:
        destination = get_object_or_404(Destination, slug=slug)
        itineraries = destination.itineraries.all()

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

    # -1232--------- All destinations ------1----
    destinations = Destination.objects.all().prefetch_related("itineraries")
    dest_paginator = StandardResultsSetPagination()
    dest_page = dest_paginator.paginate_queryset(destinations, request)

    results = []
    for destination in dest_page:
        itineraries = destination.itineraries.all()
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
def itinerary_detail_api(request, slug):
    itinerary = get_object_or_404(Itinerary, slug=slug)
    serializer = ItineraryDetailSerializer(itinerary)
    return Response(serializer.data)


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

@api_view(['GET'])
def itineraries_by_category(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    itineraries = category.itinerary_set.select_related("destination").all()

    # Optional filters
    destination_slug = request.query_params.get("destination")
    budget_max = request.query_params.get("budget_max")

    if destination_slug:
        itineraries = itineraries.filter(destination__slug=destination_slug)
    if budget_max:
        itineraries = itineraries.filter(total_budget__lte=budget_max)

    serializer = ItineraryListSerializer(itineraries, many=True)
    return Response({
        "category": {"id": category.id, "name": category.name, "slug": category.slug},
        "itineraries": serializer.data
    })

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

@api_view(["POST"])
@permission_classes([IsAuthenticated])  # only logged-in users can rate
def add_rating(request, model_name, object_id):
    if model_name not in MODEL_MAP:
        return Response({"error": "Invalid model"}, status=400)

    model = MODEL_MAP[model_name]
    try:
        obj = model.objects.get(id=object_id)
    except model.DoesNotExist:
        return Response({"error": "Object not found"}, status=404)

    rating_value = int(request.data.get("rating", 0))
    review_text = request.data.get("review", "")

    if rating_value < 1 or rating_value > 5:
        return Response({"error": "Rating must be between 1 and 5"}, status=400)

    # save or update rating
    content_type = ContentType.objects.get_for_model(model)
    rating, created = Rating.objects.update_or_create(
        user=request.user,
        content_type=content_type,
        object_id=obj.id,
        defaults={"rating": rating_value, "review": review_text}
    )

    return Response(RatingSerializer(rating).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])  # anyone can view ratings
def get_ratings(request, model_name, object_id):
    if model_name not in MODEL_MAP:
        return Response({"error": "Invalid model"}, status=400)

    model = MODEL_MAP[model_name]
    try:
        obj = model.objects.get(id=object_id)
    except model.DoesNotExist:
        return Response({"error": "Object not found"}, status=404)

    content_type = ContentType.objects.get_for_model(model)
    ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)

    serializer = RatingSerializer(ratings, many=True)
    avg_rating = ratings.aggregate(avg=Avg("rating"))["avg"]
    total_reviews = ratings.aggregate(count=Count("id"))["count"]

    return Response({
        "object": {"id": obj.id, "name": getattr(obj, "title", getattr(obj, "name", ""))},
        "ratings": serializer.data,
        "average_rating": avg_rating or 0,
        "total_reviews": total_reviews
    })




@api_view(["GET"])
def recommended_destinations_api(request):
    user = request.user if request.user.is_authenticated else None
    session_id = request.session.session_key or request.session.create()

    # Track either by user or anonymous session
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
        views = signals["views"] or 0
        dwell = signals["dwell"] or 0
        clicks = signals["clicks"] or 0

        # Aggregate popularity from itineraries
        popularity = (
            Itinerary.objects.filter(destination=dest)
            .aggregate(total_pop=Sum("popularity_score"))["total_pop"] or 0
        )

        score = (0.2 * views) + (0.4 * dwell) + (0.3 * clicks) + (0.1 * popularity)
        results.append((dest, score))

    results.sort(key=lambda x: x[1], reverse=True)
    sorted_destinations = [dest for dest, score in results]

    if not user_views:
        trending = list(Destination.objects.filter(is_trending=True))
        trending_ids = [t.id for t in trending]
        sorted_destinations = trending + [d for d in Destination.objects.exclude(id__in=trending_ids)]

    serializer = DestinationDetailSerializer(sorted_destinations, many=True)
    return Response({
        "recommended": serializer.data[:5],
        "all_destinations": serializer.data
    })


@api_view(["GET"])
def recommended_itineraries_api(request):
    user = request.user if request.user.is_authenticated else None
    session_id = request.session.session_key or request.session.create()

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
        views = signals["views"] or 0
        dwell = signals["dwell"] or 0
        clicks = signals["clicks"] or 0

        score = (0.2 * views) + (0.4 * dwell) + (0.3 * clicks) + (0.1 * itin.popularity_score)
        results.append((itin, score))

    results.sort(key=lambda x: x[1], reverse=True)
    sorted_itineraries = [itin for itin, score in results]

    if not user_views:
        trending = list(Itinerary.objects.filter(destination__is_trending=True))
        trending_ids = [t.id for t in trending]
        sorted_itineraries = trending + [i for i in Itinerary.objects.exclude(id__in=trending_ids)]

    serializer = ItinerarySerializer(sorted_itineraries, many=True)
    return Response({
        "recommended": serializer.data[:5],
        "all_itineraries": serializer.data
    })
    
    
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
    page_size = 10
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
    """
    Search attractions by name, city, state, or country.
    Example: /api/attractions/search/?name=beach&city=Goa&country=India
    """
    name = request.GET.get("name")
    city = request.GET.get("city")
    state = request.GET.get("state")
    country = request.GET.get("country")

    queryset = Attraction.objects.select_related("location").all()

    if name:
        queryset = queryset.filter(name__icontains=name)
    if city:
        queryset = queryset.filter(location__city__iexact=city)
    if state:
        queryset = queryset.filter(location__state__iexact=state)
    if country:
        queryset = queryset.filter(location__country__iexact=country)


    
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = AttractionSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)
