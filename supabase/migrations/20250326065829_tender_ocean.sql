/*
  # Create Test Users Migration

  1. Changes
    - Create necessary tables and types
    - Create test users with proper auth configuration
    - Add subscription for customer user
*/

-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'customer', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY,
  business_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  plan_type text NOT NULL,
  status text DEFAULT 'active',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- First, remove existing test users if they exist
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

-- Add subscription for customer
INSERT INTO public.subscriptions (user_id, plan_type, status, start_date, end_date)
SELECT 
  id as user_id,
  'Basic' as plan_type,
  'active' as status,
  CURRENT_DATE as start_date,
  CURRENT_DATE + INTERVAL '1 year' as end_date
FROM public.users 
WHERE email = 'customer@shipme.com';