alter table public.portfolio_projects
add column if not exists is_in_development boolean not null default false;

update public.portfolio_projects
set is_in_development = true
where coalesce(is_in_development, false) = false
  and lower(coalesce(duration, '')) like '%still in development%';
