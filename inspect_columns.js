import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czwwugitanxhbtvwvfka.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3d1Z2l0YW54aGJ0dnd2ZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjUyNzUsImV4cCI6MjA5OTE0MTI3NX0.SqTKj3So_-wEo7T9QPjAEFm8NMaU66TXJDjrj_-5Ngw';
const supabase = createClient(supabaseUrl, anonKey);

async function inspectColumns() {
  console.log('=== Inspecting actual table columns ===\n');
  
  const tables = ['people', 'organizations', 'meetings', 'tasks', 'documents', 'invoices'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`${table}: ERROR - ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`${table} columns:`, Object.keys(data[0]).join(', '));
    } else {
      // Insert a minimal record to get columns back
      console.log(`${table}: no rows, inserting test...`);
    }
    console.log('');
  }
}

inspectColumns();
