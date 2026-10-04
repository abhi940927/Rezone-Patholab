import React, { useState } from 'react';
import { WHATSAPP_DISPLAY, PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  onOpenBooking: (pkgName?: string) => void;
  onOpenReportModal: () => void;
  onOpenPrescriptionModal: () => void;
  onOpenTracker: () => void;
  onOpenConsult: () => void;
  onOpenDoctorsPortal: () => void;
  onOpenCorporate: () => void;
  onScrollToSection: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenReportModal,
  onOpenPrescriptionModal,
  onOpenTracker,
  onOpenConsult,
  onOpenDoctorsPortal,
  onOpenCorporate,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface">
      {/* Top Banner */}
      <div className="w-full bg-[#007a78] text-white py-1 px-4 md:px-8 flex items-center justify-between text-[11px] md:text-xs font-semibold tracking-wide border-b border-[#005f5e]">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <span className="material-symbols-outlined text-sm text-[#6ffbbe] animate-pulse">bolt</span>
          <span>Smart Home Sample Collection in 45 Mins across Metro Areas • NABL & CAP Accredited</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-white/90">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] font-bold text-[11px] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-xs">chat</span>
            <span>WhatsApp Appointment ({WHATSAPP_DISPLAY})</span>
          </a>
          <span className="flex items-center gap-1 text-[#abfffc]">
            <span className="material-symbols-outlined text-sm">verified</span>
            ISO 15189:2022 Certified
          </span>
          <a href="tel:+919905359191" className="flex items-center gap-1 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            <span>Support: {PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>


      {/* Main Navbar */}
      <div className="w-full bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.06)] border-b border-[#eaedff]">
        <div className="h-18 md:h-20 w-full px-4 md:px-8 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
          {/* Brand Logo */}
          <button 
            onClick={() => onScrollToSection('heroSection')}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer focus:outline-none"
          >
            <img 
              alt="ReZone Patholab Brand Logo" 
              className="h-8 md:h-9 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWLT6eEhnPezl83e3_JVcptUx-46zrAMB2v_IzPvDZo61hAONr5vfgS0Wxdp0951UzxFSySD2Y4HcJ5fDyjXDDHCZBgvDoYqNG5oopnaZvdJ3dDFK1q95yZbH7KlAfnBrGhyz1UhwyNAMmykBLZe2MZij0QYlMMzXaVy8psOeJ6FFTevOPu2Jla9YLvPXqKHer-iwC1BF13wSS7cFn0WUiQDlB30rT2FUvH1gfxnTgrnZPcYNY8PcE"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl md:text-2xl text-[#005f5e] tracking-tight leading-none">ReZone</span>
              <span className="text-[10px] md:text-[11px] font-bold text-[#3e4948] tracking-widest uppercase">Patholab</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <button 
              onClick={() => onScrollToSection('searchResultsSection')}
              className="px-3 py-2 rounded-lg text-[#3e4948] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors text-xs font-semibold cursor-pointer"
            >
              Test Menu & Packages
            </button>
            <button 
              onClick={() => onOpenBooking()}
              className="px-3 py-2 rounded-lg text-[#3e4948] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors text-xs font-semibold"
            >
              Home Blood Collection
            </button>
            <button 
              onClick={onOpenReportModal}
              className="px-3 py-2 rounded-lg text-[#3e4948] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors text-xs font-semibold"
            >
              Download Reports
            </button>
            <button 
              onClick={onOpenCorporate}
              className="px-3 py-2 rounded-lg text-[#3e4948] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors text-xs font-semibold"
            >
              Corporate Wellness
            </button>
            <button 
              onClick={() => onScrollToSection('protocolSection')}
              className="px-3 py-2 rounded-lg text-[#3e4948] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors text-xs font-semibold"
            >
              About Lab
            </button>
            <button 
              onClick={onOpenDoctorsPortal}
              className="px-3 py-2 rounded-lg text-[#3e4948] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors text-xs font-semibold"
            >
              Doctors Portal
            </button>
          </nav>

          {/* Action buttons & Profile */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Phone Badge */}
            <a 
              href="tel:+919905359191"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#cce5ff] text-[#001d31] text-xs font-semibold hover:bg-[#93ccff] transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-[#006398]">call</span>
              <span>{PHONE_DISPLAY}</span>
            </a>


            {/* Book CTA */}
            <button 
              onClick={() => onOpenBooking()}
              className="flex items-center gap-1.5 px-3.5 py-2 md:py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white transition-all shadow-[0_2px_8px_rgba(0,122,120,0.25)] text-xs md:text-sm font-semibold whitespace-nowrap active:scale-95"
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              <span className="hidden sm:inline">Book a Test / </span>
              <span>Home Visit</span>
            </button>

            {/* Profile Avatar with status trigger */}
            <button 
              onClick={onOpenReportModal}
              title="Patient Portal & Reports"
              className="flex items-center pl-1 cursor-pointer focus:outline-none relative group"
            >
              <img 
                alt="Patient Profile" 
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-[#97f2ef] ring-offset-1 group-hover:scale-105 transition-transform" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWDWSh8EA_1xaHOCMpMN0PRnNB47yj8cwHGIwIEmK9md7FhfcgZxNCoig3UE8ppr8bGMnGBygNI0TViSMYfbaM1Z-QDZdInxW995ScJ28UzXBF3MvZSbLG3RwhytQl7MMjquruh0u3hyXREWFyL7nk-6ZsOC0loIdv0xfmkMAXgmwzS2NL8weoRK6MwaC41izWgJqpIYikQeVjAQ6mYdQmq5HNP_mNeZ9WzKDH6yuFqV_lqToZbTvq"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006242] border-2 border-white rounded-full"></span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#131b2e] hover:bg-[#eaedff] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-2xl border-b border-[#eaedff] px-5 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#f2f3ff]">
            <a 
              href="tel:+919905359191"
              className="flex items-center justify-center gap-1 p-2 rounded-lg bg-[#cce5ff] text-[#001d31] text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-sm text-[#006398]">call</span>
              <span>Call Us</span>
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 p-2 rounded-lg bg-[#25D366] text-white text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>WhatsApp</span>
            </a>

            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
              className="flex items-center justify-center gap-1 p-2 rounded-lg bg-[#97f2ef] text-[#00201f] text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-sm">near_me</span>
              <span>Track</span>
            </button>
          </div>

          <div className="flex flex-col space-y-1.5 text-sm font-semibold text-[#131b2e]">
            <button
              onClick={() => { setMobileMenuOpen(false); onScrollToSection('searchResultsSection'); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#005f5e]">science</span>
                <span>Test Menu & Health Packages</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#6e7978]">chevron_right</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#006398]">directions_car</span>
                <span>Book Phlebotomist Home Visit</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113]">45 Mins</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenReportModal(); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#005f5e]">description</span>
                <span>Download Secure PDF Reports</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#6e7978]">chevron_right</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenPrescriptionModal(); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#007a78]">receipt_long</span>
                <span>Upload Doctor Prescription (AI Scan)</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#6e7978]">chevron_right</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenConsult(); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#006242]">medical_services</span>
                <span>Free Pathologist Tele-Consult</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#bdffdb] text-[#002113]">Free</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDoctorsPortal(); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#006398]">stethoscope</span>
                <span>Doctors & Hospital LIS Portal</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#6e7978]">chevron_right</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCorporate(); }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f2f3ff] text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#6e7978]">corporate_fare</span>
                <span>Corporate Employee Wellness</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#6e7978]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
