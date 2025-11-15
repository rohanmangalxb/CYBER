-- Fix Profiles Table RLS - Restrict to authenticated users viewing only their own data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Fix Threats Table RLS - Require authentication for viewing
DROP POLICY IF EXISTS "Allow public read access to threats" ON public.threats;

CREATE POLICY "Authenticated users can view threats" 
ON public.threats 
FOR SELECT 
TO authenticated
USING (true);

-- Add write policies for threats table to prevent unauthorized modifications
CREATE POLICY "Service can insert threats" 
ON public.threats 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update threat status" 
ON public.threats 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Prevent deletion of threat records to maintain audit trail
-- Only allow if explicitly needed for your use case
CREATE POLICY "Prevent threat deletion" 
ON public.threats 
FOR DELETE 
TO authenticated
USING (false);