# travel/models.py
from django.db import models, transaction
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings
from cloudinary.models import CloudinaryField
from django.contrib.postgres.indexes import GinIndex


class User(AbstractUser):
    class Roles(models.TextChoices):
        USER = "USER", "User"
        GURU = "GURU", "Travel Guru"
        ADMIN = "ADMIN", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.USER)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"
    

class Location(models.Model):
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, blank=True, db_index=True)
    country = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        unique_together = ("city", "state", "country")
        indexes = [
            models.Index(fields=["country"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            parts = [self.city, self.state, self.country]
            self.slug = slugify("-".join([p for p in parts if p]))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.city}, {self.state}, {self.country}".replace(" ,", "")
class Destination(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name="destinations")
    slug = models.SlugField(unique=True, blank=True, db_index=True)
    description = models.TextField(blank=True)
    image = CloudinaryField('image', blank=True, null=True, folder="destinations/")  # keep thumbnail
    is_trending = models.BooleanField(default=False, db_index=True)
    trending_score = models.FloatField(default=0, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def primary_image(self):
        return self.images.filter(is_primary=True).first() or self.images.first()

    def __str__(self):
        return self.name
    
class DestinationImage(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="images",
        db_index=True,
    )
    image = CloudinaryField('image', blank=True, null=True, folder="destinations/")
    alt_text = models.CharField(max_length=160, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["destination"],
                condition=models.Q(is_primary=True),
                name="unique_primary_image_per_destination",
            )
        ]

    def __str__(self):
        return f"{self.destination.name} | #{self.pk}"

    def save(self, *args, **kwargs):
        # ensure only one primary image per destination
        with transaction.atomic():
            super().save(*args, **kwargs)
            if self.is_primary:
                DestinationImage.objects.filter(
                    destination=self.destination, is_primary=True
                ).exclude(pk=self.pk).update(is_primary=False)





class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True, db_index=True)
    icon = CloudinaryField('image', blank=True, null=True, folder="categories/")
    is_trending = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Itinerary(models.Model):
    class AuthorTypes(models.TextChoices):
        USER = "USER", "User"
        GURU = "GURU", "Travel Guru"
        ADMIN = "ADMIN", "Admin"
        AI = "AI", "AI Generated"
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="itineraries",  db_index=True)
    categories = models.ManyToManyField("Category", blank=True, related_name="itineraries")  
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True, max_length=150)
    short_description = models.TextField(
        blank=True,
        help_text="A short summary of the itinerary for cards/list views (2–3 lines)."
    )

    duration_days = models.IntegerField(db_index=True)
    duration_nights = models.IntegerField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2,db_index=True)
    thumbnail = CloudinaryField('image', blank=True, null=True, folder="itineraries/")
    highlighted_places = models.TextField(help_text="Comma-separated values like Beach, Fort", db_index=True)
    popularity_score = models.IntegerField(default=0,db_index=True)
    tags = models.ManyToManyField("Tag", blank=True, related_name="itineraries")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_itineraries"
    )
    author_type = models.CharField(
        max_length=10, choices=AuthorTypes.choices, default=AuthorTypes.AI
    )
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.destination.name}-{self.title}")
            slug = base_slug
            counter = 1
            while Itinerary.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.destination.name}"
    class Meta:
        indexes = [
            models.Index(fields=["destination", "id"]),  # for dest itineraries
            models.Index(fields=["destination", "total_budget", "duration_days"]),
        ]



class DayPlan(models.Model):
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name="days", db_index=True)
    day_number = models.IntegerField()
    title = models.CharField(max_length=100, help_text="E.g., Day 1: Arrival & Beach Visit")
    description = models.TextField()
    locations = models.TextField(blank=True, help_text="Comma-separated locations for the map")

    class Meta:
        unique_together = ('itinerary', 'day_number')
        ordering = ['day_number']
        indexes = [
            models.Index(fields=["itinerary"]),
        ]

    def __str__(self):
        return f"{self.itinerary.title} - Day {self.day_number}"


class BudgetBreakdown(models.Model):
    itinerary = models.OneToOneField(Itinerary, on_delete=models.CASCADE, related_name='budget_breakdown')
    stay = models.DecimalField(max_digits=10, decimal_places=2)
    travel = models.DecimalField(max_digits=10, decimal_places=2)
    food = models.DecimalField(max_digits=10, decimal_places=2)
    misc = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Budget for {self.itinerary.title}"

class BudgetCategory(models.Model):
    name = models.CharField(max_length=50)  # e.g., Attractions, Transport, Food
    icon = CloudinaryField('image', blank=True, null=True, folder="budget_categories/")

class BudgetItem(models.Model):
    day_plan = models.ForeignKey(DayPlan, on_delete=models.CASCADE, related_name='budget_items')
    category = models.ForeignKey(BudgetCategory, on_delete=models.SET_NULL, null=True)
    description = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=10, decimal_places=2)

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
class AttractionImage(models.Model):
    attraction = models.ForeignKey(
        "Attraction",
        on_delete=models.CASCADE,
        related_name="images",
        db_index=True,
    )
    image = CloudinaryField('image', blank=True, null=True, folder="attractions/")
    # image = CloudinaryField('image')
    alt_text = models.CharField(max_length=160, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["attraction"],
                condition=models.Q(is_primary=True),
                name="unique_primary_image_per_attraction",
            )
        ]

    def __str__(self):
        return f"{self.attraction.name} | #{self.pk}"

    def save(self, *args, **kwargs):
        # ensure only one primary per attraction
        with transaction.atomic():
            super().save(*args, **kwargs)
            if self.is_primary:
                AttractionImage.objects.filter(
                    attraction=self.attraction, is_primary=True
                ).exclude(pk=self.pk).update(is_primary=False)
                

