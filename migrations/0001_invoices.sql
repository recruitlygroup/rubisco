-- IRD-compliant invoicing schema for Cloudflare D1.
--
-- WHY A DATABASE AT ALL: the existing blog admin stores content as markdown
-- files committed to GitHub (functions/_lib/github.js). That pattern is a
-- poor fit for financial records: invoice numbers must be assigned
-- atomically with zero collisions, invoices must be queryable by fiscal
-- year for the Annexure-13 export, and "immutable ledger row" is a much
-- better match for a real transactional store than "mutable file in a
-- mutable git tree". D1 is Cloudflare's native serverless SQLite, deploys
-- alongside Pages Functions with no new vendor, and gives us real
-- transactions + UNIQUE constraints + RETURNING for atomic numbering.
--
-- Apply with:
--   npx wrangler d1 create rubisco-invoices
--   (paste the returned database_id into wrangler.toml)
--   npx wrangler d1 migrations apply rubisco-invoices --local
--   npx wrangler d1 migrations apply rubisco-invoices --remote

CREATE TABLE IF NOT EXISTS invoice_counters (
  fiscal_year   TEXT PRIMARY KEY,   -- e.g. "83-84" (Nepali FY, Shrawan-to-Ashadh)
  last_number   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS invoices (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number        TEXT NOT NULL UNIQUE,        -- AGRI-83-84-0001
  fiscal_year           TEXT NOT NULL,                -- 83-84
  client_name           TEXT NOT NULL,
  client_type           TEXT NOT NULL CHECK (client_type IN ('LOCAL','FOREIGN')),
  client_address        TEXT,
  client_pan_or_tax_id  TEXT,
  client_vat_registered INTEGER NOT NULL DEFAULT 0,   -- local clients only; ignored for FOREIGN
  currency              TEXT NOT NULL,                -- NPR | USD | EUR
  exchange_rate_npr     REAL NOT NULL DEFAULT 1,      -- 1 for NPR invoices
  subtotal              REAL NOT NULL,
  vat_rate              REAL NOT NULL DEFAULT 0,      -- 0.13 or 0
  vat_amount            REAL NOT NULL DEFAULT 0,
  grand_total           REAL NOT NULL,
  subtotal_npr          REAL NOT NULL,                -- converted, for Annexure-13
  vat_amount_npr        REAL NOT NULL,
  grand_total_npr       REAL NOT NULL,
  tax_exempt_reason     TEXT,                         -- e.g. "IT Export Service - Income Tax Act Sec. 11"
  issue_date_ad         TEXT NOT NULL,                -- YYYY-MM-DD
  issue_date_bs         TEXT NOT NULL,                -- YYYY-MM-DD (BS)
  status                TEXT NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED','PAID','VOIDED')),
  notes                 TEXT,
  created_by            TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_invoices_fiscal_year ON invoices(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE TABLE IF NOT EXISTS invoice_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id    INTEGER NOT NULL REFERENCES invoices(id),
  description   TEXT NOT NULL,
  quantity      REAL NOT NULL,
  unit_price    REAL NOT NULL,
  total_price   REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- IRD immutability rule: an issued invoice is never edited or deleted.
-- To correct or cancel one, you issue a credit note against it and flip
-- its status to VOIDED. The invoice row itself never changes.
CREATE TABLE IF NOT EXISTS credit_notes (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  credit_note_number TEXT NOT NULL UNIQUE,            -- CN-AGRI-83-84-0001
  invoice_id        INTEGER NOT NULL REFERENCES invoices(id),
  reason            TEXT NOT NULL,
  refund_amount     REAL NOT NULL,
  currency          TEXT NOT NULL,
  created_by        TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_credit_notes_invoice ON credit_notes(invoice_id);
