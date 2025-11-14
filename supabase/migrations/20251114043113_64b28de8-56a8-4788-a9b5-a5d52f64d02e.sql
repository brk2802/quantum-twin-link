-- Update the verify_and_claim_student function to allow login for already-claimed students
create or replace function public.verify_and_claim_student(p_name text, p_registration_no text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  student_record record;
begin
  -- Find the student with matching credentials
  select * into student_record
  from public.students
  where name = p_name
    and registration_no = p_registration_no
  limit 1;

  -- If no student found, return false
  if not found then
    return false;
  end if;

  -- If student already claimed by this user, allow login
  if student_record.user_id = auth.uid() then
    return true;
  end if;

  -- If student not claimed yet, claim it
  if student_record.user_id is null then
    update public.students
    set user_id = auth.uid()
    where id = student_record.id;
    return true;
  end if;

  -- Student claimed by another user
  return false;
end;
$$;