-- Example: How to create an admin user
-- After a user signs up normally, run this to make them admin:

-- Replace 'admin@example.com' with the actual admin email
update auth.users
set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
where email = 'admin@example.com';

-- Note: This is an example script. You'll need to replace the email with
-- your actual admin email address after they create an account.
