import React from 'react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
  onOpenReportModal: () => void;
  onOpenTracker: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBooking,
  onOpenReportModal,
  onOpenTracker
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#eaedff] px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2 safe-bottom">
      <a
        href="tel:+919279816571"
        className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[#3e4948] hover:text-[#005f5e] active:scale-95 transition-all text-center min-w-[48px]"
      >
        <span className="material-symbols-outlined text-xl text-[#006398]">call</span>
        <span className="text-[10px] font-bold mt-0.5">Call</span>
      </a>

      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[#25D366] active:scale-95 transition-all text-center min-w-[54px]"
      >
        <span className="material-symbols-outlined text-xl text-[#25D366]">chat</span>
        <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
      </a>


      <button
        onClick={onOpenReportModal}
        className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[#3e4948] hover:text-[#005f5e] active:scale-95 transition-all text-center min-w-[48px]"
      >
        <span className="material-symbols-outlined text-xl text-[#005f5e]">description</span>
        <span className="text-[10px] font-bold mt-0.5">Reports</span>
      </button>

      <button
        onClick={onOpenTracker}
        className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[#3e4948] hover:text-[#005f5e] active:scale-95 transition-all text-center min-w-[56px]"
      >
        <span className="material-symbols-outlined text-xl text-[#007a78]">near_me</span>
        <span className="text-[10px] font-bold mt-0.5">Track Phlebo</span>
      </button>

      <button
        onClick={onOpenBooking}
        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#005f5e] to-[#007a78] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-98"
      >
        <span className="material-symbols-outlined text-base">home_health</span>
        <span>Book Visit (45m ETA)</span>
      </button>
    </div>
  );
};
