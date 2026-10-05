import React, { useEffect } from 'react';
import { BOOKING_CALL_NUMBER, BOOKING_CALL_DISPLAY } from '../utils/whatsapp';

const ADDRESS = 'BDO Block Club Road, near Parwati Chandra Hotel, Arrah, Bihar (PIN 802301)';

export const TestingNoticeModal: React.FC<{ open: boolean; onClose: () => void; fromBooking?: boolean }> = ({ open, onClose, fromBooking }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-[#131b2e]/70 backdrop-blur-sm flex items-center justify-center p-3" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-[#eaedff] text-center">
        <button onClick={() => onClose()} className="absolute top-3 right-3 text-[#6e7978] p-1 rounded-lg hover:bg-[#f2f3ff]" aria-label="Close">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#fff4e0] text-[#b45309] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">construction</span>
        </div>
        <h3 className="text-xl font-bold text-[#131b2e] mb-2">Site Under Testing</h3>
        <p className="text-sm text-[#3e4948] mb-1">This site is currently in the testing phase. Sorry for the inconvenience.</p>
        <p className="text-sm font-semibold text-[#005f5e] mb-4">We will be back soon.{fromBooking ? ' Calling is the fastest way to book your slot right now.' : ''}</p>

        <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-left text-xs text-[#3e4948] space-y-2 mb-4">
          <div className="font-bold text-[#131b2e]">Book your slot fast</div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-base text-[#005f5e]">call</span>
            <span>Call us on <strong className="text-[#131b2e]">{BOOKING_CALL_DISPLAY}</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-base text-[#005f5e]">location_on</span>
            <span>Or visit our hospital: <strong className="text-[#131b2e]">{ADDRESS}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <a href={`tel:+91${BOOKING_CALL_NUMBER}`} className="flex-1 py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-sm font-bold flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-base">call</span><span>Call Now</span>
          </a>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(ADDRESS)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-lg border border-[#005f5e] text-[#005f5e] text-sm font-bold flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-base">map</span><span>View on Map</span>
          </a>
        </div>
        <button onClick={() => onClose()} className="mt-3 text-xs font-semibold text-[#006398]">{fromBooking ? 'Continue to online booking' : 'Continue to site'}</button>
      </div>
    </div>
  );
};
