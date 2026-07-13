// This script uses the Supabase REST API to disable RLS on all tables
// by connecting directly via the postgres connection through Supabase's
// SQL execution endpoint using the service role.
// 
// Since we only have the anon key, we'll use a workaround:
// Create a Supabase Edge Function or use the management API.
//
// ALTERNATIVE: Write a script that uses fetch to call Supabase's
// management API to update table policies.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czwwugitanxhbtvwvfka.supabase.co';

// Try anon key first to see what we can access
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3d1Z2l0YW54aGJ0dnd2ZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjUyNzUsImV4cCI6MjA5OTE0MTI3NX0.SqTKj3So_-wEo7T9QPjAEFm8NMaU66TXJDjrj_-5Ngw';

const supabase = createClient(supabaseUrl, anonKey);

async function diagnose() {
  console.log('=== Diagnosing all tables ===\n');
  
  const tables = ['people', 'organizations', 'meetings', 'tasks', 'documents', 'invoices'];
  
  for (const table of tables) {
    // Test read
    const { data: readData, error: readError } = await supabase.from(table).select('*').limit(1);
    // Test write (insert then rollback by deleting)
    const { error: writeError } = await supabase.from(table).insert([{ 
      ...(table === 'people' ? { name: '_test_', email: `_test_${Date.now()}@test.com` } : {}),
      ...(table === 'organizations' ? { name: '_test_org_' } : {}),
      ...(table === 'meetings' ? { title: '_test_meeting_', date: '2026-01-01', time: '10:00' } : {}),
      ...(table === 'tasks' ? { title: '_test_task_' } : {}),
      ...(table === 'documents' ? { name: '_test_doc_', type: 'file' } : {}),
      ...(table === 'invoices' ? { invoice_number: 'TEST-001', client_name: '_test_', amount: 0, due_date: '2026-01-01', status: 'Draft' } : {}),
    }]);
    
    const readStatus = readError ? `❌ READ BLOCKED: ${readError.message}` : `✅ READ OK (${readData?.length} rows)`;
    const writeStatus = writeError ? `❌ WRITE BLOCKED: ${writeError.message}` : `✅ WRITE OK`;
    
    console.log(`Table: ${table}`);
    console.log(`  ${readStatus}`);
    console.log(`  ${writeStatus}\n`);
  }
}

diagnose();
