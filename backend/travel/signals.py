from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Destination, DestinationImage, DestinationView, Rating, Attraction,Category
from .tasks import precache_destinations
from .cache_utils import clear_destination_cache
from django.apps import AppConfig
from .tasks import rebuild_recommendations, precache_itineraries_by_category
from django.core.cache import cache

class TravelConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "travel"

    def ready(self):
        try:
            rebuild_recommendations.delay()
        except Exception:
            pass
        
@receiver([post_save, post_delete], sender=Destination)
@receiver([post_save, post_delete], sender=DestinationImage)
def invalidate_destination_cache(sender, **kwargs):
    clear_destination_cache()
    precache_destinations.delay()  # 🔥 auto rebuild
    

        
@receiver(post_save, sender=DestinationView)
@receiver(post_save, sender=Rating)
def invalidate_user_recommendations(sender, instance, **kwargs):
    user = getattr(instance, "user", None)
    if user and user.is_authenticated:
        cache.delete(f"recommendations:user:{user.id}:destinations")
        cache.delete(f"recommendations:user:{user.id}:itineraries")
        
        
@receiver(pre_save, sender=Attraction)
def sync_location_fields(sender, instance, **kwargs):
    """
    Ensure city/state/country are copied from related Location.
    Avoids stale denormalized data.
    """
    if instance.location:
        instance.city = instance.location.city or ""
        instance.state = instance.location.state or ""
        instance.country = instance.location.country or ""
        
@receiver([post_save, post_delete], sender=Category)
def invalidate_category_itinerary_cache(sender, **kwargs):
    try:
        precache_itineraries_by_category.delay()
    except Exception:
        pass