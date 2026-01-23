/*
  # Create predictions table for 5G energy consumption

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key) - Unique identifier for each prediction
      - `time_value` (numeric) - Time parameter for the prediction
      - `bs_station` (text) - Base station identifier
      - `load` (numeric) - Network load value
      - `esmode` (numeric) - Energy saving mode
      - `txpower` (numeric) - Transmission power
      - `predicted_energy` (numeric) - The predicted energy consumption result
      - `created_at` (timestamptz) - Timestamp of when prediction was made
      - `user_id` (uuid, nullable) - Optional user identifier for authenticated users
  
  2. Security
    - Enable RLS on `predictions` table
    - Add policy for anyone to insert predictions (public access)
    - Add policy for anyone to read predictions
    
  3. Indexes
    - Index on created_at for efficient time-based queries
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_value numeric NOT NULL,
  bs_station text NOT NULL,
  load numeric NOT NULL,
  esmode numeric NOT NULL,
  txpower numeric NOT NULL,
  predicted_energy numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert predictions (public tool)
CREATE POLICY "Anyone can create predictions"
  ON predictions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read predictions
CREATE POLICY "Anyone can view predictions"
  ON predictions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);