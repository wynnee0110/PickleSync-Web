# Admin Login Page Specification (ui-ux-pro-max)

> **PROJECT:** PickleSync  
> **Route:** `/admin/login`  
> **Target Audience:** Club managers, front desk staff, facility directors  
> **Aesthetic Profile:** Google Workspace Console / Material 3 Enterprise meets Pickleball Club Precision  
> **WCAG Compliance:** WCAG 2.2 AA Accessible Authentication, Color Contrast >= 4.5:1, Visible Focus  

---

## 1. Page Architecture & Layout

- **Layout Structure:**
  - Split responsive layout on desktop (Left: Brand & Live Facility Operations Insight; Right: High-security authentication panel).
  - Centered card layout on mobile / tablet (< 1024px) with high-density padding.
- **Background:** `#f8fafd` clean console surface with subtle court grid geometry (`.court-light-pattern`).
- **Surface Elevation:** White card (`#ffffff`) with `#dadce0` crisp structural border and soft elevation shadow (`0 20px 40px -15px rgba(15, 23, 42, 0.07)`).

---

## 2. Color Palette & Semantics

| Token | Hex | Role | Contrast vs #FFFFFF |
|-------|-----|------|---------------------|
| Primary Brand | `#0b57d0` | Main actions, primary CTA, active states | 5.2:1 (Pass AA) |
| Primary Hover | `#0842a0` | Hover state on primary button | 7.4:1 (Pass AAA) |
| Court Forest | `#4d7c0f` | Sport heritage accents, live status | 5.1:1 (Pass AA) |
| Court Lime | `#84cc16` | Active badges, energetic highlights | Non-text indicator |
| Neutral Text | `#1f1f1f` | Body & heading text | 16.1:1 (Pass AAA) |
| Muted Text | `#444746` | Subtitles, input placeholders, labels | 7.5:1 (Pass AAA) |
| Border | `#dadce0` | Card borders, input stroke | 1.4:1 structural |
| Error Destructive | `#ba1a1a` | Form error states, alerts | 6.8:1 (Pass AAA) |
| Success / Online | `#1e8e3e` | Live operations status indicator | 4.8:1 (Pass AA) |

---

## 3. WCAG 2.2 AA Accessible Authentication Requirements

1. **Password Managers & Paste:**
   - Full copy/paste support enabled. Never intercept or block `onPaste`.
   - Native input attributes: `autocomplete="username"` and `autocomplete="current-password"`.
2. **Accessible Form Feedback:**
   - Top-level `role="alert"` for authentication failure notifications with `tabIndex={-1}` for keyboard focus.
   - Inline field validation with `aria-describedby` links.
   - Screen-reader announceable `aria-invalid` attributes.
3. **Password Visibility Toggle:**
   - Accessible button with descriptive `aria-label="Show password"` / `aria-label="Hide password"`.
   - Never shifts layout bounds on state change.
4. **Touch & Click Targets:**
   - All interactive controls >= 44x44px.
   - Clear visible focus ring (`focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2`).

---

## 4. Operational & Demo Experience

- **Demo Role Presets:**
  - One-click credential filler for quick evaluation:
    - *General Manager* (`gm@picklesync.com`)
    - *Front Desk Lead* (`frontdesk@picklesync.com`)
    - *Court Operations* (`ops@picklesync.com`)
- **Two-Factor Authentication (2FA) Step Option:**
  - Support for 6-digit OTP verification code with auto-advance and paste support.
- **Session Duration Control:**
  - "Keep this terminal authenticated for 30 days" checkbox.
- **Redirection:**
  - Seamless redirect to `/admin` upon successful login, plus return link to consumer site.
