/**
 * scripts/apply-migration.ts
 * Applies the initial schema migration to Supabase via the REST SQL API.
 * Uses the service role key which has admin privileges.
 *
 * Usage: npx tsx scripts/apply-migration.ts
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is not set in .env')
  process.exit(1)
}

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env')
  process.exit(1)
}

const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
const sql = readFileSync(migrationPath, 'utf-8')

async function main() {
  console.log('Applying migration: 001_initial_schema.sql')

  const response = await fetch(`${url}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!response.ok) {
    // Try the SQL endpoint directly
    const sqlResponse = await fetch(`${url}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey!,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ query: sql }),
    })

    const text = await sqlResponse.text()
    console.log('Response:', text)

    if (!sqlResponse.ok) {
      console.error('Migration failed. Apply the SQL manually in Supabase SQL Editor.')
      console.error('File:', migrationPath)
      process.exit(1)
    }
  }

  console.log('Migration applied successfully.')
  process.exit(0)
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
