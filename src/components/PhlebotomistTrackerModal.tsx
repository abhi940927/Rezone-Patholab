import React, { useState, useEffect } from 'react';
import { getWhatsAppUrl, PHONE_NUMBER } from '../utils/whatsapp';
import { BookingStatusCard } from './BookingStatusCard';

interface PhlebotomistTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
}

export const PhlebotomistTrackerModal: React.FC<PhlebotomistTrackerModalProps> = ({
  isOpen,
  onClose,
  bookingId = 'RZ-BK-829104'
}) => {
  const [etaMins, setEtaMins] = useState(24);
  const [temp, setTemp] = useState(4.1);

  // Micro temperature fluctuation simulation to show real-time IoT telemetry
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.1;
        const next = Number((prev + delta).toFixed(2));
        return Math.max(3.8, Math.min(4.4, next));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative my-auto border border-[#eaedff]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff]"
          aria-label="Close tracker"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006398] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">near_me</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#131b2e]">Live Phlebotomist Dispatch</h3>
              <span className="w-2 h-2 rounded-full bg-[#006242] animate-ping"></span>
            </div>
            <p className="text-xs text-[#3e4948]">
              Tracking Specimen Courier & Medical Assistant for <strong className="font-mono text-[#005f5e]">{bookingId}</strong>
            </p>
          </div>
        </div>

        {bookingId && (
          <div className="mb-3.5">
            <BookingStatusCard bookingId={bookingId} />
          </div>
        )}

        {/* Live Map Representation */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#e2e7ff] border border-[#dae2fd] flex items-center justify-center">
          {/* Stylized geometric grid imitating live GPS map */}
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#005f5e15_1px,transparent_1px),linear-gradient(to_bottom,#005f5e15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Road vector simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#006398] stroke-2 stroke-dasharray-4" viewBox="0 0 400 180">
            <path d="M 40,140 Q 120,120 200,80 T 360,50" fill="none" strokeWidth="3" stroke="#007a78" strokeDasharray="6 4" />
          </svg>

          {/* Destination Marker */}
          <div className="absolute top-8 right-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#005f5e] text-white flex items-center justify-center shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-base">home</span>
            </div>
            <span className="text-[10px] font-bold text-[#00201f] bg-white px-1.5 py-0.5 rounded shadow mt-1">
              Your Doorstep
            </span>
          </div>

          {/* Phlebotomist Marker */}
          <div className="absolute bottom-10 left-16 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#006398] text-white flex items-center justify-center shadow-xl ring-4 ring-[#5bb8fe]/40">
              <span className="material-symbols-outlined text-xl">two_wheeler</span>
            </div>
            <span className="text-[10px] font-bold text-[#001d31] bg-white px-2 py-0.5 rounded shadow mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006242] animate-ping"></span>
              Aarav (En Route)
            </span>
          </div>

          {/* ETA Badge Overlay */}
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-[#eaedff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006242] text-lg">timer</span>
            <div>
              <div className="text-[9px] text-[#6e7978] uppercase font-bold">Estimated Arrival</div>
              <div className="text-xs font-bold text-[#131b2e]">{etaMins} Minutes</div>
            </div>
          </div>
        </div>

        {/* Assigned Phlebotomist Card */}
        <div className="mt-3.5 p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#005f5e] text-white flex items-center justify-center font-bold text-sm">
              AS
            </div>
            <div>
              <div className="text-xs font-bold text-[#131b2e] flex items-center gap-1">
                <span>Aarav Sharma</span>
                <span className="text-[10px] bg-[#bdffdb] text-[#002113] px-1.5 py-0.2 rounded font-semibold">
                  Certified Phlebo
                </span>
              </div>
              <div className="text-[11px] text-[#3e4948]">1,420+ Collections • ★ 4.96 Patient Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#bdc9c8] hover:bg-[#eaedff] text-xs font-bold text-[#006398] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>Call</span>
            </a>
            <a
              href={getWhatsAppUrl(`Hello Aarav, I am tracking my home collection booking ${bookingId}. Please update status.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-xs font-bold text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Live IoT Cold-Chain Vault Telemetry */}
        <div className="mt-3.5 p-3.5 bg-gradient-to-r from-[#00201f] to-[#131b2e] text-white rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse"></span>
              <span className="font-mono font-bold text-[#abfffc]">IoT-VAULT #412 TELEMETRY</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">SPECIMEN SHIELD: ACTIVE</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="p-2 rounded bg-white/10">
              <div className="text-[10px] text-white/70">Vault Temp</div>
              <div className="text-sm font-bold text-[#6ffbbe]">{temp}°C</div>
              <div className="text-[9px] text-white/50">2°C – 8°C Band</div>
            </div>
            <div className="p-2 rounded bg-white/10">
              <div className="text-[10px] text-white/70">Humidity</div>
              <div className="text-sm font-bold text-white">42%</div>
              <div className="text-[9px] text-white/50">Optimal</div>
            </div>
            <div className="p-2 rounded bg-white/10">
              <div className="text-[10px] text-white/70">Sensor Health</div>
              <div className="text-sm font-bold text-[#4edea3]">100% OK</div>
              <div className="text-[9px] text-white/50">GPS Locked</div>
            </div>
          </div>
        </div>

        {/* Steps progression */}
        <div className="mt-3.5 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-[#006242] font-semibold">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Sterile BD Vacutainer vacuum needle kit pre-assembled</span>
          </div>
          <div className="flex items-center gap-2 text-[#006398] font-semibold">
            <span className="material-symbols-outlined text-base animate-spin">refresh</span>
            <span>Phlebotomist en route to address in 45-minute priority window</span>
          </div>
          <div className="flex items-center gap-2 text-[#6e7978]">
            <span className="material-symbols-outlined text-base">radio_button_unchecked</span>
            <span>Bedside 2D barcode printing & robotic laboratory intake</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold text-xs transition-colors"
        >
          Dismiss Tracker (Continuous Background Updates)
        </button>
      </div>
    </div>
  );
};
