import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czwwugitanxhbtvwvfka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3d1Z2l0YW54aGJ0dnd2ZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjUyNzUsImV4cCI6MjA5OTE0MTI3NX0.SqTKj3So_-wEo7T9QPjAEFm8NMaU66TXJDjrj_-5Ngw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertFull() {
  console.log('Testing full person insert...');
  const testPerson = {
    name: 'Debug Test',
    email: `debug_${Date.now()}@test.com`,
    role: 'HR',
    company: 'Codetchit',
    score: 75,
    status: 'Good',
    avatar: `https://i.pravatar.cc/150?u=debug`,
  };
  
  const { data, error } = await supabase.from('people').insert([testPerson]).select();
  
  if (error) {
    console.error('INSERT ERROR:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
    console.error('Code:', error.code);
  } else {
    console.log('Insert success! ID:', data[0]?.id);
    // Clean up
    await supabase.from('people').delete().eq('id', data[0].id);
    console.log('Cleaned up test record.');
  }
}

testInsertFull();
