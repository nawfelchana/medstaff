-- MedStaff Web PWA starter schema (V1)
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient','pro_pending','pro_verified','admin')),
  full_name text,
  city text,
  specialty text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles: read own"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "Profiles: insert own"
on public.profiles for insert to authenticated
with check (id = auth.uid());

create policy "Profiles: update own"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create table if not exists public.professional_verification (
  id uuid primary key default uuid_generate_v4(),
  pro_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  document_url text,
  created_at timestamptz not null default now()
);
alter table public.professional_verification enable row level security;

create policy "Verification: pro read own"
on public.professional_verification for select to authenticated
using (pro_id = auth.uid());

create policy "Verification: pro create own"
on public.professional_verification for insert to authenticated
with check (pro_id = auth.uid());

create table if not exists public.patient_medical_record (
  patient_id uuid primary key references auth.users(id) on delete cascade,
  allergies text,
  history text,
  treatments text,
  updated_at timestamptz not null default now()
);
alter table public.patient_medical_record enable row level security;

create policy "Record: patient read own"
on public.patient_medical_record for select to authenticated
using (patient_id = auth.uid());

create policy "Record: patient insert own"
on public.patient_medical_record for insert to authenticated
with check (patient_id = auth.uid());

create policy "Record: patient update own"
on public.patient_medical_record for update to authenticated
using (patient_id = auth.uid())
with check (patient_id = auth.uid());

create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  pro_id uuid not null references auth.users(id) on delete cascade,
  start_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','done','canceled')),
  created_at timestamptz not null default now()
);
create index if not exists idx_appointments_patient on public.appointments(patient_id, start_at);
create index if not exists idx_appointments_pro on public.appointments(pro_id, start_at);
alter table public.appointments enable row level security;

create policy "Appt: patient read"
on public.appointments for select to authenticated
using (patient_id = auth.uid());

create policy "Appt: pro read"
on public.appointments for select to authenticated
using (pro_id = auth.uid());

create policy "Appt: pro create"
on public.appointments for insert to authenticated
with check (pro_id = auth.uid());

create table if not exists public.qr_share_tokens (
  token uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  pro_id uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_tokens_patient on public.qr_share_tokens(patient_id, expires_at);
alter table public.qr_share_tokens enable row level security;

create policy "Token: patient read own"
on public.qr_share_tokens for select to authenticated
using (patient_id = auth.uid());

create policy "Token: patient create own"
on public.qr_share_tokens for insert to authenticated
with check (patient_id = auth.uid());

create policy "Token: patient revoke own"
on public.qr_share_tokens for update to authenticated
using (patient_id = auth.uid())
with check (patient_id = auth.uid());

create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references auth.users(id) on delete cascade,
  visibility text not null default 'public' check (visibility in ('public','premium_only','pro_only')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_posts_created on public.posts(created_at desc);
alter table public.posts enable row level security;

create policy "Posts: read public"
on public.posts for select to authenticated
using (visibility = 'public');

create policy "Posts: author insert"
on public.posts for insert to authenticated
with check (author_id = auth.uid());

create policy "Posts: author update"
on public.posts for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "Posts: author delete"
on public.posts for delete to authenticated
using (author_id = auth.uid());
