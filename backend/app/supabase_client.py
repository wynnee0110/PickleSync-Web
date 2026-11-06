import logging
from typing import Optional
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("picklesync.supabase")

_supabase_client: Optional[Client] = None
_supabase_admin_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Returns the public/anon Supabase client instance, or None if not configured.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Connected to Supabase client successfully")
            return _supabase_client
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}")
            return None
    return None


def get_supabase_admin_client() -> Optional[Client]:
    """
    Returns the privileged service-role Supabase client instance for admin operations.
    """
    global _supabase_admin_client
    if _supabase_admin_client is not None:
        return _supabase_admin_client

    service_key = settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_KEY
    if settings.SUPABASE_URL and service_key:
        try:
            _supabase_admin_client = create_client(settings.SUPABASE_URL, service_key)
            logger.info("Connected to Supabase admin client successfully")
            return _supabase_admin_client
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase admin client: {e}")
            return None
    return None

