from django.core.cache import cache

def clear_destination_cache():
    # Clear all cached destination list responses
    # We prefix all keys with "destinations:" so we can nuke them safely
    keys = cache.keys("destinations:*") if hasattr(cache, "keys") else []
    if keys:
        cache.delete_many(keys)
