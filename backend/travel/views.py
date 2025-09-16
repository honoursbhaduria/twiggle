from django.shortcuts import render
from .models import Destination, Itinerary, DayPlan, Category, Tag, DestinationView,Attraction, Restaurant, Experience, Rating
from .serializers import (HomeDestinationSerializer, HomeCategorySerializer,DestinationWithItinerariesSerializer, 
                          ItinerarySerializer, ItineraryDetailSerializer, ItineraryListSerializer, DestinationDwellSerializer)
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

@api_view(['GET'])
def destination_detail_api(request, slug):
    destination = get_object_or_404(Destination, slug=slug)
    
    # optional filtering
    itineraries = destination.itineraries.all()
    category_slug = request.query_params.get("category")
    duration_days = request.query_params.get("duration_days")
    budget_max = request.query_params.get("budget_max")

    if category_slug:
        itineraries = itineraries.filter(category__slug=category_slug)
    if duration_days:
        itineraries = itineraries.filter(duration_days=duration_days)
    if budget_max:
        itineraries = itineraries.filter(total_budget__lte=budget_max)

    serializer = DestinationWithItinerariesSerializer(destination)
    data = serializer.data
    data["itineraries"] = ItinerarySerializer(itineraries, many=True).data

    return Response(data)


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
