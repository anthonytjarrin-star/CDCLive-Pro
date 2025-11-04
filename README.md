
# CDCLive — Pro (Bloomberg×NYT UI • Live Feeds • Formulate • Followers • Stripe)

What’s in:
- Modern front page with cards, dark/light, Most Read, Editor Settings.
- Live headlines via multiple RSS feeds (BBC, Guardian, NPR, Reuters World, Al Jazeera, AP if reachable).
- Country stats from World Bank; ISO2 mapping via REST Countries.
- Wikipedia extract for geographic/historic context.
- "Formulate" endpoint for angles, questions, comments (deterministic, no key).
- Followers (Supabase) list & CSV export.
- Stripe Checkout buttons ($5/mo, $30/yr) + webhook writing to Supabase.
- Ownership footer for Cecilia Drouet Contreras & Anthony Jarrin.
- PWA manifest.

## Deploy (Vercel)
1) Upload this folder/zip as a Vercel project.
2) Set env vars:
   NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
   NEXT_PUBLIC_PRICE_MONTHLY_ID = price_xxx
   NEXT_PUBLIC_PRICE_YEARLY_ID = price_xxx
   STRIPE_SECRET_KEY = sk_live_...
   STRIPE_WEBHOOK_SECRET = whsec_...
   SUPABASE_URL = https://xxxx.supabase.co
   SUPABASE_ANON_KEY = your anon key
   SUPABASE_SERVICE_ROLE = your service role key

## Supabase SQL
```sql
create table if not exists followers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now(),
  place text
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  stripe_customer_id text,
  stripe_subscription_id text,
  email text,
  price_id text,
  status text,
  created_at timestamptz default now()
);
```
