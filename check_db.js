import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czwwugitanxhbtvwvfka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3d1Z2l0YW54aGJ0dnd2ZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjUyNzUsImV4cCI6MjA5OTE0MTI3NX0.SqTKj3So_-wEo7T9QPjAEFm8NMaU66TXJDjrj_-5Ngw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing column existence...');
  const { data, error } = await supabase.from('people').select('id, name, phone, location, tags, website, linkedin, birthday').limit(1);
  if (error) {
    console.log('Error querying columns:', error.message);
  } else {
    console.log('Columns exist! Data:', data);
  }
}

check();
