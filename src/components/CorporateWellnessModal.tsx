import React, { useState } from 'react';

interface CorporateWellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateWellnessModal: React.FC<CorporateWellnessModalProps> = ({ isOpen, onClose }) => {
  const [employeeCount, setEmployeeCount] = useState(150);
  const [tier, setTier] = useState<'vital' | 'executive'>('vital');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const costPerHead = tier === 'vital' ? 499 : 999;
  const totalEstimate = employeeCount * costPerHead;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };


  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-[#eaedff]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff]"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#005f5e] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">corporate_fare</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#131b2e]">ReZone Corporate Health Drives</h3>
            <p className="text-xs text-[#3e4948]">
              On-site workplace sample collection camps & executive health dashboards
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-[#bdffdb] text-[#006242] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>
            <h3 className="text-xl font-bold text-[#131b2e]">Proposal Dispatched</h3>
            <p className="text-xs text-[#3e4948]">
              Thank you {companyName || 'valued partner'}. Our Chief Medical Officer and Enterprise Care Director have sent a tailored corporate proposal to <strong>{email || 'your work email'}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-5 py-2.5 rounded-lg bg-[#005f5e] text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTier('vital')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tier === 'vital'
                    ? 'border-[#005f5e] bg-[#97f2ef]/20 ring-1 ring-[#005f5e]'
                    : 'border-[#eaedff] bg-[#f2f3ff]'
                }`}
              >
                <div className="text-xs font-bold text-[#131b2e]">Vital Corporate (48 Tests)</div>
                <div className="text-base font-bold text-[#005f5e] mt-0.5">₹499 / employee</div>
                <div className="text-[10px] text-[#3e4948] mt-1">CBC, Blood Sugar, Lipids, LFT, KFT</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('executive')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tier === 'executive'
                    ? 'border-[#005f5e] bg-[#97f2ef]/20 ring-1 ring-[#005f5e]'
                    : 'border-[#eaedff] bg-[#f2f3ff]'
                }`}
              >
                <div className="text-xs font-bold text-[#131b2e]">Executive Suite (92 Tests)</div>
                <div className="text-base font-bold text-[#005f5e] mt-0.5">₹999 / employee</div>
                <div className="text-[10px] text-[#3e4948] mt-1">Includes Vit D3/B12, Thyroid, HbA1c, Doctor Consult</div>
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#131b2e] mb-1">
                <span>Number of Employees: {employeeCount}</span>
                <span className="text-[#005f5e]">Estimated Total: ₹{totalEstimate.toLocaleString('en-IN')}</span>
              </div>

              <input
                type="range"
                min="20"
                max="2500"
                step="10"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full accent-[#005f5e] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6e7978] mt-1">
                <span>20 Team Members</span>
                <span>500</span>
                <span>2,500+ Enterprise</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Health Corp"
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Work Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@acme.com"
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#e2e7ff] rounded-xl text-xs text-[#00201f] space-y-1">
              <strong>Enterprise Perks Included:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#3e4948]">
                <li>Zero-disruption on-site mobile collection camp at office premises</li>
                <li>Confidential employee digital login cards + HIPAA protected aggregate health report for HR</li>
                <li>Complimentary webinar on metabolic health by Chief Pathologist</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              <span>Request Custom Corporate Package & Dates</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
