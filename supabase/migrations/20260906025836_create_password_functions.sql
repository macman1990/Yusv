/*
# Create password helper functions

Creates SQL functions for password verification and hashing using pgcrypto.
These are called by the admin-api edge function.
*/

-- Check password against stored hash
CREATE OR REPLACE FUNCTION check_password(input_password text, stored_hash text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT input_password = '' IS NOT TRUE AND stored_hash = crypt(input_password, stored_hash);
$$;

-- Hash a new password
CREATE OR REPLACE FUNCTION hash_password(input_password text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT crypt(input_password, gen_salt('bf'));
$$;

-- Grant execute to service_role (used by edge functions)
GRANT EXECUTE ON FUNCTION check_password(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION hash_password(text) TO service_role;