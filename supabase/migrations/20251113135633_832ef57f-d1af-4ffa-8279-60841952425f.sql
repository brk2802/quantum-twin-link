-- Create students table for storing student information
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  registration_no text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow students to view their own profile
CREATE POLICY "Students can view their own profile"
  ON public.students
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow students to update their own profile
CREATE POLICY "Students can update their own profile"
  ON public.students
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_students_name ON public.students(name);
CREATE INDEX idx_students_registration_no ON public.students(registration_no);