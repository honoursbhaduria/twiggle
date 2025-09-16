from django.db.models import Avg, Count
from django.contrib.contenttypes.models import ContentType
from .models import Rating

def get_rating_summary(obj):
    content_type = ContentType.objects.get_for_model(obj.__class__)
    ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)
    return {
        "average_rating": ratings.aggregate(avg=Avg("rating"))["avg"] or 0,
        "total_reviews": ratings.aggregate(count=Count("id"))["count"]
    }