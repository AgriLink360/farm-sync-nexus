-- Create buyer_profiles table
CREATE TABLE public.buyer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  buyer_type TEXT NOT NULL CHECK (buyer_type IN ('individual', 'company')),
  contact_person_name TEXT NOT NULL,
  phone_primary TEXT NOT NULL,
  phone_secondary TEXT,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  location TEXT NOT NULL,
  buying_interests TEXT[] NOT NULL DEFAULT '{}',
  gst_number TEXT,
  business_registration_no TEXT,
  company_type TEXT CHECK (company_type IN ('small', 'medium', 'large')),
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create logistics_profiles table
CREATE TABLE public.logistics_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone_primary TEXT NOT NULL,
  phone_secondary TEXT,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  location TEXT NOT NULL,
  fleet_details JSONB NOT NULL DEFAULT '{"vehicle_types": [], "capacities": []}',
  operating_hours TEXT NOT NULL,
  business_registration_licence TEXT NOT NULL,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for buyer_profiles
CREATE POLICY "Users can view their own buyer profile" 
ON public.buyer_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own buyer profile" 
ON public.buyer_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile" 
ON public.buyer_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own buyer profile" 
ON public.buyer_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for logistics_profiles
CREATE POLICY "Users can view their own logistics profile" 
ON public.logistics_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own logistics profile" 
ON public.logistics_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logistics profile" 
ON public.logistics_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logistics profile" 
ON public.logistics_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_buyer_profiles_updated_at
  BEFORE UPDATE ON public.buyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_logistics_profiles_updated_at
  BEFORE UPDATE ON public.logistics_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();