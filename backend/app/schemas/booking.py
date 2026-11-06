from typing import List, Optional, Literal
from pydantic import BaseModel, Field


BookingStatusType = Literal["confirmed", "pending", "cancelled"]


class TimeSlotItem(BaseModel):
    time: str
    isPeak: bool
    status: Literal["available", "booked", "fast_filling"]
    price: int


class BookingCreate(BaseModel):
    courtId: str
    courtNumber: int
    courtName: str
    venue: str = "PickleSync Arena"
    date: str
    timeSlots: List[str]
    durationMinutes: int = 60
    playerNames: List[str] = Field(default_factory=lambda: ["You (Host)"])
    totalPrice: float
    splitPayment: bool = False
    paymentProvider: str = "card"


class BookingResponse(BaseModel):
    bookingId: str
    courtId: str
    courtName: str
    courtNumber: int
    venue: str
    date: str
    timeSlot: str
    durationMinutes: int
    playerNames: List[str]
    splitPayment: bool
    totalPrice: float
    status: BookingStatusType
    createdAt: str
    accessPassCode: str


class CourtAvailabilityResponse(BaseModel):
    date: str
    courtNumber: int
    courtId: str
    isFullyBooked: bool
    isBeyondAdvanceLimit: bool
    openSlotsCount: int
    totalSlotsCount: int
    occupiedSlotTimes: List[str]
    availableSlotTimes: List[str]

