import React, { useState } from 'react';
import { useDB, User, Booking, approveCollection, approveReport, flagFor, setStaffRole } from '../utils/store';
import { DEMO_PATIENT_REPORT } from '../data/mockData';
import { DOCTOR_NAME } from '../utils/whatsapp';

const ROWS = DEMO_PATIENT_REPORT.biomarkers;
const tone = (s: string) => s === 'Optimal' ? 'text-[#006242]' : s === 'Critical' ? 'text-[#ba1a1a] font-bold' : 'text-[#b45309]';
const Stat = ({ n, l }: { n: number; l: string }) => (
  <div className="flex-1 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-center">
    <div className="text-2xl font-bold text-[#005f5e]">{n}</div><div className="text-[10px] uppercase font-bold text-[#6e7978]">{l}</div>
  </div>
);

export const StaffDashboard: React.FC<{ isOpen: boolean; onClose: () => void; user: User }> = ({ isOpen, onClose, user }) => {
  const db = useDB();
  const [openId, setOpenId] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState('');
  const [tab, setTab] = useState<'reports' | 'bookings' | 'patients' | 'team'>('reports');
  const [nc, setNc] = useState('');
  const [ncErr, setNcErr] = useState('');
  if (!isOpen) return null;

  const isDoc = user.role === 'doctor';
  const all = [...db.bookings].reverse();
  const reportsTab = isDoc && tab === 'reports';
  const list = reportsTab ? all.filter(b => b.status !== 'booked') : all;
  const open = list.find(b => b.id === openId) || null;
  const complete = ROWS.every(m => vals[m.name] !== undefined && vals[m.name].trim() !== '' && !isNaN(Number(vals[m.name])));

  const start = (b: Booking) => { setOpenId(b.id); setVals(b.values || {}); setRemarks(b.remarks || ''); };
  const approve = async () => { if (open && complete) { const r = await approveReport(open.id, vals, remarks); if (r.ok) setOpenId(null); else alert(r.error); } };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/70 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 shadow-2xl relative my-4 border border-[#eaedff]">
        <button onClick={onClose} className="absolute top-3 right-3 text-[#6e7978] p-1 rounded-lg hover:bg-[#f2f3ff]" aria-label="Close">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h3 className="text-xl font-bold text-[#131b2e]">{isDoc ? `Doctor Dashboard · ${DOCTOR_NAME}` : 'Sample Collector Dashboard'}</h3>
        <p className="text-xs text-[#3e4948] mb-4">{isDoc ? 'Examine collected samples, enter results and approve reports.' : 'Approve each blood sample once it has been collected.'}</p>

        <div className="flex gap-2 mb-4">
          {isDoc ? (<>
            <Stat n={db.bookings.filter(b => b.status !== 'booked').length} l="Patients gave blood" />
            <Stat n={db.bookings.filter(b => b.status === 'collected').length} l="Awaiting report" />
            <Stat n={db.bookings.filter(b => b.status === 'approved').length} l="Approved" />
          </>) : (<>
            <Stat n={db.bookings.filter(b => b.status === 'booked').length} l="To collect" />
            <Stat n={db.bookings.filter(b => b.status !== 'booked').length} l="Collected" />
          </>)}
        </div>

        {isDoc && (
          <div className="flex gap-1 mb-4 overflow-x-auto text-xs font-bold">
            {([['reports', 'Reports'], ['bookings', 'All Bookings'], ['patients', 'Patients'], ['team', 'Collectors']] as const).map(([k, l]) => (
              <button key={k} onClick={() => { setTab(k); setOpenId(null); }} className={`px-3 py-2 rounded-lg whitespace-nowrap ${tab === k ? 'bg-[#005f5e] text-white' : 'bg-[#f2f3ff] text-[#3e4948]'}`}>{l}</button>
            ))}
          </div>
        )}

        {isDoc && tab === 'patients' ? (
          <ul className="space-y-2">
            {db.users.filter(u => u.role === 'patient').length === 0 && <li className="text-xs text-[#6e7978] py-8 text-center">No registered patients yet.</li>}
            {db.users.filter(u => u.role === 'patient').map(u => (
              <li key={u.id} className="p-3 border border-[#eaedff] rounded-xl text-xs flex justify-between gap-2">
                <div><div className="font-bold text-sm text-[#131b2e]">{u.name}</div><div className="text-[#3e4948]">{u.phone} · {u.email}</div></div>
                <div className="text-right font-bold text-[#005f5e]">{db.bookings.filter(b => b.userId === u.id).length} booking(s)</div>
              </li>
            ))}
          </ul>
        ) : isDoc && tab === 'team' ? (
          <div className="space-y-3 text-xs">
            <form onSubmit={async e => { e.preventDefault(); const r = await setStaffRole(nc, 'collector'); if (r.ok) { setNc(''); setNcErr(''); } else setNcErr(r.error); }} className="p-3 rounded-xl bg-[#f2f3ff] flex flex-col sm:flex-row gap-2">
              <input value={nc} onChange={e => setNc(e.target.value)} placeholder="Registered phone number of the new collector" className="flex-1 px-2 py-2 border border-[#bdc9c8] rounded" />
              <button className="px-3 py-2 rounded bg-[#005f5e] text-white font-bold">Make Collector</button>
              {ncErr && <div className="text-[#ba1a1a] font-semibold">{ncErr}</div>}
            </form>
            <p className="text-[11px] text-[#6e7978]">The collector must first register on the patient site with their own phone number.</p>
            <ul className="space-y-2">
              {db.users.filter(u => u.role === 'collector').map(u => (
                <li key={u.id} className="p-3 border border-[#eaedff] rounded-xl flex justify-between items-center">
                  <div><div className="font-bold text-sm text-[#131b2e]">{u.name}</div><div className="text-[#3e4948]">{u.phone}</div></div>
                  <button onClick={() => setStaffRole(u.phone, 'patient')} className="px-3 py-1.5 rounded-lg border border-[#ba1a1a] text-[#ba1a1a] font-bold">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ) : open ? (
          <div className="space-y-3">
            <button onClick={() => setOpenId(null)} className="text-xs font-semibold text-[#006398]">&larr; Back to patients</button>
            <div className="p-3 rounded-xl bg-[#f2f3ff] text-xs"><strong className="text-sm text-[#131b2e]">{open.patientName}</strong> ({open.age || '-'}Y / {open.gender}) · {open.packageName} · <span className="font-mono">{open.specimenId}</span></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-[#005f5e] text-white text-left"><th className="p-2">Test</th><th className="p-2">Result</th><th className="p-2">Unit</th><th className="p-2">Normal range</th><th className="p-2">Flag</th></tr></thead>
                <tbody>
                  {ROWS.map(m => {
                    const raw = vals[m.name] ?? ''; const ok = raw.trim() !== '' && !isNaN(Number(raw));
                    return (
                      <tr key={m.name} className="border-b border-[#eaedff]">
                        <td className="p-2 font-semibold text-[#131b2e]">{m.name}</td>
                        <td className="p-2"><input type="number" step="any" value={raw} disabled={open.status === 'approved'} onChange={e => setVals({ ...vals, [m.name]: e.target.value })} className="w-20 px-2 py-1 border border-[#bdc9c8] rounded" /></td>
                        <td className="p-2">{m.unit}</td>
                        <td className="p-2 text-[#3e4948]">{m.minNormal} - {m.maxNormal}</td>
                        <td className={`p-2 ${ok ? tone(flagFor(Number(raw), m.minNormal, m.maxNormal)) : ''}`}>{ok ? flagFor(Number(raw), m.minNormal, m.maxNormal) : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <textarea value={remarks} disabled={open.status === 'approved'} onChange={e => setRemarks(e.target.value)} placeholder="Doctor's remarks (optional)" rows={2} className="w-full px-3 py-2 border border-[#bdc9c8] rounded-lg text-xs" />
            {open.status === 'approved'
              ? <div className="text-xs font-bold text-[#006242]">Approved and visible to the patient.</div>
              : <button onClick={approve} disabled={!complete} className="w-full py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed">Approve &amp; Publish to Patient</button>}
          </div>
        ) : list.length === 0 ? (
          <div className="text-xs text-[#6e7978] py-8 text-center">No patients yet.</div>
        ) : (
          <ul className="space-y-2">
            {list.map(b => (
              <li key={b.id} className="p-3 border border-[#eaedff] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-sm text-[#131b2e]">{b.patientName} <span className="font-normal text-[#3e4948]">({b.age || '-'}Y / {b.gender})</span></div>
                  <div className="text-[#3e4948]">{b.packageName} · <span className="font-mono">{b.id}</span> · {b.mobile}</div>
                  <div className="text-[#3e4948]">📍 {b.address || 'Address not provided'}{b.pincode ? ` - ${b.pincode}` : ''}{' '}
                    <a href={b.latitude != null ? `https://www.google.com/maps?q=${b.latitude},${b.longitude}` : `https://www.google.com/maps/search/${encodeURIComponent(b.address)}`} target="_blank" rel="noopener noreferrer" className="font-bold text-[#006398] underline">{b.latitude != null ? 'Open GPS pin' : 'Search on map'}</a>
                  </div>
                  <div className="text-[10px] font-bold uppercase text-[#6e7978]">{b.status === 'booked' ? 'Awaiting collection' : b.status === 'collected' ? 'Awaiting doctor' : 'Report approved'}</div>
                </div>
                {reportsTab ? (
                  <button onClick={() => start(b)} className="px-3 py-2 rounded-lg bg-[#005f5e] text-white font-bold">{b.status === 'approved' ? 'View report' : 'Examine & enter report'}</button>
                ) : b.status === 'booked' ? (
                  <button onClick={async () => { const r = await approveCollection(b.id); if (!r.ok) alert(r.error); }} className="px-3 py-2 rounded-lg bg-[#006242] text-white font-bold">Approve: Sample collected</button>
                ) : <span className="font-bold text-[#006242]">Collected</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
