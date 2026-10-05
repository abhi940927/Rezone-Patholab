import React, { useState } from 'react';
import { useDB, currentUser, logout, setNewPassword, cancelRecovery } from '../utils/store';
import { AuthModal } from './AuthModal';
import { StaffDashboard } from './StaffDashboard';
import { BookingStatusCard } from './BookingStatusCard';
import { ReportViewerModal } from './ReportViewerModal';

export const AccountMenu: React.FC = () => {
  const db = useDB();
  const user = currentUser(db);
  const [menu, setMenu] = useState(false);
  const [auth, setAuth] = useState(false);
  const [dash, setDash] = useState(false);
  const [mine, setMine] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const mineList = user ? db.bookings.filter(b => b.userId === user.id).reverse() : [];

  return (
    <>
      <div className="fixed bottom-20 md:bottom-5 left-3 z-40">
        {user ? (
          <div className="relative">
            {menu && (
              <div className="absolute bottom-12 left-0 w-52 bg-white rounded-xl shadow-xl border border-[#eaedff] p-1.5 text-xs">
                {user.role === 'patient'
                  ? <button onClick={() => { setMine(true); setMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f2f3ff] font-semibold">My Bookings &amp; Reports</button>
                  : <button onClick={() => { setDash(true); setMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f2f3ff] font-semibold">Open Dashboard</button>}
                <button onClick={() => { logout(); setMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f2f3ff] text-[#ba1a1a] font-semibold">Logout</button>
              </div>
            )}
            <button onClick={() => setMenu(!menu)} className="px-3.5 py-2.5 rounded-full bg-[#005f5e] text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">account_circle</span><span className="max-w-[120px] truncate">{user.name}</span>
            </button>
          </div>
        ) : (
          <button onClick={() => setAuth(true)} className="px-3.5 py-2.5 rounded-full bg-[#005f5e] text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">login</span><span>Login / Register</span>
          </button>
        )}
      </div>

      {db.recovery && (
        <div className="fixed inset-0 z-[70] bg-[#131b2e]/70 backdrop-blur-sm flex items-center justify-center p-3">
          <form onSubmit={async e => { e.preventDefault(); const r = await setNewPassword(pw); if (r.ok) { setPw(''); setPwErr(''); alert('Password updated. Please log in with your new password.'); } else setPwErr(r.error); }} className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-3">
            <h3 className="text-xl font-bold text-[#131b2e]">Set a new password</h3>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password (min 6 characters)" className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#bdc9c8] rounded-lg text-xs" />
            {pwErr && <div className="text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2">{pwErr}</div>}
            <button type="submit" className="w-full py-2.5 rounded-lg bg-[#005f5e] text-white text-sm font-bold">Update Password</button>
            <button type="button" onClick={cancelRecovery} className="w-full text-xs font-semibold text-[#006398]">Cancel</button>
          </form>
        </div>
      )}

      <AuthModal isOpen={auth && !user} onClose={() => setAuth(false)} />
      {user && user.role !== 'patient' && <StaffDashboard isOpen={dash} onClose={() => setDash(false)} user={user} />}
      {mine && user && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-start justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl relative my-6 border border-[#eaedff] space-y-3">
            <button onClick={() => setMine(false)} className="absolute top-3 right-3 text-[#6e7978] p-1 rounded-lg hover:bg-[#f2f3ff]" aria-label="Close"><span className="material-symbols-outlined text-2xl">close</span></button>
            <h3 className="text-xl font-bold text-[#131b2e]">My Bookings &amp; Reports</h3>
            {mineList.length === 0 && <p className="text-xs text-[#6e7978]">No bookings yet.</p>}
            {mineList.map(b => <BookingStatusCard key={b.id} bookingId={b.id} onView={() => setViewId(b.id)} />)}
          </div>
        </div>
      )}
      <ReportViewerModal isOpen={!!viewId} onClose={() => setViewId(null)} booking={db.bookings.find(b => b.id === viewId) || null} />
    </>
  );
};
