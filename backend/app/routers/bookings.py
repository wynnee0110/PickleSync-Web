from typing import List, Dict, Any
from fastapi import APIRouter, Path
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import BookingService

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("", response_model=List[BookingResponse])
def get_bookings():
    """
    Returns active reservations and booked passes.
    """
    return BookingService.get_all_bookings()


@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(payload: BookingCreate):
    """
    Atomically books court time slots, generates gate access PIN, and commits to database.
    """
    return BookingService.create_booking(payload)


@router.post("/{booking_id}/cancel")
def cancel_booking(booking_id: str = Path(..., description="Booking ID to cancel (e.g. 'BK-782194')")):
    """
    Cancels a booking and frees its occupied slots.
    """
    return BookingService.cancel_booking(booking_id)

