import React, { useState } from 'react';

interface PathologistConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultBooked: () => void;
}

export const PathologistConsultModal: React.FC<PathologistConsultModalProps> = ({
  isOpen,
  onClose,
  onConsultBooked
}) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<'oncology' | 'biochemistry'>('oncology');
  const [mode, setMode] = useState<'video' | 'phone' | 'report'>('video');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [slot, setSlot] = useState('Today at 04:30 PM');
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      onConsultBooked();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-[#eaedff]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff]"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {booked ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-[#bdffdb] text-[#006242] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">videocam</span>
            </div>
            <h3 className="text-xl font-bold text-[#131b2e]">Tele-Consultation Scheduled</h3>
            <p className="text-xs text-[#3e4948]">
              Your complimentary session with <strong>{selectedSpecialist === 'oncology' ? 'Dr. Rajesh Varma, MD' : 'Dr. Sarah Chen, PhD'}</strong> is confirmed for <strong>{slot}</strong>.
            </p>
            <p className="text-[11px] text-[#6e7978]">
              A secure encrypted video link has been dispatched to {phone || 'your registered number'}.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-5 py-2.5 rounded-lg bg-[#005f5e] text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#bdffdb] text-[#006242] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">medical_services</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#131b2e]">Consult a Senior Pathologist</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#bdffdb] text-[#002113] text-[10px] font-bold">100% Free</span>
                </div>
                <p className="text-xs text-[#3e4948]">
                  Translate confusing biomarkers, organ panels, and clinical values into clear actionable health advice.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Specialist selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1.5">
                  Select Lead Specialist
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSpecialist('oncology')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedSpecialist === 'oncology'
                        ? 'border-[#005f5e] bg-[#97f2ef]/20 ring-1 ring-[#005f5e]'
                        : 'border-[#eaedff] bg-[#f2f3ff]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#131b2e]">Dr. Rajesh Varma, MD</div>
                    <div className="text-[10px] text-[#3e4948]">Medical Oncology & Internal Diagnostics</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSpecialist('biochemistry')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedSpecialist === 'biochemistry'
                        ? 'border-[#005f5e] bg-[#97f2ef]/20 ring-1 ring-[#005f5e]'
                        : 'border-[#eaedff] bg-[#f2f3ff]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#131b2e]">Dr. Sarah Chen, PhD</div>
                    <div className="text-[10px] text-[#3e4948]">Clinical Biochemistry & Metabolic Health</div>
                  </button>
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('video')}
                    className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 ${
                      mode === 'video'
                        ? 'border-[#005f5e] bg-[#005f5e] text-white'
                        : 'border-[#eaedff] bg-[#f2f3ff] text-[#3e4948]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">videocam</span>
                    <span>Video Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('phone')}
                    className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 ${
                      mode === 'phone'
                        ? 'border-[#005f5e] bg-[#005f5e] text-white'
                        : 'border-[#eaedff] bg-[#f2f3ff] text-[#3e4948]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>Phone Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('report')}
                    className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 ${
                      mode === 'report'
                        ? 'border-[#005f5e] bg-[#005f5e] text-white'
                        : 'border-[#eaedff] bg-[#f2f3ff] text-[#3e4948]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>Written Note</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Patient or Caregiver Name"
                    className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Preferred Slot Today</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8]"
                >
                  <option value="Today at 04:30 PM">Today at 04:30 PM (Earliest Available)</option>
                  <option value="Today at 06:00 PM">Today at 06:00 PM</option>
                  <option value="Tomorrow at 09:30 AM">Tomorrow at 09:30 AM</option>
                  <option value="Tomorrow at 02:00 PM">Tomorrow at 02:00 PM</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#006242] hover:bg-[#007d55] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">event_available</span>
                <span>Confirm Free Pathologist Consultation</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
