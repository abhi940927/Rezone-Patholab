import { useSyncExternalStore } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DEMO_PATIENT_REPORT } from '../data/mockData';
import { PatientReportData } from '../types';

export type Role = 'patient' | 'collector' | 'doctor';
export type Status = 'booked' | 'collected' | 'approved';
export interface User { id: string; name: string; email: string; phone: string; role: Role }
export interface Booking {
  id: string; specimenId: string; userId: string; patientName: string; age: string;
  gender: 'Male' | 'Female' | 'Other'; mobile: string; packageName: string; totalPrice: number;
  address: string; pincode: string; latitude?: number; longitude?: number;
  createdAt: string; status: Status; collectedAt?: string; approvedAt?: string;
  values?: Record<string, string>; remarks?: string;
}
interface DB { recovery: boolean; ready: boolean; user: User | null; users: User[]; bookings: Booking[] }

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const isConfigured = !!(url && anon);
const sb: SupabaseClient | null = isConfigured ? createClient(url!, anon!) : null;

let state: DB = { recovery: false, ready: false, user: null, users: [], bookings: [] };
const listeners = new Set<() => void>();
const set = (p: Partial<DB>) => { state = { ...state, ...p }; listeners.forEach(l => l()); };
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const useDB = () => useSyncExternalStore(subscribe, () => state);
export const currentUser = (db: DB) => db.user;
export const normPhone = (p: string) => p.replace(/\D/g, '').slice(-10);

const mapUser = (r: any): User => ({ id: r.id, name: r.name, email: r.email || '', phone: r.phone, role: r.role });
const mapBooking = (r: any): Booking => ({
  id: r.id, specimenId: r.specimen_id, userId: r.user_id, patientName: r.patient_name, age: r.age || '',
  gender: r.gender, mobile: r.mobile || '', packageName: r.package_name, totalPrice: Number(r.total_price),
  address: r.address || '', pincode: r.pincode || '', latitude: r.latitude ?? undefined, longitude: r.longitude ?? undefined,
  createdAt: r.created_at, status: r.status, collectedAt: r.collected_at || undefined,
  approvedAt: r.approved_at || undefined, values: r.result_values || undefined, remarks: r.remarks || undefined
});

const refresh = async () => {
  if (!sb) return set({ ready: true });
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return set({ ready: true, user: null, users: [], bookings: [] });
  const { data: profs } = await sb.from('profiles').select('*');
  const { data: bk } = await sb.from('bookings').select('*').order('created_at', { ascending: true });
  const users = (profs || []).map(mapUser);
  set({ ready: true, user: users.find(u => u.id === session.user.id) || null, users, bookings: (bk || []).map(mapBooking) });
};

