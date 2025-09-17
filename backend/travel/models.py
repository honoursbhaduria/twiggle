# travel/models.py
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings
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
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='destinations/')
    is_trending = models.BooleanField(default=False)  # for homepage trending cards

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_trending = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Itinerary(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="itineraries")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    duration_days = models.IntegerField()
    duration_nights = models.IntegerField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.ImageField(upload_to='itineraries/')
    highlighted_places = models.TextField(help_text="Comma-separated values like Beach, Fort", db_index=True)
    popularity_score = models.IntegerField(default=0)
    tags = models.ManyToManyField("Tag", blank=True, related_name="itineraries")

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


class DayPlan(models.Model):
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name="days")
    day_number = models.IntegerField()
    title = models.CharField(max_length=100, help_text="E.g., Day 1: Arrival & Beach Visit")
    description = models.TextField()
    locations = models.TextField(blank=True, help_text="Comma-separated locations for the map")

    class Meta:
        unique_together = ('itinerary', 'day_number')
        ordering = ['day_number']

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
    icon = models.ImageField(upload_to='budget_categories/', blank=True, null=True)

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


class Attraction(models.Model):
    day_plan = models.ForeignKey(DayPlan, on_delete=models.CASCADE, related_name="attractions",
                                  blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name="attractions")
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='attractions/', blank=True, null=True)
    
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    google_place_id = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)

    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration_minutes = models.PositiveIntegerField(default=0)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)

    tags = models.ManyToManyField("Tag", blank=True)
    
    
    def __str__(self):
        return f"{self.name} (Day {self.day_plan.day_number})"


class Restaurant(models.Model):
    day_plan = models.ForeignKey(DayPlan, on_delete=models.CASCADE, related_name="restaurants",
                                  blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name="restaurants")
    name = models.CharField(max_length=100)
    cuisine = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='restaurants/', blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    google_place_id = models.CharField(max_length=255, blank=True, null=True)  # for Google Maps integration
    address = models.CharField(max_length=255, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    
    def __str__(self):
        return f"{self.name} (Day {self.day_plan.day_number})"


class Experience(models.Model):
    day_plan = models.ForeignKey(DayPlan, on_delete=models.CASCADE, related_name="experiences")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='experiences/', blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    google_place_id = models.CharField(max_length=255, blank=True, null=True)  # for Google Maps integration
    address = models.CharField(max_length=255, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    def __str__(self):
        return f"{self.name} (Day {self.day_plan.day_number})"


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
    action_type = models.CharField(max_length=10, choices=ACTION_CHOICES, default=VIEW)
    dwell_time = models.IntegerField(default=0)  # only for dwell
    click_target = models.CharField(max_length=100, blank=True, null=True)  # only for clicks
    created_at = models.DateTimeField(default=timezone.now)
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