from rest_framework import serializers
from .models import (Destination, Itinerary, DayPlan, Attraction, Restaurant, Experience, BudgetBreakdown, Category, 
                     DayBudget, Tag, DestinationView, Rating, Location)
from .models import User
from .utils import get_rating_summary

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "username", "password", "role"]
        extra_kwargs = {"role": {"read_only": True}}  # prevent users choosing role

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
        )
        return user

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "city", "state", "country", "slug"]
        
class HomeDestinationSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "name", "slug", "description", "image"]

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class HomeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon"]
        

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon"]

        
        
class AttractionSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Attraction
        fields = ["id", "name", "description", "image", "estimated_cost", "latitude", "longitude", "google_place_id", "address", "location"]
    def get_average_rating(self, obj):
        return get_rating_summary(obj)["average_rating"]

    def get_total_reviews(self, obj):
        return get_rating_summary(obj)["total_reviews"]
    

class RestaurantSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Restaurant
        fields = ["id", "name", "cuisine", "description", "image", "estimated_cost", "latitude", "longitude", "google_place_id", "address", "location"]
    
    def get_average_rating(self, obj):
        return get_rating_summary(obj)["average_rating"]

    def get_total_reviews(self, obj):
        return get_rating_summary(obj)["total_reviews"]
    

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "name", "description", "image", "estimated_cost", "latitude", "longitude", "google_place_id", "address"]
        
    def get_average_rating(self, obj):
        return get_rating_summary(obj)["average_rating"]

    def get_total_reviews(self, obj):
        return get_rating_summary(obj)["total_reviews"]


class DayBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayBudget
        fields = [
            "attractions_cost",
            "restaurants_cost",
            "experiences_cost",
            "total_cost",
            "estimated_cost",
            "duration_minutes",
            "start_time",
            "end_time",
        ]
        
class DayPlanSerializer(serializers.ModelSerializer):
    attractions = AttractionSerializer(many=True, read_only=True)
    restaurants = RestaurantSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    budget = DayBudgetSerializer(read_only=True)

    class Meta:
        model = DayPlan
        fields = [
            "day_number", "title", "description", "locations",
            "attractions", "restaurants", "experiences", "budget"
        ]

class BudgetBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetBreakdown
        fields = ["stay", "travel", "food", "misc"]

class ItinerarySerializer(serializers.ModelSerializer):
    days = DayPlanSerializer(many=True, read_only=True)
    budget_breakdown = BudgetBreakdownSerializer(read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            "id", "title", "slug", "duration_days", "duration_nights", 
            "total_budget", "thumbnail", "highlighted_places", "popularity_score", 
            "days", "budget_breakdown"
            
        ]
    def get_average_rating(self, obj):
        return get_rating_summary(obj)["average_rating"]

    def get_total_reviews(self, obj):
        return get_rating_summary(obj)["total_reviews"]
    
    
class DestinationWithItinerariesSerializer(serializers.ModelSerializer):
    itineraries = ItinerarySerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Destination
        fields = ["id", "name", "slug", "description", "image", "itineraries", "location"]


class DestinationDetailSerializer(serializers.ModelSerializer):
    itineraries = ItinerarySerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Destination
        fields = ["id", "name", "description", "image", "itineraries", "location"]



        
class ItineraryDetailSerializer(serializers.ModelSerializer):
    days = DayPlanSerializer(many=True, read_only=True)
    budget_breakdown = BudgetBreakdownSerializer(read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            "id", "title", "slug", "duration_days", "duration_nights",
            "total_budget", "thumbnail", "highlighted_places", "popularity_score",
            "budget_breakdown", "days"
        ]
        
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class ItineraryListSerializer(serializers.ModelSerializer):
    destination = serializers.CharField(source="destination.name", read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            "id", "title", "slug", "thumbnail",
            "duration_days", "duration_nights",
            "total_budget", "destination", "tags"
        ]


class DestinationDwellSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationView
        fields = ["dwell_time"]
        
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "user", "rating", "review", "content_type", "object_id", "created_at"]
        read_only_fields = ["user", "created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value