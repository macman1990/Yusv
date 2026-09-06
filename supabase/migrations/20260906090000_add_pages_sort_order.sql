ALTER TABLE IF EXISTS pages
  ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_pages_sort ON pages(sort_order);
