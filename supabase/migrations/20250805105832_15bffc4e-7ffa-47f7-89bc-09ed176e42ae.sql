-- Add farmer-specific columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone text,
ADD COLUMN location text,
ADD COLUMN bio text,
ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

-- Create a dedicated farmer_profiles table for detailed farmer information
CREATE TABLE public.farmer_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_years integer,
  farm_size_acres numeric,
  primary_crops text[],
  secondary_crops text[],
  farming_methods text[],
  region text,
  district text,
  state text,
  irrigation_type text,
  soil_type text,
  certifications text[],
  equipment_owned text[],
  storage_capacity_tons numeric,
  annual_production_tons numeric,
  preferred_market_channels text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on farmer_profiles
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farmer_profiles
CREATE POLICY "Users can view their own farmer profile" 
ON public.farmer_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own farmer profile" 
ON public.farmer_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farmer profile" 
ON public.farmer_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on farmer_profiles
CREATE TRIGGER update_farmer_profiles_updated_at
BEFORE UPDATE ON public.farmer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();