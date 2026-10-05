import React from 'react';
import { useDB } from '../utils/store';
import { buildReport } from '../utils/store';
import { printOrSaveReportPdf } from '../utils/reportPdf';
import { getWhatsAppSendReportUrl, DOCTOR_NAME, BOOKING_CALL_DISPLAY } from '../utils/whatsapp';

const STEPS = [
  { label: 'Booking confirmed', icon: 'event_available' },
  { label: 'Blood sample collected', icon: 'water_drop' },
  { label: 'Doctor examining your sample', icon: 'biotech' },
  { label: 'Report approved', icon: 'task_alt' }
];

export const BookingStatusCard: React.FC<{ bookingId: string; onView?: () => void }> = ({ bookingId, onView }) => {
  const b = useDB().bookings.find(x => x.id === bookingId);
  if (!b) return null;
  const stage = b.status === 'booked' ? 0 : b.status === 'collected' ? 2 : 3;
  const msg = b.status === 'booked' ? 'Waiting for our phlebotomist to collect your blood sample.'
    : b.status === 'collected' ? 'Your blood sample has been collected. The doctor is examining it and will approve your report.'
    : 'Your report has been approved by the doctor.';

  return (
    <div className="p-4 bg-white rounded-xl text-left text-xs space-y-3 border border-[#dae2fd]">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-[#6e7978]">Patient</div>
          <div className="text-sm font-bold text-[#131b2e]">{b.patientName}{b.age ? <span className="font-normal text-[#3e4948]"> ({b.age}Y / {b.gender})</span> : null}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-[#6e7978]">{b.id}</div>
          <div className="text-xs font-semibold text-[#005f5e]">{b.packageName}</div>
        </div>
      </div>
      <ol className="space-y-2">
        {STEPS.map((s, i) => {
          const done = i < stage || (stage === 3 && i === 3);
          const active = i === stage && stage !== 3;
          return (
            <li key={s.label} className="flex items-center gap-2.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-[#006242] text-white' : active ? 'bg-[#005f5e] text-white animate-pulse' : 'bg-[#eaedff] text-[#6e7978]'}`}>
                <span className="material-symbols-outlined text-sm">{done ? 'check' : s.icon}</span>
              </span>
              <span className={done || active ? 'font-semibold text-[#131b2e]' : 'text-[#6e7978]'}>{s.label}</span>
            </li>
          );
        })}
      </ol>
      <p className={`text-[11px] font-semibold ${b.status === 'booked' ? 'text-[#6e7978]' : 'text-[#006242]'}`}>{msg}</p>
      {b.status === 'approved' ? (
        <div className="pt-2 border-t border-[#eaedff] space-y-2">
          <div className="text-[11px] text-[#3e4948]">Approved by <strong>{DOCTOR_NAME}</strong></div>
          <div className="flex flex-col sm:flex-row gap-2">
            {onView && <button type="button" onClick={onView} className="flex-1 px-3 py-2 rounded-lg border border-[#005f5e] text-[#005f5e] font-bold">View Report</button>}
            <button type="button" onClick={() => printOrSaveReportPdf(buildReport(b))} className="flex-1 px-3 py-2 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white font-bold flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-base">download</span><span>Download Report</span>
            </button>
            <a href={getWhatsAppSendReportUrl({ patientName: b.patientName, patientPhone: b.mobile, packageName: b.packageName, specimenId: b.specimenId, bloodStatus: 'Report approved' })} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-[#25D366] text-white font-bold text-center">WhatsApp</a>
          </div>
        </div>
      ) : <p className="text-[10px] text-[#6e7978]">Questions? Call {BOOKING_CALL_DISPLAY}.</p>}
    </div>
  );
};