class Attraction(models.Model):
    day_plan = models.ForeignKey(
        DayPlan,
        on_delete=models.SET_NULL,   # 👈 changed from CASCADE
        related_name="attractions",
        blank=True,
        null=True
        )
    
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField(blank=True)
    image = CloudinaryField('image', blank=True, null=True, folder="attractions/")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    google_place_id = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    categories = models.ManyToManyField("Category", blank=True, related_name="attractions")
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration_minutes = models.PositiveIntegerField(default=0)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)

    tags = models.ManyToManyField("Tag", blank=True)
    
    city = models.CharField(max_length=100, db_index=True, blank=True)
    state = models.CharField(max_length=100, db_index=True, blank=True)
    country = models.CharField(max_length=100, db_index=True, blank=True)
    
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name="attractions", db_index=True)
    
    def __str__(self):
        if self.day_plan:
            return f"{self.name} (Day {self.day_plan.day_number})"
        return self.name
    class Meta:
        indexes = [
            models.Index(fields=["city"]),
            models.Index(fields=["state"]),
            models.Index(fields=["country"]),
            models.Index(fields=["day_plan"]),
            models.Index(fields=["location", "name"]),
            GinIndex(name="attraction_name_trgm", fields=["name"], opclasses=["gin_trgm_ops"]),
        ]

class Restaurant(models.Model):
    day_plan = models.ForeignKey(
        DayPlan,
        on_delete=models.SET_NULL,   # 👈 changed from CASCADE
        related_name="restaurants",
        blank=True,
        null=True
    )
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name="restaurants")
    name = models.CharField(max_length=100)
    cuisine = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    image = CloudinaryField('image', blank=True, null=True, folder="restaurants/")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    google_place_id = models.CharField(max_length=255, blank=True, null=True)  # for Google Maps integration
    address = models.CharField(max_length=255, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    
    def __str__(self):
        if self.day_plan:
            return f"{self.name} (Day {self.day_plan.day_number})"
        return self.name

    class Meta:
        indexes = [
            models.Index(fields=["day_plan"]),
        ]


class Experience(models.Model):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE,
        related_name="experiences", null=True, blank=True
    )
    day_plan = models.ForeignKey(   # optional fallback
        DayPlan, on_delete=models.CASCADE,
        related_name="extra_experiences", null=True, blank=True
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = CloudinaryField('image', blank=True, null=True, folder="experiences/")
    address = models.CharField(max_length=255, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        location_info = f" at {self.attraction.name}" if self.attraction else ""
        return f"{self.name}{location_info}"
    
    


class DayBudget(models.Model):
    day_plan = models.OneToOneField(DayPlan, on_delete=models.CASCADE, related_name='budget')
    attractions_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    restaurants_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    experiences_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration_minutes = models.PositiveIntegerField(default=0)  # for itinerary time planning
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    def update_total(self):
        self.total_cost = (
            self.attractions_cost +
            self.restaurants_cost +
            self.experiences_cost
        )
        self.save()
    class Meta:
        indexes = [
            models.Index(fields=["day_plan"]),
        ]
        

class DestinationView(models.Model):
    VIEW = "view"
    DWELL = "dwell"
    CLICK = "click"

    ACTION_CHOICES = [
        (VIEW, "View"),
        (DWELL, "Dwell"),
        (CLICK, "Click"),
    ]

    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="interactions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)  
    session_id = models.CharField(max_length=100, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    action_type = models.CharField(max_length=10, choices=ACTION_CHOICES, default=VIEW, db_index=True)
    dwell_time = models.IntegerField(default=0)  # only for dwell
    click_target = models.CharField(max_length=100, blank=True, null=True)  # only for clicks
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    class Meta:
        indexes = [
            models.Index(fields=["user", "destination", "action_type"]),
        ]
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    review = models.TextField(blank=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "content_type", "object_id")
        indexes = [models.Index(fields=["content_type", "object_id"])]

    def __str__(self):
        return f"{self.user} rated {self.rating} on {self.content_object}"
    


class UserTask(models.Model):
    class TaskTypes(models.TextChoices):
        CUSTOM_ITINERARY = "custom_itinerary", "Custom Itinerary"
        REVIEW = "review", "Review"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks")
    task_type = models.CharField(max_length=50, choices=TaskTypes.choices)
    related_itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        default="pending",
        choices=[("pending", "Pending"), ("done", "Done")]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    

class FavoriteItinerary(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_itineraries"
    )
    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "itinerary")
        indexes = [
            models.Index(fields=["user", "itinerary"])
        ]

    def __str__(self):
        return f"{self.user} → {self.itinerary}"
