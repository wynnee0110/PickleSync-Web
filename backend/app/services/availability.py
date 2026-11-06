from datetime import datetime, date, timedelta
from typing import List, Tuple
from app.config import settings

# 1-Hour Schedule intervals (Morning & Afternoon)
MORNING_SLOTS = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
]

AFTERNOON_SLOTS = [
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
]

ALL_SLOT_TIMES = MORNING_SLOTS + AFTERNOON_SLOTS

# Base reference date matching design specifications (Sep 9, 2025)
BASE_DATE = date(2025, 9, 9)

# Deterministic occupied court slots pattern for mock / fallback
MOCK_OCCUPIED_BY_DAY_AND_TIME = {
    9: {
        "08:00 AM": [2],
        "09:00 AM": [1],
        "10:00 AM": [1],
        "11:00 AM": [2],
        "12:00 PM": [],
        "01:00 PM": [2],
        "02:00 PM": [1],
        "03:00 PM": [2],
        "04:00 PM": [1, 2],  # 100% Full
        "05:00 PM": [1],
        "06:00 PM": [2],
        "07:00 PM": [1, 2],  # 100% Full
        "08:00 PM": [],
    },
    10: {
        "08:00 AM": [1, 2],  # 100% Full
        "09:00 AM": [1],
        "10:00 AM": [2],
        "11:00 AM": [],
        "12:00 PM": [2],
        "01:00 PM": [1],
        "02:00 PM": [],
        "03:00 PM": [2],
        "04:00 PM": [1],
        "05:00 PM": [1, 2],  # 100% Full
        "06:00 PM": [2],
        "07:00 PM": [1],
        "08:00 PM": [],
    },
}


def parse_date_string(date_str: str) -> date:
    """
    Parses dates in formats like '2025-09-09' or 'Sep 9, 2025' or 'Sep 9'.
    """
    clean_str = date_str.strip()
    if clean_str in ["Today", "today"]:
        return BASE_DATE
    if clean_str in ["Tomorrow", "tomorrow"]:
        return BASE_DATE + timedelta(days=1)
        
    for fmt in ("%Y-%m-%d", "%b %d, %Y", "%B %d, %Y", "%b %d"):
        try:
            parsed = datetime.strptime(clean_str, fmt).date()
            if fmt == "%b %d":
                parsed = parsed.replace(year=BASE_DATE.year)
            return parsed
        except ValueError:
            continue
            
    # Default fallback
    return BASE_DATE


def is_beyond_advance_limit(target_date: date) -> bool:
    """
    Enforces the business rule: booking advance is limited to at most 5 days.
    """
    delta_days = (target_date - BASE_DATE).days
    return delta_days > settings.MAX_ADVANCE_DAYS or delta_days < 0


def get_mock_occupied_courts_for_slot(target_date: date, time_slot: str) -> List[int]:
    day_num = target_date.day
    if day_num in MOCK_OCCUPIED_BY_DAY_AND_TIME:
        slot_map = MOCK_OCCUPIED_BY_DAY_AND_TIME[day_num]
        if time_slot in slot_map:
            return slot_map[time_slot]

    # Deterministic fallback pattern for other days within the 5-day window
    time_hash = int(time_slot.split(":")[0]) if ":" in time_slot else 1
    is_pm = "PM" in time_slot
    numeric_hour = (time_hash + 12) if (is_pm and time_hash != 12) else time_hash
    mod = (day_num + numeric_hour) % 3
    if mod == 0:
        return [1]
    if mod == 1:
        return [2]
    return []

