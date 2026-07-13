import { supabase } from '../supabase/client';

// People API
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

// Organizations API
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

// Meetings API
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

// Tasks API
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

// Documents API
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

// Invoices API
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
