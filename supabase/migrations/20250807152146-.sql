-- Create farmer_profiles table
CREATE TABLE public.farmer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Basic Information
  full_name TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  
  -- Location
  region TEXT NOT NULL,
  district TEXT,
  state TEXT,
  
  -- Farm Details
  experience_years INTEGER,
  farm_size_acres DECIMAL(10,2),
  primary_crops TEXT[] NOT NULL DEFAULT '{}',
  secondary_crops TEXT[] NOT NULL DEFAULT '{}',
  farming_methods TEXT[] NOT NULL DEFAULT '{}',
  irrigation_type TEXT,
  soil_type TEXT,
  
  -- Equipment & Capacity
  equipment_owned TEXT[] NOT NULL DEFAULT '{}',
  storage_capacity_tons DECIMAL(10,2),
  annual_production_tons DECIMAL(10,2),
  
  -- Certifications & Market
  certifications TEXT[] NOT NULL DEFAULT '{}',
  preferred_market_channels TEXT[] NOT NULL DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for farmer_profiles
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

CREATE POLICY "Users can delete their own farmer profile" 
ON public.farmer_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_farmer_profiles_updated_at
BEFORE UPDATE ON public.farmer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();