-- 1. Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- First signed-up user becomes admin (one-time bootstrap)
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

-- 2. updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT '',
  price integer NOT NULL,
  original_price integer,
  rating numeric(2,1) NOT NULL DEFAULT 4.8,
  reviews integer NOT NULL DEFAULT 0,
  badge text,
  image_url text,
  swatch text,
  colors text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  sizes integer[] NOT NULL DEFAULT '{}',
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Site settings (hero text, images, WhatsApp links, etc.)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete settings" ON public.site_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Storage policies: admins manage images in the site-images bucket
CREATE POLICY "Admins can upload site images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read site images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- 7. Seed categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Official', 'official', 1),
  ('Smart Casuals', 'smart-casuals', 2),
  ('Sneakers', 'sneakers', 3);

-- 8. Seed products (images fall back to the current built-in photos until replaced in admin)
INSERT INTO public.products (slug, name, tagline, description, category_id, type, price, original_price, rating, reviews, badge, swatch, colors, features, sizes, is_new_arrival, sort_order) VALUES
  ('savanna-runner', 'Savanna Runner', 'Engineered for the Nairobi commute',
   'A featherweight runner engineered for Nairobi pavements and weekend trails. Knit upper, foam midsole, breathable from morning matatu to evening jog.',
   (SELECT id FROM public.categories WHERE slug = 'sneakers'), 'Trainer', 6800, 8200, 4.8, 214, 'BESTSELLER',
   'oklch(0.85 0.10 75)', ARRAY['#e25822','#1a1a1a'],
   ARRAY['Breathable engineered knit','Cushioned EVA midsole','Rubber outsole grip','Recycled laces'],
   ARRAY[39,40,41,42,43,44,45], true, 1),
  ('kibera-court', 'Kibera Court', 'The everyday canvas classic',
   'Heritage canvas court shoe. A daily classic, hand-finished with a vulcanised rubber sole that softens beautifully with wear.',
   (SELECT id FROM public.categories WHERE slug = 'smart-casuals'), 'Court Shoe', 4500, NULL, 4.7, 96, 'NEW',
   'oklch(0.92 0.03 80)', ARRAY['#efe6d3','#1a1a1a'],
   ARRAY['12oz cotton canvas','Vulcanised rubber sole','Cotton terry lining','Removable insole'],
   ARRAY[38,39,40,41,42,43,44], true, 2),
  ('mara-glide', 'Mara Glide', 'Soft as sand, built to move',
   'Soft-as-sand runner with a sculpted heel cradle. Built for long walks, late commutes and quiet Sundays.',
   (SELECT id FROM public.categories WHERE slug = 'sneakers'), 'Runner', 7400, NULL, 4.9, 178, NULL,
   'oklch(0.88 0.05 75)', ARRAY['#f5e7d0','#cfd8c7'],
   ARRAY['Sock-fit collar','Energy-return foam','Recycled mesh upper','Reflective heel tab'],
   ARRAY[36,37,38,39,40,41], false, 3),
  ('rift-chelsea', 'Heritage Chelsea', 'Timeless leather, built to last',
   'Hand-finished full-grain leather Chelsea boot with a chunky lugged sole for grip in every season.',
   (SELECT id FROM public.categories WHERE slug = 'official'), 'Chelsea Boot', 9800, NULL, 4.9, 132, 'BESTSELLER',
   'oklch(0.75 0.09 70)', ARRAY['#1a1a1a','#5b3a23'],
   ARRAY['Full-grain leather','Elastic side panels','Goodyear welted','Lugged rubber sole'],
   ARRAY[40,41,42,43,44,45], false, 4),
  ('nairobi-derby', 'Nairobi Derby', 'Boardroom polish, all-day comfort',
   'A clean, modern derby. Hand-polished calfskin over a soft leather lining — boardroom by morning, dinner by night.',
   (SELECT id FROM public.categories WHERE slug = 'official'), 'Derby', 9800, NULL, 4.8, 87, NULL,
   'oklch(0.45 0.05 40)', ARRAY['#1a1a1a','#5b3a23'],
   ARRAY['Polished calfskin','Blake-stitched','Leather insole','Cushioned heel'],
   ARRAY[40,41,42,43,44,45], false, 5),
  ('iron-step-icon', 'Iron Step Icon', 'The shoe that started the studio',
   'The shoe that started the studio. Burgundy aniline leather, a tonal sole, and a silhouette refined over twelve prototypes.',
   (SELECT id FROM public.categories WHERE slug = 'smart-casuals'), 'Premium Sneaker', 11200, NULL, 5.0, 64, 'LIMITED',
   'oklch(0.55 0.14 25)', ARRAY['#5a1a2a','#1a1a1a'],
   ARRAY['Aniline-dyed leather','Memory-foam footbed','Numbered batch','Hand-stitched welt'],
   ARRAY[39,40,41,42,43,44,45], false, 6);

-- 9. Seed site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_headline', 'One wardrobe. Every occasion.'),
  ('hero_subtext', 'Sneakers that go beyond the gym. Casuals that outlast the weekend. Smart casuals that mean business without trying too hard. Whatever the day calls for, Iron Step has the shoe for it.'),
  ('hero_image_url', ''),
  ('whatsapp_number', '+254795704273'),
  ('whatsapp_group_url', ''),
  ('announcement', 'Free delivery in Nairobi on orders above KES 5,000');