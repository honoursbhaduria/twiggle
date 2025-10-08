from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("api/auth/signup/", views.signup, name="signup"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", views.logout_view, name="logout"),
    
    path("api/trending-destinations/", views.trending_destinations_api, name="trending_destinations_api"),
    path("api/destinations/", views.destination_list_api, name="destination_list"),
    path("api/destinations/<slug:slug>/", views.destination_itineraries_api, name="destination_detail_api"),
    path("api/itineraries/<slug:slug>/", views.itinerary_detail_api, name="itinerary_detail_api"),
    path("api/categories/type/<slug:category_slug>/", views.itineraries_by_category, name="itineraries_by_category"),  #cache pending
    
    path("api/categories/tag/<slug:tag_slug>/", views.itineraries_by_tag, name="itineraries_by_tag"),
    path("api/destination/<slug:slug>/view/", views.destination_view_api, name="destination_view_api"), #for recording popularity views
    path("api/destination/<slug:slug>/dwell/", views.destination_dwell_api, name="destination_dwell_api"), #for recording dwell time
    path("api/destination/<slug:slug>/click/", views.destination_click_api, name="destination_click_api"), #for recording click throughs
    path("api/ratings/<str:model_name>/<int:object_id>/add/", views.add_rating, name="add_rating"), #still work neends to be done
    path("api/ratings/<str:model_name>/<int:object_id>/", views.get_ratings, name="get_ratings"),#still work neends to be done
    
    
    path("api/recommendations/destinations/", views.recommended_destinations_api, name="recommended_destinations_api"),
    path("api/recommendations/itineraries/", views.recommended_itineraries_api, name="recommended_itineraries_api"),
    
    path("api/attractions/search/", views.search_attractions, name="search_attractions"), #add condition with and without pagination, for without pagination only the count and title is enough
    path("api/search/suggestions/", views.search_suggestions, name="search_suggestions"), #not working for spelling mistakes
    path("api/search/results/", views.search_results, name="search_results"), #not sure why i implemented this
    
    path("api/itineraries/<slug:slug>/clone/", views.clone_itinerary_api, name="clone_itinerary"), #working
    path("api/my/itineraries/", views.my_itineraries_api, name="my_itineraries_list_create"), #working
    path("api/my/itineraries/<slug:slug>/", views.my_itinerary_detail_api, name="my_itinerary_detail"), #not checked
    
    
    path("api/itineraries/<slug:slug>/favorite/", views.add_favorite_itinerary, name="add_favorite_itinerary"), #working
    path("api/itineraries/<slug:slug>/unfavorite/", views.remove_favorite_itinerary, name="remove_favorite_itinerary"), #working
    path("api/my/favorites/", views.list_favorite_itineraries, name="list_favorite_itineraries"),   #working




]