-- Create the table
create table questions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  text text, -- 'question' in JS object, mapped manually or renamed here. Let's keep JS 'question' -> DB 'question' for simplicity.
  question text not null,
  tags text[] default '{}',
  answers jsonb not null
);

-- Set up Row Level Security (RLS)
-- For this prototype, we enable public read/write. 
-- IN PRODUCTION: You would lock this down to only Authenticated Admins for write.

alter table questions enable row level security;

create policy "Public Access"
on questions
for all
using (true)
with check (true);
