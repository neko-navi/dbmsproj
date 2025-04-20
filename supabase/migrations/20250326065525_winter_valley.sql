/*
  # Fix Authentication Users

  1. Changes
    - Drop existing test users
    - Recreate test users with proper Supabase auth configuration
    - Ensure password hashing is compatible with Supabase Auth
*/

-- First, remove existing test users
DELETE FROM auth.users WHERE email IN ('admin@shipme.com', 'customer@shipme.com', 'viewer@shipme.com');
DELETE FROM public.users WHERE email IN ('admin@shipme.com', 'customer@shipme.com', 'viewer@shipme.com');

-- Create admin user
DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    is_super_admin,
    email_change_token_new,
    recovery_token
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@shipme.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'business_name', 'ShipMe Admin'
    ),
    'authenticated',
    'authenticated',
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    false,
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  INSERT INTO public.users (id, business_name, email, role)
  VALUES (
    admin_id,
    'ShipMe Admin',
    'admin@shipme.com',
    'admin'
  );
END $$;

-- Create customer user
DO $$
DECLARE
  customer_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    is_super_admin,
    email_change_token_new,
    recovery_token
  ) VALUES (
    customer_id,
    '00000000-0000-0000-0000-000000000000',
    'customer@shipme.com',
    crypt('customer123', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'business_name', 'Test Business'
    ),
    'authenticated',
    'authenticated',
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    false,
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  INSERT INTO public.users (id, business_name, email, role)
  VALUES (
    customer_id,
    'Test Business',
    'customer@shipme.com',
    'customer'
  );
END $$;

-- Create viewer user
DO $$
DECLARE
  viewer_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    is_super_admin,
    email_change_token_new,
    recovery_token
  ) VALUES (
    viewer_id,
    '00000000-0000-0000-0000-000000000000',
    'viewer@shipme.com',
    crypt('viewer123', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'business_name', 'Viewer Account'
    ),
    'authenticated',
    'authenticated',
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    false,
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  INSERT INTO public.users (id, business_name, email, role)
  VALUES (
    viewer_id,
    'Viewer Account',
    'viewer@shipme.com',
    'viewer'
  );
END $$;