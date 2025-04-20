/*
  # Create Dummy Users and Initial Data

  1. New Data
    - Create admin user
    - Create customer user
    - Create viewer user
    - Add subscriptions for users
*/

-- Create admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  gen_random_uuid(),
  'admin@shipme.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  'authenticated'
);

INSERT INTO public.users (id, business_name, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@shipme.com'),
  'ShipMe Admin',
  'admin@shipme.com',
  'admin'
);

-- Create customer user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  gen_random_uuid(),
  'customer@shipme.com',
  crypt('customer123', gen_salt('bf')),
  now(),
  'authenticated'
);

INSERT INTO public.users (id, business_name, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'customer@shipme.com'),
  'Test Business',
  'customer@shipme.com',
  'customer'
);

-- Create viewer user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  gen_random_uuid(),
  'viewer@shipme.com',
  crypt('viewer123', gen_salt('bf')),
  now(),
  'authenticated'
);

INSERT INTO public.users (id, business_name, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'viewer@shipme.com'),
  'Viewer Account',
  'viewer@shipme.com',
  'viewer'
);

-- Add subscription for customer
INSERT INTO public.subscriptions (user_id, plan_type, status, start_date, end_date)
VALUES (
  (SELECT id FROM public.users WHERE email = 'customer@shipme.com'),
  'Basic',
  'active',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 year'
);