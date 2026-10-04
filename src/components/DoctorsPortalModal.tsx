import React, { useState } from 'react';

interface DoctorsPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorsPortalModal: React.FC<DoctorsPortalModalProps> = ({ isOpen, onClose }) => {
  const [clinicId, setClinicId] = useState('DOC-CLINIC-409');
  const [accessCode, setAccessCode] = useState('••••••••');
  const [isLogged, setIsLogged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-[#eaedff]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff]"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#cce5ff] text-[#006398] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">stethoscope</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#131b2e]">Clinician & Hospital LIS Integration Portal</h3>
            <p className="text-xs text-[#3e4948]">
              Automated HL7/FHIR bi-directional Laboratory Information System interfacing
            </p>
          </div>
        </div>

        {!isLogged ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff] text-xs text-[#3e4948] space-y-1">
              <strong className="text-[#131b2e] block">Physician Quick Demo Access:</strong>
              <p>Sign in to view real-time specimen intake queues, critical abnormal value SMS triggers, and direct batch PDF generation for oncology/cardiology patients.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsLogged(true); }} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1">
                  Doctor / Medical Center NPI or Registration Code
                </label>
                <input
                  type="text"
                  required
                  value={clinicId}
                  onChange={(e) => setClinicId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1">
                  Security Passkey / 2FA Token
                </label>
                <input
                  type="password"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#006398] hover:bg-[#00476e] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Enter Clinician Terminal</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* Live Queue overview */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
                <div className="text-[10px] text-[#6e7978]">Active Patients Today</div>
                <div className="text-xl font-bold text-[#005f5e]">28 Samples</div>
              </div>
              <div className="p-2.5 bg-[#ffdad6] rounded-xl border border-[#ba1a1a]/20">
                <div className="text-[10px] text-[#93000a]">Critical Panic Values</div>
                <div className="text-xl font-bold text-[#ba1a1a]">1 Trigger</div>
              </div>
              <div className="p-2.5 bg-[#bdffdb] rounded-xl border border-[#006242]/20">
                <div className="text-[10px] text-[#002113]">Reports Ready</div>
                <div className="text-xl font-bold text-[#006242]">22 Ready</div>
              </div>
            </div>

            {/* Critical alert banner */}
            <div className="p-3 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs flex items-center justify-between border border-[#ba1a1a]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">warning</span>
                <span><strong>Panic Alert:</strong> Patient #RZ-99120 Potassium level 6.2 mEq/L (Hyperkalemia flag). Pathologist alerted.</span>
              </div>
              <button 
                onClick={() => alert("Connected to Duty Medical Officer on Line 1.")}
                className="px-2 py-1 bg-[#ba1a1a] text-white rounded text-[10px] font-bold shrink-0 ml-2"
              >
                Call Lab MD
              </button>
            </div>

            {/* Patient specimen queue */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#3e4948] uppercase tracking-wider">Patient Specimen Live Stream</span>
              <div className="p-2.5 bg-[#f2f3ff] rounded-lg text-xs flex items-center justify-between border border-[#eaedff]">
                <div>
                  <strong className="text-[#131b2e]">Specimen #RZ-99420-BIO (Jonathan Davis, 44Y)</strong>
                  <div className="text-[10px] text-[#6e7978]">Comprehensive Vital Plus • Dual Sign-off Complete • HbA1c 5.4%</div>
                </div>
                <span className="text-[10px] font-bold bg-[#bdffdb] text-[#002113] px-2 py-0.5 rounded">Released</span>
              </div>

              <div className="p-2.5 bg-[#f2f3ff] rounded-lg text-xs flex items-center justify-between border border-[#eaedff]">
                <div>
                  <strong className="text-[#131b2e]">Specimen #RZ-99424-BIO (Elena Rostova, 36Y)</strong>
                  <div className="text-[10px] text-[#6e7978]">Women Hormonal Balance (AMH, Ferritin, Thyroid) • Robotic Assayer</div>
                </div>
                <span className="text-[10px] font-bold bg-[#cce5ff] text-[#001d31] px-2 py-0.5 rounded animate-pulse">Running In Analyzer</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#eaedff] flex justify-between items-center text-xs">
              <span className="text-[#6e7978] font-mono">LIS API v2.4 (FHIR / HL7 Connected)</span>
              <button
                onClick={() => setIsLogged(false)}
                className="px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
