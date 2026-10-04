import React, { useState } from 'react';
import { SAMPLE_PRESCRIPTIONS } from '../data/mockData';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookExtractedPackage: (packageName: string) => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  onBookExtractedPackage
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setFileName(`Doctor_Prescription_${index + 1}.pdf`);
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      // Simulate scan on custom file using preset 1 as fallback data
      setSelectedPresetIndex(0);
      setIsScanning(true);
      setScanStep(1);
      setTimeout(() => setScanStep(2), 600);
      setTimeout(() => setScanStep(3), 1200);
      setTimeout(() => {
        setIsScanning(false);
      }, 1800);
    }
  };

  const activePreset = selectedPresetIndex !== null ? SAMPLE_PRESCRIPTIONS[selectedPresetIndex] : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-[#eaedff]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff]"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#97f2ef]/40 text-[#005f5e] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#131b2e]">Upload Doctor's Prescription</h3>
            <p className="text-xs text-[#3e4948]">
              AI-Parsed in 90 seconds & verified by Senior Clinical Pharmacist
            </p>
          </div>
        </div>

        {/* Prescription presets picker */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1.5">
            Or test with sample hospital prescriptions:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_PRESCRIPTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedPresetIndex === idx
                    ? 'border-[#005f5e] bg-[#97f2ef]/20 ring-1 ring-[#005f5e]'
                    : 'border-[#eaedff] bg-[#f2f3ff] hover:bg-[#eaedff]'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#131b2e]">
                  <span className="material-symbols-outlined text-sm text-[#005f5e]">description</span>
                  <span className="truncate">Sample {idx + 1}</span>
                </div>
                <div className="text-[10px] text-[#3e4948] mt-1 line-clamp-2">
                  {preset.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload dropzone */}
        <div className="border-2 border-dashed border-[#bdc9c8] hover:border-[#005f5e] rounded-xl p-5 text-center bg-[#faf8ff] hover:bg-[#f2f3ff] transition-colors cursor-pointer relative">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <span className="material-symbols-outlined text-4xl text-[#005f5e] mb-1">cloud_upload</span>
          <p className="text-xs font-bold text-[#131b2e]">
            {fileName ? `Uploaded: ${fileName}` : 'Click to select or drag & drop prescription image / PDF'}
          </p>
          <p className="text-[11px] text-[#6e7978] mt-0.5">Supports JPG, PNG, PDF up to 15MB</p>
        </div>

        {/* Scanning progress */}
        {isScanning && (
          <div className="my-4 p-3 bg-[#e2e7ff] rounded-xl space-y-2 border border-[#dae2fd]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#005f5e]">
              <span className="material-symbols-outlined text-base animate-spin">sync</span>
              <span>
                {scanStep === 1 && 'Scanning doctor handwriting & medical abbreviation tokens...'}
                {scanStep === 2 && 'Cross-referencing 1,800+ NABL diagnostic test codes...'}
                {scanStep === 3 && 'Evaluating fasting criteria & calculating bundled subsidized quote...'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#005f5e] transition-all duration-500 rounded-full"
                style={{ width: `${(scanStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Detected Test Items */}
        {activePreset && !isScanning && (
          <div className="mt-4 p-3.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff] space-y-3 animate-in fade-in">
            <div className="flex justify-between items-start pb-2 border-b border-[#dae2fd]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005f5e]">Clinical AI Extraction</span>
                <h4 className="text-xs font-bold text-[#131b2e]">{activePreset.title}</h4>
                <div className="text-[11px] text-[#3e4948]">{activePreset.doctor} • {activePreset.hospital}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#bdffdb] text-[#002113] text-[10px] font-bold shrink-0">
                100% Match
              </span>
            </div>

            <div className="space-y-1.5">
              {activePreset.detectedItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-white border border-[#eaedff]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#006242]">check_circle</span>
                    <span className="font-semibold text-[#131b2e]">{item.name}</span>
                    {item.fast !== 'No' && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#cce5ff] text-[#001d31] rounded">
                        Fasting {item.fast}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#005f5e]">₹{item.price}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown and action */}
            <div className="pt-2 border-t border-[#dae2fd] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#006242] font-bold">{activePreset.savingsText}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#005f5e]">₹{activePreset.discountedTotal}</span>
                  <span className="text-xs text-[#6e7978] line-through">₹{activePreset.originalTotal}</span>
                </div>
              </div>


              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookExtractedPackage(activePreset.title);
                }}
                className="px-4 py-2 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
              >
                <span>Book Extracted Tests</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Contact fields */}
        <div className="mt-4 space-y-2">
          <div>
            <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">
              Mobile Number for WhatsApp Quotation & Guidance
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">
              Special Patient Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Patient is bedridden, needs female phlebotomist, on blood thinners..."
              className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
