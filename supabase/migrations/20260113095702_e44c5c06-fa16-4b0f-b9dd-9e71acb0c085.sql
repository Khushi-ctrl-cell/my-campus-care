-- Create skills table for student submissions
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('certificate', 'internship', 'achievement', 'extracurricular')),
  title TEXT NOT NULL,
  description TEXT,
  issuing_authority TEXT,
  category TEXT,
  url TEXT,
  date_obtained DATE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Students can view their own skills
CREATE POLICY "Students can view their own skills"
ON public.skills FOR SELECT
USING (auth.uid() = user_id);

-- Students can insert their own skills
CREATE POLICY "Students can insert their own skills"
ON public.skills FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Students can update their own skills
CREATE POLICY "Students can update their own skills"
ON public.skills FOR UPDATE
USING (auth.uid() = user_id);

-- Students can delete their own skills
CREATE POLICY "Students can delete their own skills"
ON public.skills FOR DELETE
USING (auth.uid() = user_id);

-- Mentors can view all skills
CREATE POLICY "Mentors can view all skills"
ON public.skills FOR SELECT
USING (public.has_role(auth.uid(), 'mentor'));

-- Mentors can verify skills
CREATE POLICY "Mentors can verify skills"
ON public.skills FOR UPDATE
USING (public.has_role(auth.uid(), 'mentor'));

-- Admins can view all skills
CREATE POLICY "Admins can view all skills"
ON public.skills FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all skills
CREATE POLICY "Admins can update all skills"
ON public.skills FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Super admins have full access
CREATE POLICY "Super admins have full access to skills"
ON public.skills FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Create mentor_assignments table
CREATE TABLE public.mentor_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(mentor_id, student_id)
);

-- Enable RLS on mentor_assignments
ALTER TABLE public.mentor_assignments ENABLE ROW LEVEL SECURITY;

-- Mentors can view their own assignments
CREATE POLICY "Mentors can view their assignments"
ON public.mentor_assignments FOR SELECT
USING (auth.uid() = mentor_id);

-- Students can view their mentor assignments
CREATE POLICY "Students can view their mentor"
ON public.mentor_assignments FOR SELECT
USING (auth.uid() = student_id);

-- Admins can manage mentor assignments
CREATE POLICY "Admins can manage mentor assignments"
ON public.mentor_assignments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Super admins have full access to mentor assignments
CREATE POLICY "Super admins have full access to mentor assignments"
ON public.mentor_assignments FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Add trigger for updated_at on skills
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user can verify skills
CREATE OR REPLACE FUNCTION public.can_verify_skills(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('mentor', 'admin', 'super_admin')
  )
$$;

-- Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role 
      WHEN 'super_admin' THEN 1 
      WHEN 'admin' THEN 2 
      WHEN 'mentor' THEN 3 
      WHEN 'counsellor' THEN 4 
      WHEN 'student' THEN 5 
    END 
  LIMIT 1
$$;