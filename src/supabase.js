import { createClient } from '@supabase/supabase-js'

// ⚠️  Paste your values from Supabase → Settings → API
const SUPABASE_URL = 'https://apssnmmnhkeutkhhksvk.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwc3NubW1uaGtldXRraGhrc3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjY2NjQsImV4cCI6MjA4OTkwMjY2NH0.paiLvRMy7c60bxMXAQdTy8u3eDa-bXx1tDhnSCXA0AY'

// Admin credentials — stored only here, never shown in UI
export const ADMIN_USER = 'admin'
export const ADMIN_PASS = 'Ronaldo@123'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
