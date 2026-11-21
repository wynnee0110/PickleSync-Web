from datetime import date as dt_date
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from app.schemas.court import CourtBase
from app.schemas.booking import CourtAvailabilityResponse
from app.services.booking_service import BookingService

router = APIRouter(prefix="/courts", tags=["Courts"])


@router.get("", response_model=List[CourtBase])
def get_courts():
    """
    Returns active courts (Court #1 & Court #2) with live status and specs.
    """
    return BookingService.get_courts()


@router.get("/availability", response_model=CourtAvailabilityResponse)
def get_court_availability(
    court_number: int = Query(..., alias="courtNumber", ge=1, le=2, description="Court number (1 or 2)"),
    date: Optional[str] = Query(None, description="Booking date string (e.g. 'Nov 21, 2026' or '2026-11-21', defaults to today)"),
):
    """
    Inspects real-time slot availability for a court on a date.
    Enforces the 5-day advance booking limit.
    """
    today = dt_date.today()
    date_str = date if date else f"{today.strftime('%b')} {today.day}, {today.year}"
    return BookingService.get_court_availability(court_number=court_number, date_str=date_str)