if (sb) {
  refresh();
  sb.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') set({ recovery: true }); setTimeout(refresh, 0); });
  sb.channel('rezone-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => refresh())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => refresh())
    .subscribe();
} else {
  set({ ready: true });
}

export type Res = { ok: true } | { ok: false; error: string };
const fail = (error: string): Res => ({ ok: false, error });
const NOT_CONFIGURED = 'Database is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart.';

export const register = async (d: { name: string; email: string; phone: string; password: string }): Promise<Res> => {
  const phone = normPhone(d.phone); const email = d.email.trim().toLowerCase();
  if (d.name.trim().length < 2) return fail('Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail('Enter a valid email address.');
  if (!/^[6-9]\d{9}$/.test(phone)) return fail('Enter a valid 10-digit Indian mobile number.');
  if (d.password.length < 6) return fail('Password must be at least 6 characters.');
  if (!sb) return fail(NOT_CONFIGURED);
  const { data, error } = await sb.auth.signUp({ email, password: d.password, options: { data: { name: d.name.trim(), phone } } });
  if (error) return fail(/already|registered|database error/i.test(error.message) ? 'This phone number or email is already registered.' : error.message);
  if (!data.session) return fail('Account created. Please confirm the link sent to your email, then log in.');
  await refresh();
  return { ok: true };
};
export const login = async (phone: string, password: string, kind: Role = 'patient'): Promise<Res> => {
  if (!sb) return fail(NOT_CONFIGURED);
  const { data: email } = await sb.rpc('login_email', { p_phone: phone });
  if (!email) return fail('Incorrect phone number or password.');
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return fail('Incorrect phone number or password.');
  await refresh();
  if (state.user?.role !== kind) {
    await sb.auth.signOut(); set({ user: null, users: [], bookings: [] });
    return fail(kind === 'patient' ? 'Incorrect phone number or password.' : `This portal is for authorized ${kind}s only.`);
  }
  return { ok: true };
};
export const logout = async () => { await sb?.auth.signOut(); set({ user: null, users: [], bookings: [] }); };

export const sendResetLink = async (phone: string): Promise<Res> => {
  if (!sb) return fail(NOT_CONFIGURED);
  const { data: email } = await sb.rpc('login_email', { p_phone: phone });
  if (!email) return fail('This phone number is not registered.');
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  return error ? fail(error.message) : { ok: true };
};
export const setNewPassword = async (password: string): Promise<Res> => {
  if (!sb) return fail(NOT_CONFIGURED);
  if (password.length < 6) return fail('Password must be at least 6 characters.');
  const { error } = await sb.auth.updateUser({ password });
  if (error) return fail(error.message);
  set({ recovery: false });
  await logout();
  return { ok: true };
};
export const cancelRecovery = async () => { set({ recovery: false }); await logout(); };

type BookRes = { ok: true; booking: Booking } | { ok: false; error: string };
export const createBooking = async (d: Omit<Booking, 'id' | 'specimenId' | 'createdAt' | 'status'>): Promise<BookRes> => {
  if (!sb) return { ok: false, error: NOT_CONFIGURED };
  const n = Math.floor(100000 + Math.random() * 900000);
  const { data, error } = await sb.from('bookings').insert({
    id: `RZ-BK-${n}`, specimen_id: `RZ-SP-${n}`, user_id: d.userId, patient_name: d.patientName, age: d.age,
    gender: d.gender, mobile: d.mobile, package_name: d.packageName, total_price: d.totalPrice,
    address: d.address, pincode: d.pincode, latitude: d.latitude ?? null, longitude: d.longitude ?? null
  }).select().single();
  if (error || !data) return { ok: false, error: error?.message || 'Could not create booking.' };
  await refresh();
  return { ok: true, booking: mapBooking(data) };
};
const rpc = async (fn: string, args: object): Promise<Res> => {
  if (!sb) return fail(NOT_CONFIGURED);
  const { error } = await sb.rpc(fn, args);
  if (error) return fail(error.message);
  await refresh();
  return { ok: true };
};
export const approveCollection = (id: string) => rpc('approve_collection', { p_id: id });
export const approveReport = (id: string, values: Record<string, string>, remarks: string) =>
  rpc('approve_report', { p_id: id, p_values: values, p_remarks: remarks });
export const setStaffRole = (phone: string, role: 'collector' | 'patient') => rpc('set_role', { p_phone: phone, p_role: role });

export const flagFor = (v: number, min: number, max: number): 'Optimal' | 'Mild Alert' | 'Critical' => {
  if (v >= min && v <= max) return 'Optimal';
  const d = v < min ? min - v : v - max;
  return d > Math.max(max - min, 0.0001) * 0.5 ? 'Critical' : 'Mild Alert';
};

export const buildReport = (b: Booking): PatientReportData => {
  const fmt = (iso?: string) => iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';
  const year = String(new Date(b.approvedAt || Date.now()).getFullYear());
  return {
    ...DEMO_PATIENT_REPORT,
    patientId: b.id, specimenId: b.specimenId, patientName: b.patientName,
    age: Number(b.age) || 0, gender: b.gender === 'Female' ? 'Female' : 'Male',
    collectionTime: fmt(b.collectedAt), reportingTime: fmt(b.approvedAt),
    referredBy: 'Dr. Anil Kumar Singh, MD (Chief Consultant)',
    pathologist: 'Dr. Anil Kumar Singh, MD Path (Chief Clinical Pathologist & Lab Director)',
    biomarkers: DEMO_PATIENT_REPORT.biomarkers.map(m => {
      const v = Number(b.values?.[m.name]);
      const status = flagFor(v, m.minNormal, m.maxNormal);
      return {
        ...m, value: v, status,
        interpretation: status === 'Optimal' ? 'Within the reference range.'
          : `${v < m.minNormal ? 'Below' : 'Above'} the normal range (${m.minNormal} - ${m.maxNormal} ${m.unit}). Please consult your doctor.`,
        historicalTrend: [{ year, value: v }]
      };
    })
  };
};
