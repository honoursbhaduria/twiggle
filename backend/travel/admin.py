from django.contrib import admin
from django.utils.html import format_html
import nested_admin

from .models import (
    Destination, Category, Itinerary, DayPlan, BudgetBreakdown,
    BudgetCategory, BudgetItem, Tag, Attraction, Restaurant, Experience,
    DayBudget, AttractionImage, DestinationImage
)

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "username", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_superuser", "is_active")
    search_fields = ("email", "username")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "username", "password", "role")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "is_active", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "role", "password1", "password2"),
        }),
    )

# ---------------- DESTINATION ----------------
class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1
    fields = ("image", "alt_text", "is_primary", "order", "created_at")
    readonly_fields = ("created_at",)

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_trending")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_filter = ("is_trending",)
    inlines = [DestinationImageInline]

# ---------------- CATEGORY ----------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_trending")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_filter = ("is_trending",)

# ---------------- INLINE DEFINITIONS ----------------
class AttractionInline(nested_admin.NestedTabularInline):
    model = Attraction
    extra = 0

class RestaurantInline(nested_admin.NestedTabularInline):
    model = Restaurant
    extra = 0

class ExperienceInline(nested_admin.NestedTabularInline):
    model = Experience
    extra = 0

class DayBudgetInline(nested_admin.NestedStackedInline):
    model = DayBudget
    extra = 0

class DayPlanInline(nested_admin.NestedStackedInline):
    model = DayPlan
    extra = 0
    inlines = [AttractionInline, RestaurantInline, ExperienceInline, DayBudgetInline]

class BudgetBreakdownInline(nested_admin.NestedStackedInline):   # ✅ switched from admin.StackedInline
    model = BudgetBreakdown
    can_delete = False
    extra = 0

# ---------------- ITINERARY ----------------
@admin.register(Itinerary)
class ItineraryAdmin(nested_admin.NestedModelAdmin):
    list_display = ("title", "destination", "duration_days", "total_budget", "popularity_score")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "destination__name")
    # list_filter = ("destination", "categories")
    # filter_horizontal = ("categories", "tags")
    inlines = [DayPlanInline, BudgetBreakdownInline]



# --- CUSTOM LIST FILTERS ---
class MissingDescriptionFilter(admin.SimpleListFilter):
    title = "Description"
    parameter_name = "missing_description"

    def lookups(self, request, model_admin):
        return [("missing", "Missing")]

    def queryset(self, request, queryset):
        if self.value() == "missing":
            return queryset.filter(description__isnull=True) | queryset.filter(description="")
        return queryset


class MissingLocationFilter(admin.SimpleListFilter):
    title = "Location"
    parameter_name = "missing_location"

    def lookups(self, request, model_admin):
        return [("missing", "Missing")]

    def queryset(self, request, queryset):
        if self.value() == "missing":
            return queryset.filter(location__isnull=True)
        return queryset

# --- Filters ---
class MissingImageFilter(admin.SimpleListFilter):
    title = "Has Image"
    parameter_name = "has_image"

    def lookups(self, request, model_admin):
        return [("missing", "Missing"), ("present", "Present")]

    def queryset(self, request, queryset):
        if self.value() == "missing":
            return queryset.filter(image__isnull=True) | queryset.filter(image="")
        if self.value() == "present":
            return queryset.exclude(image__isnull=True).exclude(image="")
        return queryset


class MissingGalleryFilter(admin.SimpleListFilter):
    title = "Gallery Images"
    parameter_name = "gallery_images"

    def lookups(self, request, model_admin):
        return [("missing", "No Gallery Images"), ("present", "Has Gallery Images")]

    def queryset(self, request, queryset):
        if self.value() == "missing":
            return queryset.filter(images__isnull=True)
        if self.value() == "present":
            return queryset.filter(images__isnull=False).distinct()
        return queryset
    
class MissingCoordinatesFilter(admin.SimpleListFilter):
    title = "Coordinates"
    parameter_name = "missing_coordinates"

    def lookups(self, request, model_admin):
        return [("missing", "Missing")]

    def queryset(self, request, queryset):
        if self.value() == "missing":
            return queryset.filter(latitude__isnull=True) | queryset.filter(longitude__isnull=True)
        return queryset
    
class AttractionImageInline(admin.TabularInline):
    model = AttractionImage
    extra = 1
    fields = ("preview", "image", "alt_text", "is_primary", "order", "created_at")
    readonly_fields = ("created_at", "preview")

    def preview(self, obj):
        if getattr(obj, "image", None):
            try:
                return format_html('<img src="{}" style="height:80px;border-radius:6px;" />', obj.image.url)
            except Exception:
                return "—"
        return "—"
    preview.short_description = "Preview"

@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ("name", "day_plan", "estimated_cost", "latitude", "longitude", "google_place_id")
    # list_filter = ("tags",)
    list_filter = (MissingDescriptionFilter, MissingLocationFilter, MissingCoordinatesFilter, MissingImageFilter, MissingGalleryFilter,"tags")
    search_fields = ("name", "address")
    inlines = [AttractionImageInline]
    
    def city(self, obj):
        return obj.location.city if obj.location else "-"
    
    def has_desc(self, obj):
        return "✅" if obj.description else "❌"
    
    def has_coords(self, obj):
        return "✅" if obj.latitude and obj.longitude else "❌"


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "cuisine", "city", "has_desc", "has_coords", "day_plan")
    list_filter = (MissingDescriptionFilter, MissingLocationFilter, MissingCoordinatesFilter)

    def city(self, obj):
        return obj.location.city if obj.location else "-"
    
    def has_desc(self, obj):
        return "✅" if obj.description else "❌"
    
    def has_coords(self, obj):
        return "✅" if obj.latitude and obj.longitude else "❌"


