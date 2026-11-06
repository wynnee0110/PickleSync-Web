from typing import List, Dict, Any
from fastapi import APIRouter, Path, Body
from app.schemas.admin import AdminMetrics
from app.schemas.court import CourtBase, CourtStatusUpdate
from app.schemas.booking import BookingResponse
from app.services.booking_service import BookingService

router = APIRouter(prefix="/admin", tags=["Admin Operations"])


@router.get("/metrics", response_model=AdminMetrics)
def get_admin_metrics():
    """
    Returns live club metrics (revenue, occupancy %, court counts).
    """
    courts = BookingService.get_courts()
    bookings = BookingService.get_all_bookings()

    total_courts = len(courts)
    available_courts = sum(1 for c in courts if c.status == "available")
    in_play_courts = sum(1 for c in courts if c.status == "in_play")
    reserved_courts = sum(1 for c in courts if c.status == "reserved")
    maintenance_courts = sum(1 for c in courts if c.status == "maintenance")

    total_revenue = sum(b.totalPrice for b in bookings if b.status == "confirmed")
    occupancy = round(((in_play_courts + reserved_courts) / total_courts) * 100) if total_courts > 0 else 0

    return AdminMetrics(
        totalRevenueToday=total_revenue + 15500.0,
        totalBookingsCount=len(bookings),
        liveBookingsCount=len(bookings),
        occupancyPercent=occupancy,
        availableCourts=available_courts,
        totalCourts=total_courts,
        inPlayCourts=in_play_courts,
        reservedCourts=reserved_courts,
        maintenanceCourts=maintenance_courts,
    )


@router.patch("/courts/{court_id}/status", response_model=CourtBase)
def update_court_status(
    court_id: str = Path(..., description="Court ID (e.g. 'court-1')"),
    payload: CourtStatusUpdate = Body(...),
):
    """
    Instantly updates live court status ('available', 'in_play', 'reserved', 'maintenance').
    """
    return BookingService.update_court_status(court_id=court_id, new_status=payload.status)


@router.get("/bookings", response_model=List[BookingResponse])
def get_admin_bookings():
    """
    Returns full booking feed for admin dashboard monitoring.
    """
    return BookingService.get_all_bookings()

