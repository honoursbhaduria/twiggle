from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Destination, DestinationImage
from .cache_utils import clear_destination_cache

@receiver([post_save, post_delete], sender=Destination)
@receiver([post_save, post_delete], sender=DestinationImage)
def invalidate_destination_cache(sender, **kwargs):
    clear_destination_cache()