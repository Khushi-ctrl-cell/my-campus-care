-- Add super_admin role to the enum (this must be committed before using)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';