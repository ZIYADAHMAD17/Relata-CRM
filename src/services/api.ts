import { supabase } from '../supabase/client';

// ─── People API ────────────────────────────────────────────────────────────
export const getPeople = async () => {
  const { data, error } = await supabase.from('people').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createPerson = async (person: any) => {
  const { data, error } = await supabase.from('people').insert([person]).select();
  if (error) throw error;
  return data[0];
};
export const getPersonById = async (id: string) => {
  const { data, error } = await supabase.from('people').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
export const updatePerson = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('people').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};
export const deletePerson = async (id: string) => {
  const { error } = await supabase.from('people').delete().eq('id', id);
  if (error) throw error;
};

// ─── Notes API ─────────────────────────────────────────────────────────────
export const getNotesByPersonId = async (personId: string) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('person_id', personId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createNote = async (note: { person_id: string; content: string }) => {
  const { data, error } = await supabase.from('notes').insert([note]).select();
  if (error) throw error;
  return data[0];
};
export const deleteNote = async (id: string) => {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
};

// ─── Organizations API ─────────────────────────────────────────────────────
export const getOrganizations = async () => {
  const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createOrganization = async (org: any) => {
  const { data, error } = await supabase.from('organizations').insert([org]).select();
  if (error) throw error;
  return data[0];
};
export const updateOrganization = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('organizations').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};
export const deleteOrganization = async (id: string) => {
  const { error } = await supabase.from('organizations').delete().eq('id', id);
  if (error) throw error;
};

// ─── Meetings API ──────────────────────────────────────────────────────────
export const getMeetings = async () => {
  const { data, error } = await supabase.from('meetings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createMeeting = async (meeting: any) => {
  const { data, error } = await supabase.from('meetings').insert([meeting]).select();
  if (error) throw error;
  return data[0];
};
export const updateMeeting = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('meetings').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};
export const deleteMeeting = async (id: string) => {
  const { error } = await supabase.from('meetings').delete().eq('id', id);
  if (error) throw error;
};

// ─── Tasks API ─────────────────────────────────────────────────────────────
export const getTasks = async () => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createTask = async (task: any) => {
  const { data, error } = await supabase.from('tasks').insert([task]).select();
  if (error) throw error;
  return data[0];
};
export const updateTask = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};
export const deleteTask = async (id: string) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
};

// ─── Documents API ─────────────────────────────────────────────────────────
export const getDocuments = async () => {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createDocument = async (doc: any) => {
  const { data, error } = await supabase.from('documents').insert([doc]).select();
  if (error) throw error;
  return data[0];
};
export const updateDocument = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('documents').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};
export const deleteDocument = async (id: string) => {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
};

// ─── Invoices API ──────────────────────────────────────────────────────────
export const getInvoices = async () => {
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
export const createInvoice = async (invoice: any) => {
  const { data, error } = await supabase.from('invoices').insert([invoice]).select();
  if (error) throw error;
  return data[0];
};
export const updateInvoice = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('invoices').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};
export const deleteInvoice = async (id: string) => {
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) throw error;
};
