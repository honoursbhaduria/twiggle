from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("api/auth/signup/", views.signup, name="signup"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", views.logout_view, name="logout"),
    path("api/trending-destinations/", views.trending_destinations_api, name="trending_destinations_api"),
    path("api/destinations/<slug:slug>/", views.destination_detail_api, name="destination_detail_api"),
    path("api/itineraries/<slug:slug>/", views.itinerary_detail_api, name="itinerary_detail_api"),
    path("api/categories/tag/<slug:tag_slug>/", views.itineraries_by_tag, name="itineraries_by_tag"),
    path("api/categories/type/<slug:category_slug>/", views.itineraries_by_category, name="itineraries_by_category"),
    path("api/destination/<slug:slug>/view/", views.destination_view_api, name="destination_view_api"),
    path("api/destination/<slug:slug>/dwell/", views.destination_dwell_api, name="destination_dwell_api"),
    path("api/destination/<slug:slug>/click/", views.destination_click_api, name="destination_click_api"),
    path("api/ratings/<str:model_name>/<int:object_id>/add/", views.add_rating, name="add_rating"),
    path("api/ratings/<str:model_name>/<int:object_id>/", views.get_ratings, name="get_ratings"),

]