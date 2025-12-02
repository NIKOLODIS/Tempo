# FY Tempo Calendar

A beautiful heptagonal calendar application built with React and Supabase, featuring unique weekly and monthly views with geometric visualization.

## Features

- **Authentication**: Secure user authentication with Supabase
- **Weekly View**: Heptagonal weekly calendar with 24-hour time slots
- **Monthly View**: Stacked heptagonal calendar showing the full fiscal year
- **Event Management**: Create, edit, and delete calendar events
- **Dark Theme**: Modern dark UI with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account (free tier works fine)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Tempo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in your project details and create the project
5. Wait for the project to be provisioned

#### Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the **Project URL** (VITE_SUPABASE_URL)
3. Copy the **anon public** key (VITE_SUPABASE_ANON_KEY)

#### Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20251130065437_create_calendar_events.sql`
4. Paste into the SQL Editor and click "Run"

This will create:
- The `events` table with proper schema
- Row Level Security (RLS) policies
- Necessary indexes for performance

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

### First Time Setup

1. Open the app in your browser
2. Click "Need an account? Sign Up"
3. Enter your email and password to create an account
4. Sign in with your credentials

### Creating Events

1. Click the "+ New Event" button in the top-right corner
2. Fill in the event details:
   - Title (required)
   - Description (optional)
   - Start Time (required)
   - End Time (required)
   - Color (optional - choose your preferred event color)
3. Click "Save"

### Managing Events

- **View Events**: Click on any event in the calendar to view details
- **Edit Events**: Click an event, modify the details, and click "Save"
- **Delete Events**: Click an event and click the "Delete" button

### Navigation

- **Switch Views**: Click "Weekly View" or "Monthly View" button to toggle
- **Monthly View**:
  - Scroll up/down to navigate between weeks
  - Click month names at the top to jump to that month
  - Use the dots on the right side to quickly navigate
- **Weekly View**: Shows the current week with 24-hour time slots

## Project Structure

```
Tempo/
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Authentication component
│   │   ├── MonthlyView.jsx   # Monthly calendar view
│   │   └── WeeklyView.jsx    # Weekly calendar view
│   ├── lib/
│   │   └── supabase.js       # Supabase client configuration
│   ├── App.jsx               # Main app component
│   └── main.jsx              # App entry point
├── supabase/
│   └── migrations/           # Database migrations
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Styling**: Inline styles (CSS-in-JS)

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own events
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## License

ISC

## Support

For issues or questions, please open an issue in the GitHub repository.
