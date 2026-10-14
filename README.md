# 🏓 PickleSync-Web

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> **Next-generation Pickleball court reservation, digital access pass, and arena club management web application.** Built with Next.js 16 App Router, React 19, and Tailwind CSS v4.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Real-Time Court Booking Engine](#1-real-time-court-booking-engine-book)
  - [2. Digital Access Passes & Keyless Entry](#2-digital-access-passes--keyless-entry)
  - [3. Interactive USAP Court Blueprint & Telemetry](#3-interactive-usap-court-blueprint--telemetry)
  - [4. Arena Admin Management Dashboard](#4-arena-admin-management-dashboard-admin)
  - [5. Club Memberships & Passes](#5-club-memberships--passes-membership)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Dev Server](#running-the-dev-server)
  - [Building for Production](#building-for-production)
  - [Code Quality & Linting](#code-quality--linting)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**PickleSync** is a modern, high-performance web platform designed for premier pickleball arenas, tournament clubs, and community centers. It bridges players and facility operations with frictionless court scheduling, keyless smart-gate PIN generation, interactive court telemetry, and an executive administration suite.

Whether booking a 60-minute singles session on a Championship court or managing a 9-court facility during tournament weekends, PickleSync delivers an ultra-smooth experience with zero friction.

---

## ✨ Key Features

### 1. Real-Time Court Booking Engine (`/book`)
- **9 Specialized Courts**: Covers Championship arenas, acoustic indoor AC pavilions, rooftop covered decks, garden courtyard outdoor bays, and ball-launcher training labs.
- **Dynamic 3-Step Selection Grid**:
  1. **Court Carousel & Specs**: View surface materials (CushionX 8mm, Plexipave, Gel-Layered), lighting lux ratings, AI replay cams, and seating capacities.
  2. **Interactive Availability Calendar**: 12-month forward horizon, past-date lockout, and full-day tournament blackout indicators.
  3. **Time Slot Selector**: 1-hour slots from 08:00 AM to 09:00 PM, multi-slot selection, dynamic peak vs. off-peak pricing, and fast-filling badges.
- **Seamless 3-Stage Checkout Modal**:
  - Review reservation details and duration.
  - Payment method selector (Credit/Debit Card, Apple Pay, Arena Wallet).
  - Instant digital pass creation with celebratory confetti animations.

### 2. Digital Access Passes & Keyless Entry
- **Smart Turnstile PIN Generation**: Every confirmed reservation automatically issues a cryptographically unique entry PIN (`SYNC-XXXX`) valid 5 minutes before match start.
- **Global My Bookings Drawer**: Accessible from any page via the persistent navigation header; displays active passes, QR passes, dates, and times.
- **One-Tap Cancellations**: Instant pass revocation with automated refund processing status.

### 3. Interactive USAP Court Blueprint & Telemetry
- **Vector-Accurate USAP Court**: Top-down SVG schematic showcasing official 20' × 44' court dimensions and 34" net heights.
- **Interactive Telemetry Hotspots**:
  - **7 FT Non-Volley Zone ("The Kitchen")**: Regulation NVZ friction specifications.
  - **Tournament Net**: 34" center / 36" sideline tension diagnostics.
  - **AI DUPR Replay & Scoring Cam**: 4K 60fps tracking indicators.
  - **Keyless Turnstile**: Entry turnstile synchronization telemetry.
  - **Live Match Ticker**: Real-time score display and finish estimations for courts currently in play.

### 4. Arena Admin Management Dashboard (`/admin`)
- **Executive KPI Metrics**: Today's revenue, arena occupancy rate, active court counts, and player flow.
- **Live Court Status Controller**: Real-time status switching between `Available`, `In Play`, `Reserved`, and `Maintenance`.
- **Reservation Feed & Tabbed Filters**: Filter by `All`, `Confirmed`, `Completed`, or `Cancelled`.
- **Walk-in Reservation Modal**: Manual booking engine for front-desk staff.
- **One-Click CSV Export**: Instant generation and download of formatted booking reports (`PickleSync_Report_YYYY-MM-DD.csv`).
- **Member Directory & DUPR Roster**: Track online members, active tiers (VIP, Club Member, Guest, Staff), and ratings.

### 5. Club Memberships & Passes (`/membership`)
- **Tiered Plans**: Open Play Drop-in, Club Member, and Tournament Pro.
- **Transparent Perks**: Unlimited kitchen dinking drills, priority 14-day booking windows, guest passes, and pro-shop equipment discounts.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components, and optimized client bundles |
| **UI Library** | [React 19](https://react.dev/) | React 19.2.8 with client hooks and state persistence |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end typed interfaces for courts, slots, passes, and filters |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS variable styling with `@tailwindcss/postcss` |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight SVG icon system |
| **Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Milestone celebration animations for minted passes |
| **Linting** | [ESLint 9](https://eslint.org/) | Next.js core Web Vitals & React ESLint configurations |

---

## 📁 Project Architecture

```plaintext
PickleSync-Web/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Public landing page with Hero & Features
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout shell
│   │   ├── loading.tsx           # Admin loading skeleton
│   │   └── page.tsx              # Executive Arena Management Dashboard
│   ├── book/
│   │   └── page.tsx              # Full Court Scheduling & Booking Engine
│   ├── bookings/
│   │   ├── loading.tsx           # Loading state for user passes
│   │   └── page.tsx              # User reservation pass history
│   ├── membership/
│   │   └── page.tsx              # Club membership tiers & pass comparisons
│   ├── globals.css               # Global Tailwind CSS styles and theme vars
│   ├── layout.tsx                # Root HTML document and provider wrapper
│   ├── not-found.tsx             # Custom 404 page
│   └── error.tsx                 # Global error boundary handler
│
├── components/
│   ├── admin/                    # Admin dashboard modules
│   │   ├── sections/             # Metrics, Courts, Analytics, Bookings, Members
│   │   ├── modals/               # Manual Reservation & Court Status modals
│   │   ├── AdminHeader.tsx       # Top bar with notifications & session controls
│   │   ├── AdminSidebar.tsx      # Dashboard navigation drawer
│   │   └── AdminDashboardClient.tsx
│   ├── layout/                   # Global persistent layout
│   │   ├── Navbar.tsx            # Navigation bar with active passes counter
│   │   ├── Footer.tsx            # Arena footer, links, and sponsor information
│   │   └── RootShell.tsx         # Unified shell with toast notifications & drawer
│   ├── pages/                    # Route-level client components
│   │   ├── BookCourtClient.tsx   # Court booking page controller
│   │   └── BookingsClient.tsx    # User passes page controller
│   ├── providers/
│   │   └── BookingProvider.tsx   # Global React context for reservations & toast
│   ├── sections/                 # Landing & booking page sections
│   │   ├── HeroSection.tsx
│   │   ├── CourtScheduleSection.tsx # 3-Box court & calendar scheduling
│   │   ├── CourtHighlightsSection.tsx
│   │   └── MembershipSection.tsx
│   └── ui/                       # Reusable UI primitives
│       ├── BookingModal.tsx      # Multi-step checkout & PIN generation modal
│       ├── CourtBlueprint.tsx    # Interactive SVG telemetry visualizer
│       ├── CourtCard.tsx         # Court detail & status card
│       ├── MyBookingsDrawer.tsx  # Slide-out pass drawer
│       ├── PickleMascot.tsx      # Custom SVG brand mascot
│       └── Skeleton.tsx          # Loading placeholders
│
├── lib/
│   ├── courts.ts                 # 9-court data definitions, add-ons, and matches
│   └── courtAvailability.ts     # Occupancy simulation, blackout dates, & slots
│
├── types/
│   └── booking.ts                # TypeScript types for Courts, Slots, and Passes
│
├── public/                       # Static assets and SVG icons
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later (or `pnpm` / `yarn` / `bun`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wynnee0110/PickleSync-Web.git
   cd PickleSync-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Dev Server

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

Compile and bundle the application for production:
```bash
npm run build
```

Run the built application locally:
```bash
npm run start
```

### Code Quality & Linting

Run ESLint to ensure code adherence to standards:
```bash
npm run lint
```

---

## 🎨 Design System

PickleSync utilizes a tailored sports-performance color palette reflecting the energy and precision of tournament pickleball:

| Color Role | Hex Code | Utility |
| :--- | :--- | :--- |
| **Pickle Volt** | `#bef264` / `#a3e635` | Energetic branding accents, selections, and badges |
| **Deep Court Green** | `#365314` / `#4d7c0f` | Brand text, tournament highlights, and headers |
| **Tournament Blue** | `#2563eb` / `#1d4ed8` | Primary call-to-action buttons, links, and telemetry |
| **Slate Charcoal** | `#020617` / `#0f172a` | High-contrast typography and rich dark cards |
| **Status Emerald** | `#16a34a` / `#22c55e` | Available court indicators and pass confirmations |
| **Status Amber** | `#f59e0b` / `#d97706` | Fast-filling slots and in-play court badges |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
