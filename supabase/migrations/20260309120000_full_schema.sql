-- Services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_fr text not null default '',
  name_nl text not null default '',
  name_ar text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  description_nl text not null default '',
  description_ar text not null default '',
  price numeric(10,2) not null default 0,
  duration_minutes integer not null default 60,
  category text not null default 'general',
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  service_id uuid references public.services(id),
  booking_date date not null,
  booking_time time not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  stripe_payment_id text,
  stripe_payment_status text default 'unpaid' check (stripe_payment_status in ('unpaid','paid','refunded')),
  notes text,
  created_at timestamptz not null default now()
);

-- Admin settings (key-value)
create table if not exists public.admin_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Testimonials (admin-manageable)
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  service text not null default '',
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  lang text not null default 'en',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Newsletter subscribers
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  lang text not null default 'en',
  source text not null default 'website',
  created_at timestamptz not null default now()
);

-- Enable RLS on all tables
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_settings enable row level security;
alter table public.testimonials enable row level security;
alter table public.subscribers enable row level security;

-- Public read policies
create policy "Services are publicly readable" on public.services
  for select using (true);

create policy "Active testimonials are publicly readable" on public.testimonials
  for select using (active = true);

-- Anon can insert bookings
create policy "Anyone can create bookings" on public.bookings
  for insert with check (true);

-- Anon can insert subscribers
create policy "Anyone can subscribe" on public.subscribers
  for insert with check (true);

-- Authenticated (admin) full access
create policy "Admin full access to services" on public.services
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to bookings" on public.bookings
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to admin_settings" on public.admin_settings
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to testimonials" on public.testimonials
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to subscribers" on public.subscribers
  for all using (auth.role() = 'authenticated');

-- Seed services
insert into public.services (name_en, name_fr, name_nl, name_ar, description_en, description_fr, description_nl, description_ar, price, duration_minutes, category, sort_order) values
(
  'Classic Facial Treatment',
  'Soin du Visage Classique',
  'Klassieke Gezichtsbehandeling',
  'علاج الوجه الكلاسيكي',
  'Rejuvenating facial tailored to your skin''s unique needs, using premium products for lasting radiance.',
  'Soin du visage rajeunissant adapté aux besoins uniques de votre peau, utilisant des produits premium.',
  'Verjongende gezichtsbehandeling afgestemd op de unieke behoeften van je huid.',
  'علاج وجه مجدد مصمم خصيصاً لاحتياجات بشرتك الفريدة.',
  75.00, 60, 'facial', 1
),
(
  'Deep Cleansing Facial',
  'Nettoyage en Profondeur',
  'Diepe Reiniging Gezicht',
  'تنظيف عميق للوجه',
  'Deep pore cleansing with extraction and purifying mask for clear, refreshed skin.',
  'Nettoyage en profondeur des pores avec extraction et masque purifiant.',
  'Diepe poriereiniging met extractie en zuiverend masker.',
  'تنظيف عميق للمسام مع استخراج وقناع منقي للبشرة.',
  95.00, 75, 'facial', 2
),
(
  'Full Body Laser Epilation',
  'Épilation Laser Corps Complet',
  'Volledige Lichaam Laserontharing',
  'إزالة شعر الجسم بالكامل بالليزر',
  'Complete body laser hair removal session with advanced diode technology.',
  'Séance d''épilation laser corps complet avec technologie diode avancée.',
  'Volledige lichaam laserontharing met geavanceerde diodetechnologie.',
  'جلسة إزالة شعر الجسم بالكامل بالليزر بتقنية الديود المتقدمة.',
  250.00, 120, 'epilation', 3
),
(
  'Bikini Laser Epilation',
  'Épilation Laser Bikini',
  'Bikini Laserontharing',
  'إزالة شعر البيكيني بالليزر',
  'Precise bikini area laser treatment for smooth, lasting results.',
  'Traitement laser précis de la zone bikini pour des résultats lisses et durables.',
  'Precieze bikini laserontharing voor gladde, langdurige resultaten.',
  'علاج ليزر دقيق لمنطقة البيكيني لنتائج ناعمة ودائمة.',
  80.00, 30, 'epilation', 4
),
(
  'Classic Lash Extensions',
  'Extensions de Cils Classiques',
  'Klassieke Wimperextensions',
  'تركيب رموش كلاسيكي',
  'Natural-looking individual lash extensions for everyday elegance.',
  'Extensions de cils individuelles d''aspect naturel pour une élégance quotidienne.',
  'Natuurlijk ogende individuele wimperextensions voor dagelijkse elegantie.',
  'تركيب رموش فردية بمظهر طبيعي للأناقة اليومية.',
  120.00, 90, 'eyelash', 5
),
(
  'Volume Lash Extensions',
  'Extensions de Cils Volume',
  'Volume Wimperextensions',
  'تركيب رموش كثيفة',
  'Dramatic volume lash sets for a glamorous, full look.',
  'Ensembles de cils volume dramatique pour un look glamour et complet.',
  'Dramatische volume wimpersets voor een glamoureuze, volle look.',
  'مجموعات رموش كثيفة لمظهر ساحر وممتلئ.',
  160.00, 120, 'eyelash', 6
),
(
  'Premium Skincare Consultation',
  'Consultation Soin Premium',
  'Premium Huidverzorgingsconsultatie',
  'استشارة عناية بالبشرة فاخرة',
  'Personalized skincare analysis and product recommendations by our experts.',
  'Analyse de peau personnalisée et recommandations de produits par nos experts.',
  'Gepersonaliseerde huidanalyse en productaanbevelingen door onze experts.',
  'تحليل بشرة شخصي وتوصيات منتجات من خبرائنا.',
  50.00, 45, 'skincare', 7
);

-- Seed default admin settings
insert into public.admin_settings (key, value) values
  ('salonkee_url', 'https://salonkee.be'),
  ('business_phone', '0469244955'),
  ('business_address', 'Rue d''Arlon 25, Ixelles'),
  ('business_email', 'hello@zehra-glam.com'),
  ('opening_hours', 'Mon-Sat: 9:00-20:00');

-- Seed testimonials
insert into public.testimonials (name, text, service, rating, lang) values
  ('Sophie Martin', 'The facial treatment was absolutely divine. My skin has never looked better. The attention to detail is unmatched.', 'Facial Treatment', 5, 'en'),
  ('Claire Dubois', 'After years of shaving, the laser epilation has been life-changing. Professional, painless, and incredibly effective.', 'Laser Epilation', 5, 'en'),
  ('Isabelle Moreau', 'My lash extensions look so natural and beautiful. I wake up feeling confident every single day. Highly recommend!', 'Eyelash Extensions', 5, 'en');
