-- ============================================================================
-- PickleSync Supabase PostgreSQL Schema & RPC Migration
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Courts Table (Court #1 and Court #2)
CREATE TABLE IF NOT EXISTS public.courts (
    id TEXT PRIMARY KEY,
    court_number INT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    venue TEXT NOT NULL DEFAULT 'PickleSync Arena',
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- 'indoor' | 'championship'
    surface TEXT NOT NULL,
    price_per_hour NUMERIC NOT NULL DEFAULT 200,
    peak_price_per_hour NUMERIC NOT NULL DEFAULT 200,
    rating NUMERIC DEFAULT 4.95,
    review_count INT DEFAULT 250,
    features TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'in_play' | 'reserved' | 'maintenance'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY, -- e.g. 'BK-901234'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    court_id TEXT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    court_number INT NOT NULL,
    court_name TEXT NOT NULL,
    venue TEXT NOT NULL DEFAULT 'PickleSync Arena',
    booking_date TEXT NOT NULL, -- e.g. 'Sep 9, 2025' or '2025-09-09'
    time_slot TEXT NOT NULL,   -- e.g. '08:00 AM, 09:00 AM'
    duration_minutes INT NOT NULL DEFAULT 60,
    player_names TEXT[] NOT NULL DEFAULT '{"You (Host)"}',
    total_price NUMERIC NOT NULL DEFAULT 200,
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'pending' | 'cancelled'
    access_pass_code TEXT UNIQUE NOT NULL,    -- e.g. 'SYNC-CRT1-4829'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. Atomic Court Slots Table (Guarantees Zero Double-Booking)
CREATE TABLE IF NOT EXISTS public.court_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    court_id TEXT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    
    -- Absolute concurrency constraint: cannot occupy the same court, date, and hour slot twice!
    CONSTRAINT unique_court_slot UNIQUE (court_id, date, time_slot)
);

CREATE INDEX IF NOT EXISTS idx_court_slots_date_court ON public.court_slots(date, court_id);

-- 5. Admin Notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    time_label TEXT NOT NULL,
    unread BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PHP',
    provider TEXT NOT NULL DEFAULT 'card', -- 'card' | 'apple_pay' | 'wallet'
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================================
-- 7. Atomic Booking Postgres Function (RPC)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.book_court_atomic(
    p_booking_id TEXT,
    p_court_id TEXT,
    p_court_number INT,
    p_court_name TEXT,
    p_venue TEXT,
    p_date TEXT,
    p_time_slots TEXT[],
    p_duration_minutes INT,
    p_player_names TEXT[],
    p_total_price NUMERIC,
    p_access_pass_code TEXT,
    p_payment_provider TEXT DEFAULT 'card'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_slot TEXT;
    v_conflict_count INT;
    v_booking_record RECORD;
BEGIN
    -- 1. Check if any slot is already reserved for this court and date
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.court_slots
    WHERE court_id = p_court_id
      AND date = p_date
      AND time_slot = ANY(p_time_slots);

    IF v_conflict_count > 0 THEN
        RAISE EXCEPTION 'One or more selected slots are already booked. Please choose another slot.';
    END IF;

    -- 2. Insert main booking record
    INSERT INTO public.bookings (
        id, court_id, court_number, court_name, venue,
        booking_date, time_slot, duration_minutes,
        player_names, total_price, status, access_pass_code
    )
    VALUES (
        p_booking_id, p_court_id, p_court_number, p_court_name, p_venue,
        p_date, array_to_string(p_time_slots, ', '), p_duration_minutes,
        p_player_names, p_total_price, 'confirmed', p_access_pass_code
    )
    RETURNING * INTO v_booking_record;

    -- 3. Reserve individual hourly slot slots
    FOREACH v_slot IN ARRAY p_time_slots LOOP
        INSERT INTO public.court_slots (court_id, date, time_slot, booking_id)
        VALUES (p_court_id, p_date, v_slot, p_booking_id);
    END LOOP;

    -- 4. Record payment transaction
    INSERT INTO public.payment_transactions (booking_id, amount, provider, status)
    VALUES (p_booking_id, p_total_price, p_payment_provider, 'completed');

    -- 5. Insert notification for Admin Dashboard
    INSERT INTO public.admin_notifications (title, description, time_label, unread)
    VALUES (
        'New Reservation Confirmed',
        format('%s booked Court #%s for %s (%s)', p_player_names[1], p_court_number, p_date, array_to_string(p_time_slots, ', ')),
        'Just now',
        true
    );

    RETURN to_jsonb(v_booking_record);
END;
$$;

-- ============================================================================
-- 8. Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view courts" ON public.courts FOR SELECT USING (true);
CREATE POLICY "Public can view slots" ON public.court_slots FOR SELECT USING (true);
CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);

-- ============================================================================
-- 9. Initial Seed Data (Court #1 & Court #2)
-- ============================================================================
INSERT INTO public.courts (id, court_number, name, venue, location, type, surface, price_per_hour, peak_price_per_hour, features, status)
VALUES
  ('court-1', 1, 'Court #1 · Center Court Championship', 'PickleSync Arena', 'Main Pavilion • Bay 01', 'championship', 'CushionX 8mm Tournament Pro', 200, 200, ARRAY['600 Lux Broadcast LED', 'AI Replay & DUPR Cam', 'Climate Controlled (68°F)', 'Stadium Bleachers'], 'available'),
  ('court-2', 2, 'Court #2 · The Sonic Dome (Indoor AC)', 'PickleSync Arena', 'Main Pavilion • Bay 02', 'indoor', 'CushionX Sound-Damped Pro', 200, 200, ARRAY['Acoustic Noise Felt', 'Spinshot Ball Machine', 'Ultra-Grip Cushioning', 'Player Dugout & Chiller'], 'in_play')
ON CONFLICT (id) DO NOTHING;

