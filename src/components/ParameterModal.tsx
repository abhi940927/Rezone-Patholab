import React from 'react';
import { HEALTH_PACKAGES } from '../data/mockData';

interface ParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName?: string;
  onBookNow?: (name: string) => void;
}

export const ParameterModal: React.FC<ParameterModalProps> = ({
  isOpen,
  onClose,
  packageName = 'ReZone Comprehensive Vital Plus',
  onBookNow
}) => {
  if (!isOpen) return null;

  const pkg = HEALTH_PACKAGES.find(p => p.name.toLowerCase().includes(packageName.toLowerCase())) || HEALTH_PACKAGES[1];

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-[#eaedff] max-h-[88vh] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff]"
          aria-label="Close parameters dialog"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="pb-3 border-b border-[#eaedff] shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#97f2ef] text-[#00201f] text-xs font-bold">
              {pkg.parametersCount} Parameters
            </span>
            <span className="text-xs text-[#006242] font-semibold">Dual MD-Co-Signed</span>
          </div>
          <h3 className="text-xl font-bold text-[#131b2e] mt-1">{pkg.name}</h3>
          <p className="text-xs text-[#3e4948] mt-0.5">{pkg.tagline}</p>
        </div>

        {/* Parameter List Categories */}
        <div className="overflow-y-auto flex-1 py-4 space-y-3.5 pr-1">
          {pkg.departments.map((dept, idx) => (
            <div key={idx} className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#005f5e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">science</span>
                  <span>{dept.name}</span>
                </h4>
                <span className="text-[10px] text-[#6e7978] font-bold">
                  {dept.tests.length} Biomarkers
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {dept.tests.map((testName, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] px-2 py-1 rounded bg-white border border-[#eaedff] text-[#131b2e] font-medium"
                  >
                    {testName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Action footer */}
        <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-[#6e7978]">Special Subsidized Cost</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#005f5e]">₹{pkg.discountedPrice}</span>
              <span className="text-xs text-[#6e7978] line-through">₹{pkg.originalPrice}</span>
              <span className="text-[10px] font-bold text-[#93000a] bg-[#ffdad6] px-1.5 py-0.5 rounded">
                {pkg.discountPercentage}% OFF
              </span>
            </div>
          </div>


          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#131b2e]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onBookNow) onBookNow(pkg.name);
              }}
              className="px-5 py-2 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <span>Book This Package</span>
              <span className="material-symbols-outlined text-sm">calendar_month</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
