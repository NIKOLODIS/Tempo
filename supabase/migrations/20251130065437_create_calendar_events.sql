/*
  # Create calendar events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique event identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `title` (text) - Event title
      - `description` (text, nullable) - Event description
      - `start_time` (timestamptz) - Event start date/time
      - `end_time` (timestamptz) - Event end date/time
      - `color` (text) - Event color indicator
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to view their own events
    - Add policy for authenticated users to insert their own events
    - Add policy for authenticated users to update their own events
    - Add policy for authenticated users to delete their own events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  color text DEFAULT '#4a90e2',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_start_time_idx ON events(start_time);
CREATE INDEX IF NOT EXISTS events_end_time_idx ON events(end_time);