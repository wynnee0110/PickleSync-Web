import random
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from threading import Lock
from fastapi import HTTPException
from app.supabase_client import get_supabase_client, get_supabase_admin_client
from app.schemas.court import CourtBase
from app.schemas.booking import BookingCreate, BookingResponse, CourtAvailabilityResponse
from app.services.availability import (
    ALL_SLOT_TIMES,
    format_date_label,
    parse_date_string,
    is_beyond_advance_limit,
    is_slot_in_past,
    get_mock_occupied_courts_for_slot,
)

logger = logging.getLogger("picklesync.booking_service")

# Concurrency lock for in-memory fallback
_in_memory_lock = Lock()

# In-memory store fallback when Supabase keys are not set
_in_memory_courts: List[Dict[str, Any]] = [
    {
        "id": "court-1",
        "courtNumber": 1,
        "name": "Court #1 · Center Court Championship",
        "venue": "PickleSync Arena",
        "location": "Main Pavilion • Bay 01",
        "type": "championship",
        "surface": "CushionX 8mm Tournament Pro",
        "pricePerHour": 200,
        "peakPricePerHour": 200,
        "rating": 4.98,
        "reviewCount": 384,
        "features": [
            "600 Lux Broadcast LED Lighting",
            "Live AI Replay & DUPR Camera Tracking",
            "Climate Controlled (68°F / 20°C)",
            "Stadium Bleachers (Seats 80)",
        ],
        "status": "available",
    },
    {
        "id": "court-2",
        "courtNumber": 2,
        "name": "Court #2 · The Sonic Dome (Indoor AC)",
        "venue": "PickleSync Arena",
        "location": "Main Pavilion • Bay 02",
        "type": "indoor",
        "surface": "CushionX Sound-Damped Pro",
        "pricePerHour": 200,
        "peakPricePerHour": 200,
        "rating": 4.93,
        "reviewCount": 226,
        "features": [
            "Acoustic Felt Noise Absorption",
            "Spinshot Ball Machine Enabled",
            "Ultra-Grip Cushioning",
            "Private Player Dugout & Water Chiller",
        ],
        "status": "in_play",
    },
]

_today_label = format_date_label(datetime.now().date())

_in_memory_bookings: List[Dict[str, Any]] = [
    {
        "bookingId": "BK-782194",
        "courtId": "court-1",
        "courtName": "Court #1 · Center Court Championship",
        "courtNumber": 1,
        "venue": "PickleSync Arena",
        "date": _today_label,
        "timeSlot": "07:00 PM",
        "durationMinutes": 60,
        "playerNames": ["You (Host)", "Jordan Vance"],
        "splitPayment": True,
        "totalPrice": 200.0,
        "status": "confirmed",
        "createdAt": "11:20 AM",
        "accessPassCode": "SYNC-CRT1-9428",
    }
]

# Set of reserved slots: (court_id, date_str, time_slot)
_in_memory_reserved_slots = {
    ("court-1", _today_label, "07:00 PM"),
}


