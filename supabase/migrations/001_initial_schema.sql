-- ============================================================
-- CrismaTest Initial Schema
-- Migration: 001_initial_schema
-- ============================================================

-- ============================================================
-- Table: contact_submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  company      text NOT NULL,
  email        text NOT NULL,
  team_size    text NOT NULL,
  message      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anon can INSERT (submit contact form), no SELECT (privacy)
CREATE POLICY "contact_submissions_anon_insert"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================
-- Table: mock_candidates
-- ============================================================
CREATE TABLE IF NOT EXISTS mock_candidates (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text NOT NULL,
  email               text NOT NULL,
  role                text NOT NULL,
  avatar_initials     text NOT NULL,
  avatar_color        text NOT NULL,
  crima_score         integer NOT NULL,
  logic_score         integer NOT NULL,
  comms_score         integer NOT NULL,
  job_skill_score     integer NOT NULL,
  trust_score         integer NOT NULL,
  fraud_flag_severity text NOT NULL CHECK (fraud_flag_severity IN ('Low', 'Medium', 'High')),
  fraud_flag_count    integer NOT NULL DEFAULT 0,
  status              text NOT NULL CHECK (status IN ('Pending', 'Reviewed', 'Hired', 'Rejected')),
  test_date           timestamptz NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mock_candidates ENABLE ROW LEVEL SECURITY;

-- Anon can SELECT (read candidate data for dashboard demo)
CREATE POLICY "mock_candidates_anon_select"
  ON mock_candidates
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- Table: questions
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role           text NOT NULL,
  question_type  text NOT NULL CHECK (question_type IN ('qcm', 'dragdrop', 'casestudy', 'simulation', 'audiovideo', 'shorttext')),
  text_en        text NOT NULL,
  text_fr        text NOT NULL,
  options_en     jsonb,
  options_fr     jsonb,
  correct_answer jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Anon can SELECT (load test questions)
CREATE POLICY "questions_anon_select"
  ON questions
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- Table: test_templates
-- ============================================================
CREATE TABLE IF NOT EXISTS test_templates (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role             text NOT NULL,
  slug             text NOT NULL UNIQUE,
  name             text NOT NULL,
  duration_minutes integer NOT NULL,
  modules          jsonb NOT NULL,
  active           boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE test_templates ENABLE ROW LEVEL SECURITY;

-- Anon can SELECT (load test templates)
CREATE POLICY "test_templates_anon_select"
  ON test_templates
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- Table: test_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS test_sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id        uuid NOT NULL REFERENCES test_templates(id),
  candidate_info jsonb NOT NULL,
  answers        jsonb NOT NULL DEFAULT '[]',
  score          integer,
  sub_scores     jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

-- Anon can INSERT (submit test session)
CREATE POLICY "test_sessions_anon_insert"
  ON test_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);
