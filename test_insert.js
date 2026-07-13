import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czwwugitanxhbtvwvfka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3d1Z2l0YW54aGJ0dnd2ZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjUyNzUsImV4cCI6MjA5OTE0MTI3NX0.SqTKj3So_-wEo7T9QPjAEFm8NMaU66TXJDjrj_-5Ngw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing insert...');
  const { data, error } = await supabase.from('people').insert([{
    name: 'Test Name',
    email: 'test' + Date.now() + '@example.com',
    role: 'Admin',
    company: 'Test Co'
  }]);
  
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert success:', data);
  }
}

testInsert();
