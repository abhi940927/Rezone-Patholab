import React, { useState } from 'react';
import { login, register, sendResetLink } from '../utils/store';

type Mode = 'login' | 'register' | 'forgot';
const empty = { name: '', email: '', phone: '', password: '', confirm: '', otp: '', newPass: '' };

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess?: () => void; initialMode?: Mode }> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [otp, setOtp] = useState<string | null>(null);
  if (!isOpen) return null;

  const go = (m: Mode) => { setMode(m); setErr(''); setInfo(''); setOtp(null); };
  const done = () => { setF(empty); (onSuccess || onClose)(); };
  const field = (label: string, key: keyof typeof empty, type = 'text', ph = '') => (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1">{label}</label>
      <input type={type} value={f[key]} placeholder={ph} onChange={e => setF({ ...f, [key]: e.target.value })}
        className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#bdc9c8] rounded-lg text-xs text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#005f5e]" />
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setInfo('');
    if (mode === 'login') {
      const r = await login(f.phone, f.password); if (!r.ok) return setErr(r.error); done();
    } else if (mode === 'register') {
      if (f.password !== f.confirm) return setErr('Passwords do not match.');
      const r = await register(f); if (!r.ok) return setErr(r.error); done();
    } else {
      const r = await sendResetLink(f.phone); if (!r.ok) return setErr(r.error);
      setInfo('A password reset link has been sent to the email you registered with. Open it to set a new password.');
    }
  };

  const title = mode === 'login' ? 'Login to continue' : mode === 'register' ? 'Create your account' : 'Reset password';
  return (
    <div className="fixed inset-0 z-[60] bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative my-auto border border-[#eaedff]">
        <button onClick={onClose} className="absolute top-3 right-3 text-[#6e7978] p-1 rounded-lg hover:bg-[#f2f3ff]" aria-label="Close">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h3 className="text-xl font-bold text-[#131b2e]">{title}</h3>
        <p className="text-xs text-[#3e4948] mb-4">{mode === 'forgot' ? 'Enter your registered phone number.' : 'Login is required to book a test and see your reports.'}</p>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && field('Full Name', 'name', 'text', 'As per ID')}
          {mode === 'register' && field('Email', 'email', 'email', 'you@example.com')}
          {field('Phone Number', 'phone', 'tel', '10-digit mobile')}
          {mode !== 'forgot' && field('Password', 'password', 'password', 'Minimum 6 characters')}
          {mode === 'register' && field('Confirm Password', 'confirm', 'password')}
                    {err && <div className="text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-3 py-2">{err}</div>}
          {info && <div className="text-[11px] font-semibold text-[#006242] bg-[#6ffbbe]/30 rounded-lg px-3 py-2">{info}</div>}
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-sm font-bold">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-4 text-xs text-[#3e4948] flex justify-between">
          {mode === 'login' ? (<>
            <button onClick={() => go('forgot')} className="text-[#006398] font-semibold">Forgot password?</button>
            <button onClick={() => go('register')} className="text-[#006398] font-semibold">New user? Register</button>
          </>) : <button onClick={() => go('login')} className="text-[#006398] font-semibold">Back to login</button>}
        </div>
      </div>
    </div>
  );
};
