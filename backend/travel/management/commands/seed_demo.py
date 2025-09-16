from django.core.management.base import BaseCommand
from travel.models import Destination, Category, Itinerary, DayPlan, Attraction, Restaurant, Experience, DayBudget, Tag


class Command(BaseCommand):
    help = "Seed demo data for testing APIs"

    def handle(self, *args, **kwargs):
        # Clear existing data (optional, safe for demo only)
        Destination.objects.all().delete()
        Category.objects.all().delete()
        Itinerary.objects.all().delete()
        DayPlan.objects.all().delete()
        Attraction.objects.all().delete()
        Restaurant.objects.all().delete()
        Experience.objects.all().delete()
        DayBudget.objects.all().delete()
        Tag.objects.all().delete()

        # Categories (broad classification)
        budget = Category.objects.create(name="Budget Travel", slug="budget-travel", icon="/media/demo.jpg")
        luxury = Category.objects.create(name="Luxury Travel", slug="luxury-travel", icon="/media/demo.jpg")
        solo_category = Category.objects.create(name="Solo Travel", slug="solo-travel", icon="/media/demo.jpg")

        # Tags (flexible labels)
        popular_tag = Tag.objects.create(name="Popular", slug="popular")
        solo_tag = Tag.objects.create(name="Solo", slug="solo")
        luxury_tag = Tag.objects.create(name="Luxury", slug="luxury")

        # Destinations
        goa = Destination.objects.create(
            name="Goa", description="Beaches and nightlife", image="/media/demo.jpg", is_trending=True
        )
        delhi = Destination.objects.create(
            name="Delhi", description="Historic capital city", image="/media/demo.jpg", is_trending=True
        )
        manali = Destination.objects.create(
            name="Manali", description="Himalayan hill station", image="/media/demo.jpg", is_trending=True
        )

        # ---------------- Goa Itineraries ----------------
        goa_trip1 = Itinerary.objects.create(
            destination=goa, category=budget, title="3D 4N Goa Budget Trip",
            duration_days=4, duration_nights=3, total_budget=15000,
            thumbnail="/media/demo.jpg", highlighted_places="Baga Beach, Fort Aguada", popularity_score=80
        )
        goa_trip2 = Itinerary.objects.create(
            destination=goa, category=luxury, title="Luxury Goa Escape",
            duration_days=5, duration_nights=4, total_budget=45000,
            thumbnail="/media/demo.jpg", highlighted_places="Candolim, Cruise Dinner", popularity_score=95
        )

        # ✅ Assign tags (only Tag objects)
        goa_trip1.tags.add(popular_tag)
        goa_trip2.tags.add(luxury_tag, popular_tag)

        # Goa Trip1 → Day 1
        day1 = DayPlan.objects.create(
            itinerary=goa_trip1, day_number=1,
            title="Arrival & Beach Time", description="Relax and enjoy Baga Beach", locations="Baga Beach, Calangute"
        )
        Attraction.objects.create(day_plan=day1, name="Baga Beach", description="Famous beach in Goa", image="/media/demo.jpg", estimated_cost=0, latitude=15.552, longitude=73.752)
        Restaurant.objects.create(day_plan=day1, name="Fisherman's Wharf", cuisine="Seafood", description="Authentic Goan seafood", image="/media/demo.jpg", estimated_cost=1200, latitude=15.51, longitude=73.72)
        DayBudget.objects.create(day_plan=day1, attractions_cost=500, restaurants_cost=1200, experiences_cost=0, total_cost=1700, estimated_cost=2000, duration_minutes=480)

        # Goa Trip1 → Day 2
        day2 = DayPlan.objects.create(
            itinerary=goa_trip1, day_number=2,
            title="Fort Aguada & Cruise", description="Historic fort + evening cruise", locations="Fort Aguada, Mandovi River"
        )
        Attraction.objects.create(day_plan=day2, name="Fort Aguada", description="17th-century fort", image="/media/demo.jpg", estimated_cost=1000, latitude=15.49, longitude=73.77)
        Experience.objects.create(day_plan=day2, name="Mandovi River Cruise", description="Sunset cruise", image="/media/demo.jpg", estimated_cost=1500, latitude=15.50, longitude=73.74)
        DayBudget.objects.create(day_plan=day2, attractions_cost=1000, restaurants_cost=0, experiences_cost=1500, total_cost=2500, estimated_cost=2700, duration_minutes=600)

        # ---------------- Delhi Itineraries ----------------
        delhi_trip = Itinerary.objects.create(
            destination=delhi, category=solo_category, title="2D 3N Delhi Explorer",
            duration_days=3, duration_nights=2, total_budget=8000,
            thumbnail="/media/demo.jpg", highlighted_places="Red Fort, India Gate", popularity_score=70
        )

        delhi_trip.tags.add(solo_tag)

        d1 = DayPlan.objects.create(itinerary=delhi_trip, day_number=1, title="Arrival & City Tour", description="Explore Red Fort", locations="Red Fort, Chandni Chowk")
        Attraction.objects.create(day_plan=d1, name="Red Fort", description="Historic fort in Delhi", image="/media/demo.jpg", estimated_cost=500)
        DayBudget.objects.create(day_plan=d1, attractions_cost=500, restaurants_cost=300, experiences_cost=0, total_cost=800, estimated_cost=1000)

        # ---------------- Manali Itineraries ----------------
        manali_trip = Itinerary.objects.create(
            destination=manali, category=budget, title="3D 2N Manali Adventure",
            duration_days=3, duration_nights=2, total_budget=12000,
            thumbnail="/media/demo.jpg", highlighted_places="Solang Valley, Hidimba Temple", popularity_score=85
        )

        manali_trip.tags.add(popular_tag)

        m1 = DayPlan.objects.create(itinerary=manali_trip, day_number=1, title="Arrival & Mall Road", description="Shopping and local food", locations="Mall Road")
        Restaurant.objects.create(day_plan=m1, name="Cafe 1947", cuisine="Continental", description="Popular cafe in Manali", image="/media/demo.jpg", estimated_cost=700)
        DayBudget.objects.create(day_plan=m1, attractions_cost=0, restaurants_cost=700, experiences_cost=0, total_cost=700, estimated_cost=1000)

        self.stdout.write(self.style.SUCCESS("✅ Demo data seeded successfully!"))
