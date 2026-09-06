import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const schemaPath = path.join(process.cwd(), 'supabase/migrations/20260906025502_create_portfolio_schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const pagesBlock = sql.slice(sql.indexOf('CREATE TABLE IF NOT EXISTS pages'), sql.indexOf('-- ============ MEDIA ============'));

test('pages table includes sort_order for ordering and dashboard CRUD', () => {
  assert.match(pagesBlock, /sort_order\s+int\s+NOT\s+NULL\s+DEFAULT\s+0/);
});
