-- Secure function to claim a student record after login
create or replace function public.verify_and_claim_student(p_name text, p_registration_no text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  -- Claim the student row matching provided credentials if not already claimed
  update public.students
  set user_id = auth.uid()
  where user_id is null
    and name = p_name
    and registration_no = p_registration_no;

  get diagnostics updated_count = ROW_COUNT;

  if updated_count = 1 then
    return true;
  else
    return false;
  end if;
end;
$$;

-- Allow authenticated users to execute this function
grant execute on function public.verify_and_claim_student(text, text) to authenticated;