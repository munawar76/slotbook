# Slotbook

A slot booking web app for scheduling interviews, meetings, and other sessions. Built with React, Vite, and Supabase.

## Features

- Book slots by selecting date, time, type (Interview / Meeting / Other), company name, and rounds
- Multiple profiles support with a profile switcher
- Admin panel to approve, decline, or delete bookings
- Real-time booking conflict detection
- Timezone support (IST and others)
- Notices/announcements system
- Links vault with PIN protection
- Theme switcher

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend/DB:** Supabase (PostgreSQL)
- **Styling:** Plain CSS with custom design system

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/munawar76/slotbook.git
cd slotbook
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Update `src/supabase.js` with your Supabase project URL and anon key.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Supabase Table

The `bookings` table requires these columns:

| Column | Type |
|---|---|
| id | text |
| date | text |
| start_time | text |
| end_time | text |
| type | text |
| title | text |
| rounds | text |
| description | text |
| booked_by | text |
| user_phone | text |
| profile_id | text |
| status | text |
| created_at | timestamp |

## Build for Production

```bash
npm run build
```
