-- Durable automatic viewer onboarding. No browser access to jobs or ciphertext.
begin;
create table if not exists public.portal_displayr_provisioning (
 user_id text primary key,
 email text not null unique,
 credential_ciphertext text not null,
 displayr_user_id text unique check(displayr_user_id ~ '^[1-9][0-9]{0,15}$'),
 stage text not null default 'queued' check(stage in ('queued','invitation_pending','activation_pending','credentials_verified','ready','needs_attention')),
 reason text,
 invite_attempted_at timestamptz,
 activation_attempted_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 next_attempt_at timestamptz not null default now(),
 lease_id uuid,
 lease_until timestamptz
);
alter table public.portal_displayr_provisioning enable row level security;
revoke all on public.portal_displayr_provisioning from public,anon,authenticated;
grant select,insert,update on public.portal_displayr_provisioning to service_role;

create or replace function public.portal_displayr_claim_provisioning(p_user_id text)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 update public.portal_displayr_provisioning set lease_id=gen_random_uuid(),lease_until=now()+interval '5 minutes',updated_at=now()
 where user_id=p_user_id and stage not in ('ready','needs_attention') and next_attempt_at<=now()
 and (lease_until is null or lease_until<=now()) returning lease_id into result;
 return result;
end;$$;

create or replace function public.portal_displayr_advance_provisioning(p_user_id text,p_lease_id uuid,p_expected_stage text,p_stage text,p_reason text default null)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if not (p_stage='needs_attention' or (p_expected_stage='queued' and p_stage in ('invitation_pending','credentials_verified')) or
 (p_expected_stage='invitation_pending' and p_stage='activation_pending') or
 (p_expected_stage='activation_pending' and p_stage='credentials_verified') or
 (p_expected_stage='credentials_verified' and p_stage='ready')) then return false;end if;
 update public.portal_displayr_provisioning set stage=p_stage,reason=p_reason,updated_at=now()
 where user_id=p_user_id and lease_id=p_lease_id and lease_until>now() and stage=p_expected_stage
 and (p_stage not in ('credentials_verified','ready') or displayr_user_id is not null);
 return found;
end;$$;

create or replace function public.portal_displayr_provisioning_permit(p_user_id text,p_lease_id uuid,p_operation text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if p_operation='invite' then
  update public.portal_displayr_provisioning set invite_attempted_at=now(),updated_at=now()
  where user_id=p_user_id and lease_id=p_lease_id and lease_until>now() and stage='invitation_pending' and invite_attempted_at is null;
 elsif p_operation='activate' then
  update public.portal_displayr_provisioning set activation_attempted_at=now(),updated_at=now()
  where user_id=p_user_id and lease_id=p_lease_id and lease_until>now() and stage='activation_pending' and activation_attempted_at is null;
 else return false; end if;
 return found;
end;$$;

create or replace function public.portal_displayr_provisioning_identity(p_user_id text,p_lease_id uuid,p_displayr_user_id text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if p_displayr_user_id !~ '^[1-9][0-9]{0,15}$' then return false;end if;
 update public.portal_displayr_provisioning set displayr_user_id=p_displayr_user_id,updated_at=now()
 where user_id=p_user_id and lease_id=p_lease_id and lease_until>now()
 and (displayr_user_id is null or displayr_user_id=p_displayr_user_id);
 return found;
end;$$;

create or replace function public.portal_displayr_release_provisioning(p_user_id text,p_lease_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.portal_displayr_provisioning set lease_id=null,lease_until=null,next_attempt_at=now()+interval '1 minute',updated_at=now(),
 stage=case when stage not in ('ready','needs_attention') and created_at<now()-interval '1 day' then 'needs_attention' else stage end,
 reason=case when stage not in ('ready','needs_attention') and created_at<now()-interval '1 day' then 'provisioning_timeout' else reason end
 where user_id=p_user_id and lease_id=p_lease_id and lease_until>now();return found;
end;$$;

revoke all on function public.portal_displayr_claim_provisioning(text),public.portal_displayr_advance_provisioning(text,uuid,text,text,text),public.portal_displayr_provisioning_permit(text,uuid,text),public.portal_displayr_provisioning_identity(text,uuid,text),public.portal_displayr_release_provisioning(text,uuid) from public,anon,authenticated;
grant execute on function public.portal_displayr_claim_provisioning(text),public.portal_displayr_advance_provisioning(text,uuid,text,text,text),public.portal_displayr_provisioning_permit(text,uuid,text),public.portal_displayr_provisioning_identity(text,uuid,text),public.portal_displayr_release_provisioning(text,uuid) to service_role;
commit;
