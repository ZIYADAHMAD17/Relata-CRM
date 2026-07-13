import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czwwugitanxhbtvwvfka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3d1Z2l0YW54aGJ0dnd2ZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjUyNzUsImV4cCI6MjA5OTE0MTI3NX0.SqTKj3So_-wEo7T9QPjAEFm8NMaU66TXJDjrj_-5Ngw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing connection to Supabase...');
  const { data, error } = await supabase.from('people').select('*').limit(1);
  if (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
  console.log('Successfully connected! People table exists.');
}

check();
