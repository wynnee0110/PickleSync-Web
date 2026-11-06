from typing import List, Optional, Literal
from pydantic import BaseModel, Field


CourtStatusType = Literal["available", "in_play", "reserved", "maintenance"]
CourtType = Literal["indoor", "championship", "outdoor", "covered"]


class CourtBase(BaseModel):
    id: str
    courtNumber: int
    name: str
    venue: str = "PickleSync Arena"
    location: str
    type: CourtType
    surface: str
    pricePerHour: int = 200
    peakPricePerHour: int = 200
    rating: float = 4.95
    reviewCount: int = 250
    features: List[str] = Field(default_factory=list)
    status: CourtStatusType = "available"


class CourtStatusUpdate(BaseModel):
    status: CourtStatusType

