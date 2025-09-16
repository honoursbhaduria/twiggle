from django.contrib import admin
from .models import (
    Destination, Category, Itinerary, DayPlan, BudgetBreakdown,
    BudgetCategory, BudgetItem, Tag, Attraction, Restaurant, Experience,
    DayBudget
)


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_trending")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_filter = ("is_trending",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_trending")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_filter = ("is_trending",)


class DayPlanInline(admin.TabularInline):
    model = DayPlan
    extra = 1


class BudgetBreakdownInline(admin.StackedInline):
    model = BudgetBreakdown
    can_delete = False


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ("title", "destination", "category", "duration_days", "total_budget", "popularity_score")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "destination__name", "category__name")
    list_filter = ("destination", "category")
    inlines = [DayPlanInline, BudgetBreakdownInline]


@admin.register(DayPlan)
class DayPlanAdmin(admin.ModelAdmin):
    list_display = ("itinerary", "day_number", "title")
    ordering = ("itinerary", "day_number")
    search_fields = ("itinerary__title", "title")


@admin.register(BudgetBreakdown)
class BudgetBreakdownAdmin(admin.ModelAdmin):
    list_display = ("itinerary", "stay", "travel", "food", "misc")


@admin.register(BudgetCategory)
class BudgetCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(BudgetItem)
class BudgetItemAdmin(admin.ModelAdmin):
    list_display = ("day_plan", "category", "description", "cost")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ("name", "day_plan", "estimated_cost", "latitude", "longitude", "google_place_id")
    list_filter = ("tags",)
    search_fields = ("name", "address")


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "day_plan", "cuisine", "latitude", "longitude")
    search_fields = ("name", "address", "cuisine")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("name", "day_plan", "latitude", "longitude")
    search_fields = ("name", "address")


@admin.register(DayBudget)
class DayBudgetAdmin(admin.ModelAdmin):
    list_display = ("day_plan", "total_cost", "estimated_cost", "duration_minutes")