class BookingService:
    @staticmethod
    def get_courts() -> List[CourtBase]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("courts").select("*").order("court_number").execute()
                if res.data:
                    return [
                        CourtBase(
                            id=item["id"],
                            courtNumber=item["court_number"],
                            name=item["name"],
                            venue=item.get("venue", "PickleSync Arena"),
                            location=item["location"],
                            type=item["type"],
                            surface=item["surface"],
                            pricePerHour=int(item.get("price_per_hour", 200)),
                            peakPricePerHour=int(item.get("peak_price_per_hour", 200)),
                            rating=float(item.get("rating", 4.95)),
                            reviewCount=int(item.get("review_count", 250)),
                            features=item.get("features", []),
                            status=item.get("status", "available"),
                        )
                        for item in res.data
                    ]
            except Exception as e:
                logger.warning(f"Failed to query Supabase courts table, using fallback: {e}")

        # In-memory fallback
        return [CourtBase(**c) for c in _in_memory_courts]

    @staticmethod
    def update_court_status(court_id: str, new_status: str) -> CourtBase:
        admin_client = get_supabase_admin_client()
        if admin_client:
            try:
                res = admin_client.table("courts").update({"status": new_status}).eq("id", court_id).execute()
                if res.data:
                    item = res.data[0]
                    return CourtBase(
                        id=item["id"],
                        courtNumber=item["court_number"],
                        name=item["name"],
                        venue=item.get("venue", "PickleSync Arena"),
                        location=item["location"],
                        type=item["type"],
                        surface=item["surface"],
                        pricePerHour=int(item.get("price_per_hour", 200)),
                        peakPricePerHour=int(item.get("peak_price_per_hour", 200)),
                        rating=float(item.get("rating", 4.95)),
                        reviewCount=int(item.get("review_count", 250)),
                        features=item.get("features", []),
                        status=item.get("status", new_status),
                    )
            except Exception as e:
                logger.warning(f"Failed to update Supabase court status, using fallback: {e}")

        # In-memory fallback
        with _in_memory_lock:
            for court in _in_memory_courts:
                if court["id"] == court_id:
                    court["status"] = new_status
                    return CourtBase(**court)
        raise HTTPException(status_code=404, detail="Court not found")

    @staticmethod
    def get_court_availability(court_number: int, date_str: str) -> CourtAvailabilityResponse:
        parsed_date = parse_date_string(date_str)
        is_beyond = is_beyond_advance_limit(parsed_date)

        court_id = f"court-{court_number}"
        formatted_date = format_date_label(parsed_date)

        occupied_slots: List[str] = []

        # Check Supabase court_slots table
        client = get_supabase_client()
        if client:
            try:
                res = (
                    client.table("court_slots")
                    .select("time_slot")
                    .eq("court_id", court_id)
                    .eq("date", formatted_date)
                    .execute()
                )
                if res.data is not None:
                    occupied_slots = [r["time_slot"] for r in res.data]
            except Exception as e:
                logger.warning(f"Failed to query Supabase court_slots, using mock fallback: {e}")
                occupied_slots = []

        # If no DB records, calculate mock occupancy
        if not occupied_slots:
            mock_occupied = []
            for slot_time in ALL_SLOT_TIMES:
                oc_courts = get_mock_occupied_courts_for_slot(parsed_date, slot_time)
                if court_number in oc_courts:
                    mock_occupied.append(slot_time)

            # Also include any live in-memory reservations
            with _in_memory_lock:
                for c_id, d_str, t_slot in _in_memory_reserved_slots:
                    if c_id == court_id and (d_str == formatted_date or d_str == date_str):
                        if t_slot not in mock_occupied:
                            mock_occupied.append(t_slot)
            occupied_slots = mock_occupied

        # Mark past time slots on today's date as unavailable
        for slot_time in ALL_SLOT_TIMES:
            if is_slot_in_past(parsed_date, slot_time) and slot_time not in occupied_slots:
                occupied_slots.append(slot_time)

        available_slots = [s for s in ALL_SLOT_TIMES if s not in occupied_slots]
        open_count = len(available_slots)
        is_fully_booked = open_count == 0 or is_beyond

        return CourtAvailabilityResponse(
            date=formatted_date,
            courtNumber=court_number,
            courtId=court_id,
            isFullyBooked=is_fully_booked,
            isBeyondAdvanceLimit=is_beyond,
            openSlotsCount=0 if is_beyond else open_count,
            totalSlotsCount=len(ALL_SLOT_TIMES),
            occupiedSlotTimes=occupied_slots if not is_beyond else ALL_SLOT_TIMES,
            availableSlotTimes=[] if is_beyond else available_slots,
        )

    @staticmethod
    def create_booking(data: BookingCreate) -> BookingResponse:
        parsed_date = parse_date_string(data.date)
        formatted_date = format_date_label(parsed_date)

        # 1. Enforce 5-Day Advance Booking Rule
        if is_beyond_advance_limit(parsed_date):
            raise HTTPException(
                status_code=400,
                detail="Booking advance is strictly limited to 5 days. Please select an earlier date.",
            )

        # 1b. Prevent booking time slots that have already passed today
        for slot in data.timeSlots:
            if is_slot_in_past(parsed_date, slot):
                raise HTTPException(
                    status_code=400,
                    detail=f"Time slot {slot} on {formatted_date} has already passed. Please select an upcoming time.",
                )

        new_booking_id = f"BK-{random.randint(100000, 999999)}"
        pin_code = random.randint(1000, 9999)
        access_pass = f"SYNC-CRT{data.courtNumber}-{pin_code}"
        now_time = datetime.now().strftime("%I:%M %p")

        # 2. Attempt Supabase Atomic RPC
        client = get_supabase_client()
        if client:
            try:
                rpc_res = client.rpc(
                    "book_court_atomic",
                    {
                        "p_booking_id": new_booking_id,
                        "p_court_id": data.courtId,
                        "p_court_number": data.courtNumber,
                        "p_court_name": data.courtName,
                        "p_venue": data.venue,
                        "p_date": formatted_date,
                        "p_time_slots": data.timeSlots,
                        "p_duration_minutes": data.durationMinutes,
                        "p_player_names": data.playerNames,
                        "p_total_price": float(data.totalPrice),
                        "p_access_pass_code": access_pass,
                        "p_payment_provider": data.paymentProvider,
                    },
                ).execute()

                if rpc_res.data:
                    record = rpc_res.data
                    return BookingResponse(
                        bookingId=record["id"],
                        courtId=record["court_id"],
                        courtName=record["court_name"],
                        courtNumber=record["court_number"],
                        venue=record["venue"],
                        date=record["booking_date"],
                        timeSlot=record["time_slot"],
                        durationMinutes=record["duration_minutes"],
                        playerNames=record["player_names"],
                        splitPayment=data.splitPayment,
                        totalPrice=float(record["total_price"]),
                        status="confirmed",
                        createdAt=now_time,
                        accessPassCode=record["access_pass_code"],
                    )
            except Exception as e:
                err_msg = str(e)
                if "already booked" in err_msg.lower():
                    raise HTTPException(status_code=409, detail="One or more selected slots were just booked.")
                logger.warning(f"Supabase RPC failed, using in-memory atomic lock: {e}")

        # 3. In-memory atomic reservation lock fallback
        with _in_memory_lock:
            # Check slot conflict
            for slot in data.timeSlots:
                if (data.courtId, formatted_date, slot) in _in_memory_reserved_slots:
                    raise HTTPException(
                        status_code=409,
                        detail=f"Slot {slot} on {formatted_date} is already booked. Please choose another slot.",
                    )

            # Reserve all slots
            for slot in data.timeSlots:
                _in_memory_reserved_slots.add((data.courtId, formatted_date, slot))

            new_booking = {
                "bookingId": new_booking_id,
                "courtId": data.courtId,
                "courtName": data.courtName,
                "courtNumber": data.courtNumber,
                "venue": data.venue,
                "date": formatted_date,
                "timeSlot": ", ".join(data.timeSlots),
                "durationMinutes": data.durationMinutes,
                "playerNames": data.playerNames,
                "splitPayment": data.splitPayment,
                "totalPrice": data.totalPrice,
                "status": "confirmed",
                "createdAt": now_time,
                "accessPassCode": access_pass,
            }
            _in_memory_bookings.insert(0, new_booking)

            return BookingResponse(**new_booking)

    @staticmethod
    def cancel_booking(booking_id: str) -> Dict[str, Any]:
        admin_client = get_supabase_admin_client()
        if admin_client:
            try:
                admin_client.table("bookings").update({"status": "cancelled"}).eq("id", booking_id).execute()
                admin_client.table("court_slots").delete().eq("booking_id", booking_id).execute()
                return {"success": True, "message": f"Reservation {booking_id} cancelled and slots released."}
            except Exception as e:
                logger.warning(f"Failed to cancel booking via Supabase: {e}")

        # In-memory fallback
        with _in_memory_lock:
            target_booking = None
            for b in _in_memory_bookings:
                if b["bookingId"] == booking_id:
                    b["status"] = "cancelled"
                    target_booking = b
                    break

            if target_booking:
                court_id = target_booking["courtId"]
                date_val = target_booking["date"]
                slots = [s.strip() for s in target_booking["timeSlot"].split(",")]
                for s in slots:
                    _in_memory_reserved_slots.discard((court_id, date_val, s))
                return {"success": True, "message": f"Reservation {booking_id} cancelled and slots released."}

        return {"success": True, "message": f"Reservation {booking_id} status updated."}

    @staticmethod
    def get_all_bookings() -> List[BookingResponse]:
        client = get_supabase_client()
        if client:
            try:
                res = client.table("bookings").select("*").order("created_at", desc=True).limit(50).execute()
                if res.data:
                    return [
                        BookingResponse(
                            bookingId=item["id"],
                            courtId=item["court_id"],
                            courtName=item["court_name"],
                            courtNumber=item["court_number"],
                            venue=item.get("venue", "PickleSync Arena"),
                            date=item["booking_date"],
                            timeSlot=item["time_slot"],
                            durationMinutes=item.get("duration_minutes", 60),
                            playerNames=item.get("player_names", ["Member"]),
                            splitPayment=False,
                            totalPrice=float(item.get("total_price", 200)),
                            status=item.get("status", "confirmed"),
                            createdAt=item.get("created_at", "Just now"),
                            accessPassCode=item.get("access_pass_code", "SYNC-XXXX"),
                        )
                        for item in res.data
                    ]
            except Exception as e:
                logger.warning(f"Failed to query Supabase bookings, using fallback: {e}")

        return [BookingResponse(**b) for b in _in_memory_bookings]

