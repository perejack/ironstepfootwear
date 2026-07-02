-- Colourways: multiple photos per shoe, or link separate products as the same style.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS style_key text,
  ADD COLUMN IF NOT EXISTS color_label text;

COMMENT ON COLUMN public.products.variants IS
  'Array of {label, color, image_url} — each entry is one colour with its own photo.';
COMMENT ON COLUMN public.products.style_key IS
  'Shared key for separate product rows that are the same shoe in different colours (e.g. savanna-runner).';
COMMENT ON COLUMN public.products.color_label IS
  'Display name for this row when grouped by style_key (e.g. Orange, Black).';

CREATE INDEX IF NOT EXISTS products_style_key_idx ON public.products (style_key)
  WHERE style_key IS NOT NULL;
