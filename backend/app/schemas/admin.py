from typing import List
from pydantic import BaseModel


class AdminMetrics(BaseModel):
    totalRevenueToday: float
    totalBookingsCount: int
    liveBookingsCount: int
    occupancyPercent: int
    availableCourts: int
    totalCourts: int
    inPlayCourts: int
    reservedCourts: int
    maintenanceCourts: int


class AdminNotification(BaseModel):
    id: str
    title: str
    desc: str
    time: str
    unread: bool = True

