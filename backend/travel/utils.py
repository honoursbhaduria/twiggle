from django.db.models import Avg, Count
from django.contrib.contenttypes.models import ContentType
from .models import Rating
from django.utils.timezone import now
from datetime import timedelta
from .models import Destination 
from django.db.models import Q

def get_rating_summary(obj):
    content_type = ContentType.objects.get_for_model(obj.__class__)
    ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)
    return {
        "average_rating": ratings.aggregate(avg=Avg("rating"))["avg"] or 0,
        "total_reviews": ratings.aggregate(count=Count("id"))["count"]
    }
    
    
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