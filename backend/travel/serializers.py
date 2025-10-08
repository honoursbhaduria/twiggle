from rest_framework import serializers
from .models import (Destination, Itinerary, DayPlan, Attraction, Restaurant, Experience, BudgetBreakdown, Category, 
                     DayBudget, Tag, DestinationView, Rating, Location, AttractionImage, DestinationImage, UserTask, FavoriteItinerary)
from .models import User
from .utils import get_rating_summary
from cloudinary.utils import cloudinary_url
import cloudinary
from django.db import transaction
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

        
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "name", "description", "image", "estimated_cost"]
        
        
class AttractionImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    thumb_url = serializers.SerializerMethodField()
    medium_url = serializers.SerializerMethodField()

    class Meta:
        model = AttractionImage
        fields = ["id", "url", "thumb_url", "medium_url", "alt_text", "is_primary", "order", "created_at", "image"]
        read_only_fields = ["id", "url", "thumb_url", "medium_url", "created_at"]
        extra_kwargs = {"image": {"write_only": True, "required": True}}

    def get_url(self, obj):
        return obj.image.url if obj.image else None

    def _cld_public_id(self, obj):
        f = getattr(obj, "image", None)
        if not f or not getattr(f, "name", None):
            return None, None
        name = f.name  # e.g., "attractions/abc123.jpg"
        if "." in name:
            public_id = name.rsplit(".", 1)[0]
            fmt = name.rsplit(".", 1)[1]
        else:
            public_id, fmt = name, None
        return public_id, fmt

    def _can_transform(self) -> bool:
        try:
            cfg = cloudinary.config()
            return bool(cfg.cloud_name)
        except Exception:
            return False

    def get_thumb_url(self, obj):
        if not self._can_transform():
            return self.get_url(obj)
        public_id, fmt = self._cld_public_id(obj)
        if not public_id:
            return None
        url, _ = cloudinary_url(
            public_id,
            format=fmt,
            secure=True,
            transformation=[
                {"width": 300, "height": 200, "crop": "fill", "gravity": "auto"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
        return url

    def get_medium_url(self, obj):
        if not self._can_transform():
            return self.get_url(obj)
        public_id, fmt = self._cld_public_id(obj)
        if not public_id:
            return None
        url, _ = cloudinary_url(
            public_id,
            format=fmt,
            secure=True,
            transformation=[
                {"width": 800, "height": 600, "crop": "fill", "gravity": "auto"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
        return url
class AttractionSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    images = AttractionImageSerializer(many=True, read_only=True)

    class Meta:
        model = Attraction
        fields = [
            "id", "name", "description", "image", "estimated_cost", "latitude", "longitude",
            "google_place_id", "address", "experiences", "location", "primary_image", "images"
        ]
        read_only_fields = ["image"]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.order_by("order", "id").first()
        return img.image.url if img and img.image else None
    

class RestaurantSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    class Meta:
        model = Restaurant
        fields = ["id", "name", "cuisine", "description", "image", "estimated_cost", "latitude", "longitude", "google_place_id", "address", "location"]
    
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

class DestinationImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = DestinationImage
        fields = ["id", "url", "alt_text", "is_primary", "order", "created_at"]

    def get_url(self, obj):
        return obj.image.url if obj.image else None
    
class DestinationDetailSerializer(serializers.ModelSerializer):
    itineraries = ItinerarySerializer(many=True, read_only=True)
    images = DestinationImageSerializer(many=True, read_only=True)

    class Meta:
        model = Destination
        fields = ["id", "name", "description", "slug", "image", "images", "itineraries"]



        
class ItineraryDetailSerializer(serializers.ModelSerializer):
    days = DayPlanSerializer(many=True, read_only=True)
    budget_breakdown = BudgetBreakdownSerializer(read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            "id", "title", "slug", "short_description","duration_days", "duration_nights",
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
    

class DestinationListSerializer(serializers.ModelSerializer):
    images = DestinationImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "name", "slug", "description", "primary_image", "images"]

    def get_primary_image(self, obj):
        img = obj.primary_image()
        return img.image.url if img and img.image else (obj.image.url if obj.image else None)
    

class ItineraryCardSerializer(serializers.ModelSerializer):
    destination = serializers.CharField(source="destination.name", read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            "id", "title", "slug", "thumbnail",
            "duration_days", "duration_nights",
            "total_budget", "destination", "tags"
        ]
        
        
        
        
        #WRITE SERILIZERS
        
        
class ExperienceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "name", "description", "image", "address", "estimated_cost"]
        read_only_fields = ["id"]

class AttractionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attraction
        fields = [
            "id", "name", "description", "image", "estimated_cost",
            "latitude", "longitude", "google_place_id", "address"
        ]
        read_only_fields = ["id"]

class RestaurantWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            "id", "name", "cuisine", "description", "image", "estimated_cost",
            "latitude", "longitude", "google_place_id", "address"
        ]
        read_only_fields = ["id"]

class DayBudgetWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayBudget
        fields = [
            "attractions_cost", "restaurants_cost", "experiences_cost",
            "total_cost", "estimated_cost", "duration_minutes",
            "start_time", "end_time"
        ]

class DayPlanWriteSerializer(serializers.ModelSerializer):
    attractions = AttractionWriteSerializer(many=True, required=False)
    restaurants = RestaurantWriteSerializer(many=True, required=False)
    experiences = ExperienceWriteSerializer(many=True, required=False)
    budget = DayBudgetWriteSerializer(required=False)

    class Meta:
        model = DayPlan
        fields = ["day_number", "title", "description", "locations",
                  "attractions", "restaurants", "experiences", "budget"]

class ItineraryWriteSerializer(serializers.ModelSerializer):
    # category slugs / tag slugs are easier from FE
    category_slugs = serializers.ListField(
        child=serializers.SlugField(), required=False, allow_empty=True
    )
    tag_slugs = serializers.ListField(
        child=serializers.SlugField(), required=False, allow_empty=True
    )
    days = DayPlanWriteSerializer(many=True, required=False)

    class Meta:
        model = Itinerary
        fields = [
            "id", "destination", "title", "short_description",
            "duration_days", "duration_nights", "total_budget", "thumbnail",
            "highlighted_places", "is_public", "category_slugs", "tag_slugs",
            "days"
        ]
        read_only_fields = ["id", "duration_nights"]

    def validate(self, attrs):
        # Force nights = days - 1; also guard days > 0
        days = attrs.get("duration_days") or getattr(self.instance, "duration_days", None)
        if not days or days <= 0:
            raise serializers.ValidationError({"duration_days": "duration_days must be > 0"})
        attrs["duration_nights"] = max(0, days - 1)
        return attrs

    # @transaction.atomic
    # def create(self, validated_data):
    #     request = self.context["request"]
    #     category_slugs = validated_data.pop("category_slugs", [])
    #     tag_slugs = validated_data.pop("tag_slugs", [])
    #     days_payload = validated_data.pop("days", [])

    #     # author defaults
    #     validated_data["created_by"] = request.user
    #     validated_data["author_type"] = Itinerary.AuthorTypes.USER
    #     # default: public unless user chooses otherwise
    #     if "is_public" not in validated_data:
    #         validated_data["is_public"] = True

    #     itinerary = Itinerary.objects.create(**validated_data)

    #     # M2M
    #     if category_slugs:
    #         cats = list(Category.objects.filter(slug__in=category_slugs))
    #         itinerary.categories.add(*cats)
    #     if tag_slugs:
    #         tags = list(Tag.objects.filter(slug__in=tag_slugs))
    #         itinerary.tags.add(*tags)

    #     # nested days
    #     for d in days_payload:
    #         attractions = d.pop("attractions", [])
    #         restaurants = d.pop("restaurants", [])
    #         experiences = d.pop("experiences", [])
    #         budget = d.pop("budget", None)

    #         day = DayPlan.objects.create(itinerary=itinerary, **d)

    #         # child rows
    #         if attractions:
    #             objs = [Attraction(day_plan=day, **a) for a in attractions]
    #             Attraction.objects.bulk_create(objs)
    #         if restaurants:
    #             objs = [Restaurant(day_plan=day, **r) for r in restaurants]
    #             Restaurant.objects.bulk_create(objs)
    #         if experiences:
    #             objs = [Experience(day_plan=day, **e) for e in experiences]
    #             Experience.objects.bulk_create(objs)
    #         if budget:
    #             DayBudget.objects.create(day_plan=day, **budget)

    #     # create a task record
    #     UserTask.objects.create(
    #         user=request.user,
    #         task_type=UserTask.TaskTypes.CUSTOM_ITINERARY,
    #         related_itinerary=itinerary,
    #         status="pending",
    #     )

    #     return itinerary
    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        category_slugs = validated_data.pop("category_slugs", [])
        tag_slugs = validated_data.pop("tag_slugs", [])
        days_payload = validated_data.pop("days", [])

        # author defaults
        validated_data["created_by"] = request.user
        validated_data["author_type"] = Itinerary.AuthorTypes.USER
        if "is_public" not in validated_data:
            validated_data["is_public"] = True

        itinerary = Itinerary.objects.create(**validated_data)

        # Categories
        if category_slugs:
            cats = Category.objects.filter(slug__in=category_slugs).only("id")
            Itinerary.categories.through.objects.bulk_create([
                Itinerary.categories.through(itinerary_id=itinerary.id, category_id=c.id) for c in cats
            ], ignore_conflicts=True)

        # Tags
        if tag_slugs:
            tags = Tag.objects.filter(slug__in=tag_slugs).only("id")
            Itinerary.tags.through.objects.bulk_create([
                Itinerary.tags.through(itinerary_id=itinerary.id, tag_id=t.id) for t in tags
            ], ignore_conflicts=True)

        # --- Days bulk insert ---
        day_objs = [DayPlan(itinerary=itinerary, **{k: v for k, v in d.items() if k not in ["attractions","restaurants","experiences","budget"]}) for d in days_payload]
        days = DayPlan.objects.bulk_create(day_objs)

        # --- Collect children across all days ---
        attraction_objs, restaurant_objs, experience_objs, budget_objs = [], [], [], []
        for idx, d in enumerate(days_payload):
            day = days[idx]
            for a in d.get("attractions", []):
                attraction_objs.append(Attraction(day_plan=day, **a))
            for r in d.get("restaurants", []):
                restaurant_objs.append(Restaurant(day_plan=day, **r))
            for e in d.get("experiences", []):
                experience_objs.append(Experience(day_plan=day, **e))
            if d.get("budget"):
                budget_objs.append(DayBudget(day_plan=day, **d["budget"]))

        if attraction_objs: Attraction.objects.bulk_create(attraction_objs)
        if restaurant_objs: Restaurant.objects.bulk_create(restaurant_objs)
        if experience_objs: Experience.objects.bulk_create(experience_objs)
        if budget_objs: DayBudget.objects.bulk_create(budget_objs)

        # User Task
        UserTask.objects.create(
            user=request.user,
            task_type=UserTask.TaskTypes.CUSTOM_ITINERARY,
            related_itinerary=itinerary,
            status="pending",
        )

        return itinerary

    @transaction.atomic
    def update(self, instance, validated_data):
        # Disallow changing owner here; only fields below
        category_slugs = validated_data.pop("category_slugs", None)
        tag_slugs = validated_data.pop("tag_slugs", None)
        days_payload = validated_data.pop("days", None)

        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()

        if category_slugs is not None:
            cats = list(Category.objects.filter(slug__in=category_slugs))
            instance.categories.set(cats)
        if tag_slugs is not None:
            tags = list(Tag.objects.filter(slug__in=tag_slugs))
            instance.tags.set(tags)

        # If days provided, simplest approach: wipe & rebuild (keeps code short/robust).
        # For fine-grained PATCH, split into separate endpoints later.
        if days_payload is not None:
            # delete children in bulk
            DayBudget.objects.filter(day_plan__itinerary=instance).delete()
            Experience.objects.filter(day_plan__itinerary=instance).delete()
            Restaurant.objects.filter(day_plan__itinerary=instance).delete()
            Attraction.objects.filter(day_plan__itinerary=instance).delete()
            DayPlan.objects.filter(itinerary=instance).delete()

            for d in days_payload:
                attractions = d.pop("attractions", [])
                restaurants = d.pop("restaurants", [])
                experiences = d.pop("experiences", [])
                budget = d.pop("budget", None)

                day = DayPlan.objects.create(itinerary=instance, **d)

                if attractions:
                    Attraction.objects.bulk_create([Attraction(day_plan=day, **a) for a in attractions])
                if restaurants:
                    Restaurant.objects.bulk_create([Restaurant(day_plan=day, **r) for r in restaurants])
                if experiences:
                    Experience.objects.bulk_create([Experience(day_plan=day, **e) for e in experiences])
                if budget:
                    DayBudget.objects.create(day_plan=day, **budget)

        return instance
    
    
class FavoriteItinerarySerializer(serializers.ModelSerializer):
    itinerary = ItineraryCardSerializer()  # reuse your card serializer for list

    class Meta:
        model = FavoriteItinerary
        fields = ["id", "itinerary", "created_at"]
        
class DestinationRecommendationSerializer(serializers.ModelSerializer):
    fallback_image = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "name", "slug", "description", "fallback_image", "primary_image", "images"]

    def get_fallback_image(self, obj):
        return obj.image.url if obj.image else None

    def get_primary_image(self, obj):
        img = obj.primary_image()
        return img.image.url if img and img.image else (obj.image.url if obj.image else None)

    def get_images(self, obj):
        return [img.image.url for img in obj.images.all() if img.image]
    
class ItineraryRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = [
            "id",
            "title",
            "slug",
            "thumbnail",
            "duration_days",
            "duration_nights",
            "total_budget",
            "popularity_score",
            "short_description",
        ]
        
        

class AttractionSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attraction
        fields = [
            "id",
            "name",
            "description",
            "image",
            "estimated_cost",
            "latitude",
            "longitude",
            "google_place_id",
            "address",
        ]