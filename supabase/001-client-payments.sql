begin;
create table public.admins(user_id uuid primary key references auth.users(id) on delete cascade);
create table public.enquiries(id uuid primary key default gen_random_uuid(),name text not null,business text not null,phone text not null,email text not null,service text not null,message text not null,created_at timestamptz not null default now());
create table public.invoices(id uuid primary key default gen_random_uuid(),enquiry_id uuid not null references public.enquiries(id),description text not null,amount bigint not null check(amount between 100 and 100000000),status text not null default 'draft' check(status in ('draft','creating','due','paid')),token_hash text not null unique,bill_id text unique,bill_url text,creation_lock text,paid_at timestamptz,created_at timestamptz not null default now());
create table public.enquiry_limits(bucket text primary key,window_start timestamptz not null default now(),count int not null default 1);
alter table public.admins enable row level security;
alter table public.enquiries enable row level security;
alter table public.invoices enable row level security;
alter table public.enquiry_limits enable row level security;
revoke all on public.admins,public.enquiries,public.invoices,public.enquiry_limits from anon,authenticated;
grant all on public.admins,public.enquiries,public.invoices,public.enquiry_limits to service_role;
create index enquiries_created_at_idx on public.enquiries(created_at desc);
create index invoices_created_at_idx on public.invoices(created_at desc);
create index invoices_enquiry_id_idx on public.invoices(enquiry_id);
create index enquiry_limits_window_start_idx on public.enquiry_limits(window_start);
create function public.accept_enquiry(payload jsonb,bucket text) returns boolean language plpgsql security invoker set search_path='' as $$
declare attempts int;
begin
 insert into public.enquiry_limits as limits(bucket) values(accept_enquiry.bucket) on conflict on constraint enquiry_limits_pkey do update set count=case when limits.window_start < now()-interval '1 hour' then 1 else limits.count+1 end,window_start=case when limits.window_start < now()-interval '1 hour' then now() else limits.window_start end returning count into attempts;
 if attempts>5 then return false;end if;
 insert into public.enquiries(name,business,phone,email,service,message) values(payload->>'name',payload->>'business',payload->>'phone',payload->>'email',payload->>'service',payload->>'message');
 delete from public.enquiry_limits where window_start<now()-interval '2 days';
 return true;
end $$;
revoke all on function public.accept_enquiry(jsonb,text) from public,anon,authenticated;
grant execute on function public.accept_enquiry(jsonb,text) to service_role;
commit;

