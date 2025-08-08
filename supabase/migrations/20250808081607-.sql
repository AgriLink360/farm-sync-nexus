-- Ensure profiles table has required data and robust triggers

-- 1) Ensure email column exists on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- 2) Backfill email for existing profiles from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id
  AND (p.email IS NULL OR p.email <> u.email);

-- 3) Insert missing profile rows for existing auth users
INSERT INTO public.profiles (user_id, email, full_name, portal_type, created_at, updated_at)
SELECT u.id,
       u.email,
       u.raw_user_meta_data ->> 'full_name',
       u.raw_user_meta_data ->> 'portal_type',
       now(),
       now()
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- 4) Data integrity indexes
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_uidx ON public.profiles(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_uidx ON public.profiles(email);

-- 5) Create/refresh function to handle new auth users into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, portal_type, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'portal_type',
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    portal_type = COALESCE(EXCLUDED.portal_type, public.profiles.portal_type),
    updated_at = now();
  RETURN NEW;
END;
$function$;

-- 6) Ensure trigger exists on auth.users for profile sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- 7) Keep profiles.updated_at in sync
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();