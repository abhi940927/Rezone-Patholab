import React from 'react';
import { WHATSAPP_DISPLAY, PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenReportModal: () => void;
  onOpenTracker: () => void;
  onOpenCorporate: () => void;
  onOpenDoctorsPortal: () => void;
  onOpenConsult: () => void;
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenReportModal,
  onOpenTracker,
  onOpenCorporate,
  onOpenDoctorsPortal,
  onOpenConsult,
  onScrollToSection
}) => {
  return (
    <footer className="w-full bg-[#f2f3ff] text-[#131b2e] mt-12 border-t border-[#eaedff]">
      <div className="w-full px-4 md:px-8 pt-12 pb-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                alt="ReZone Patholab Brand Logo" 
                className="h-8 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWLT6eEhnPezl83e3_JVcptUx-46zrAMB2v_IzPvDZo61hAONr5vfgS0Wxdp0951UzxFSySD2Y4HcJ5fDyjXDDHCZBgvDoYqNG5oopnaZvdJ3dDFK1q95yZbH7KlAfnBrGhyz1UhwyNAMmykBLZe2MZij0QYlMMzXaVy8psOeJ6FFTevOPu2Jla9YLvPXqKHer-iwC1BF13wSS7cFn0WUiQDlB30rT2FUvH1gfxnTgrnZPcYNY8PcE"
              />
              <span className="text-xl font-bold text-[#005f5e]">ReZone Patholab</span>
            </div>
            
            <p className="text-xs md:text-sm text-[#3e4948] max-w-md leading-relaxed">
              Precision diagnostic intelligence operating advanced molecular pathology and round-the-clock rapid diagnostics with automated cold-chain custody.
            </p>

            <div className="p-3 bg-white rounded-xl border border-[#dae2fd] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#005f5e]">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Our Laboratory Location:</span>
              </div>
              <p className="text-[#131b2e] font-semibold text-[11px] leading-snug">
                BDO block club road near parwati chandra hotel, Arrah, Bihar - 802301, India
              </p>
              <div className="pt-1 text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Doorstep Home Collection: Strictly available for Pincode 802301 only</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#005f5e] text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                NABL Accredited
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#005f5e] text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                CAP Certified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#006398] text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">health_and_safety</span>
                ICMR Approved
              </span>
            </div>
          </div>

          {/* Col 3: Diagnostic Tests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">Diagnostic Tests</h3>
            <ul className="space-y-2 text-xs text-[#3e4948]">
              <li>
                <button onClick={() => onScrollToSection('packagesSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Full Body Health Check
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('packagesSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Molecular Pathology
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('packagesSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Hematology & Biochemistry
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('packagesSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Thyroid & Endocrine Panels
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('packagesSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Diabetes Screening Profiles
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('packagesSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Genomic Sequencing
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Patient Services */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">Patient Services</h3>
            <ul className="space-y-2 text-xs text-[#3e4948]">
              <li>
                <button onClick={onOpenBooking} className="hover:text-[#005f5e] transition-colors text-left">
                  Home Blood Collection (45 Min)
                </button>
              </li>
              <li>
                <button onClick={onOpenReportModal} className="hover:text-[#005f5e] transition-colors text-left">
                  Download Digital Reports
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-[#005f5e] transition-colors text-left">
                  Track Phlebotomist
                </button>
              </li>
              <li>
                <button onClick={onOpenCorporate} className="hover:text-[#005f5e] transition-colors text-left">
                  Corporate Health Drives
                </button>
              </li>
              <li>
                <button onClick={onOpenConsult} className="hover:text-[#005f5e] transition-colors text-left">
                  Free Pathologist Consult
                </button>
              </li>
              <li>
                <a href="tel:+919279816571" className="hover:text-[#005f5e] transition-colors text-left flex items-center gap-1">
                  <span>Support: {PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a 
                  href={getWhatsAppUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#25D366] transition-colors text-left flex items-center gap-1 text-[#006242] font-semibold"
                >
                  <span className="material-symbols-outlined text-xs text-[#25D366]">chat</span>
                  <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
                </a>
              </li>

            </ul>
          </div>

          {/* Col 5: Clinician & Lab Portal */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#131b2e] uppercase tracking-wider">Clinician & Lab Portal</h3>
            <ul className="space-y-2 text-xs text-[#3e4948]">
              <li>
                <button onClick={onOpenDoctorsPortal} className="hover:text-[#005f5e] transition-colors text-left">
                  Doctor Portal Access
                </button>
              </li>
              <li>
                <button onClick={onOpenDoctorsPortal} className="hover:text-[#005f5e] transition-colors text-left">
                  LIS Integration & API
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('protocolSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Quality Standards & QC
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('protocolSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Clinical Research Trials
                </button>
              </li>
              <li>
                <button onClick={onOpenConsult} className="hover:text-[#005f5e] transition-colors text-left">
                  Contact Pathologists
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('heroSection')} className="hover:text-[#005f5e] transition-colors text-left">
                  Centres & Collection Points
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#3e4948]">
          <p>© 2026 ReZone Patholab Diagnostics Private Limited. All biological diagnostic rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-[#131b2e] cursor-pointer">HIPAA Compliant</span>
            <span className="hover:text-[#131b2e] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#131b2e] cursor-pointer">Terms of Clinical Service</span>
            <span className="hover:text-[#131b2e] cursor-pointer">Regulatory Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
