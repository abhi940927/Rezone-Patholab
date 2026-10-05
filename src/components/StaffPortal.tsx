import React, { useState } from 'react';
import { useDB, currentUser, login, logout } from '../utils/store';
import { StaffDashboard } from './StaffDashboard';

export const StaffPortal: React.FC<{ role: 'collector' | 'doctor' }> = ({ role }) => {
  const isDoc = role === 'doctor';
  const db = useDB();
  const user = currentUser(db);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const staff = user && user.role === role ? user : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await login(phone, password, role);
    if (!r.ok) return setErr(r.error);
    setErr(''); setPassword('');
  };
  if (!db.ready) return <div className="min-h-screen flex items-center justify-center text-white text-sm">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00201f] to-[#131b2e] flex items-center justify-center p-4">
      {staff ? (
        <>
          <div className="text-center text-white space-y-3">
            <div className="text-lg font-bold">Welcome, {staff.name}</div>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-white text-[#005f5e] text-sm font-bold">Logout</button>
          </div>
          <StaffDashboard isOpen onClose={logout} user={staff} />
        </>
      ) : (
        <form onSubmit={submit} className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#005f5e]">admin_panel_settings</span>
            <div>
              <h1 className="text-xl font-bold text-[#131b2e]">{isDoc ? "ReZone Doctor Portal" : "ReZone Collector Portal"}</h1>
              <p className="text-xs text-[#3e4948]">{isDoc ? 'Authorized doctor access only' : 'Authorized sample collectors only'}</p>
            </div>
          </div>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Registered phone number" className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#bdc9c8] rounded-lg text-xs" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#bdc9c8] rounded-lg text-xs" />
          {err && <div className="text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2">{err}</div>}
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-sm font-bold">{isDoc ? 'Doctor Login' : 'Collector Login'}</button>
          <a href="/" className="block text-center text-xs font-semibold text-[#006398]">&larr; Back to patient site</a>
        </form>
      )}
    </div>
  );
};
