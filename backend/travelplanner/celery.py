import os

from celery import Celery

# Default Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "travelplanner.settings")

app = Celery("travelplanner")

# Load settings with CELERY_ namespace from settings.py
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks.py in all installed apps
app.autodiscover_tasks()
