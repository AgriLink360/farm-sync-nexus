-- Drop the triggers first
DROP TRIGGER IF EXISTS update_buyer_profiles_updated_at ON public.buyer_profiles;
DROP TRIGGER IF EXISTS update_logistics_profiles_updated_at ON public.logistics_profiles;

-- Drop and recreate the function with proper security
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER update_buyer_profiles_updated_at
  BEFORE UPDATE ON public.buyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_logistics_profiles_updated_at
  BEFORE UPDATE ON public.logistics_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();