import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { BookingModal } from './components/BookingModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { PhlebotomistTrackerModal } from './components/PhlebotomistTrackerModal';
import { ParameterModal } from './components/ParameterModal';
import { PathologistConsultModal } from './components/PathologistConsultModal';
import { DoctorsPortalModal } from './components/DoctorsPortalModal';
import { CorporateWellnessModal } from './components/CorporateWellnessModal';
import { HEALTH_PACKAGES, POPULAR_TESTS, SERVICEABLE_PINCODES } from './data/mockData';
import { HealthPackage } from './types';
import { WHATSAPP_DISPLAY, getWhatsAppUrl, getWhatsAppBookingUrl } from './utils/whatsapp';

export default function App() {
  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<string | undefined>();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string>('RZ-BK-882194');
  const [parameterModalOpen, setParameterModalOpen] = useState(false);
  const [selectedPackageForParams, setSelectedPackageForParams] = useState<string>('ReZone Comprehensive Vital Plus');
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [doctorsPortalOpen, setDoctorsPortalOpen] = useState(false);
  const [corporateModalOpen, setCorporateModalOpen] = useState(false);

  // Home collection section state
  const [homeSectionSlot, setHomeSectionSlot] = useState<'45min' | 'morning' | 'custom'>('45min');
  const [homeSectionPackage, setHomeSectionPackage] = useState('ReZone Comprehensive Vital Plus');


  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [packageCategory, setPackageCategory] = useState<'all' | 'men' | 'women' | 'seniors'>('all');

  // FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq1');

  // Pincode checker in urgent CTA - defaulted to user's Bihar address
  const [pincodeInput, setPincodeInput] = useState('802301');
  const [pincodeResult, setPincodeResult] = useState<{
    text: string;
    isAvailable: boolean;
    area?: string;
    eta?: number;
  } | null>({
    text: '⚡ High Fleet Density in Bihar: 5 Certified Phlebotomists active near BDO Block, Club Road (near Parwati Chandra Hotel), Arrah. Doorstep collection ready in 28 mins.',
    isAvailable: true,
    area: 'BDO Block, Club Road (near Parwati Chandra Hotel), Arrah, Bihar - 802301',
    eta: 28
  });

  // Interactive Biometric Preview state (Sliders)
  const [hba1cVal, setHba1cVal] = useState(5.4);
  const [vitDVal, setVitDVal] = useState(24.2);
  const [tshVal, setTshVal] = useState(2.14);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleOpenBooking = (pkgName?: string) => {
    setSelectedPackageForBooking(pkgName);
    setBookingModalOpen(true);
  };

  const handleViewParameters = (pkgName: string) => {
    setSelectedPackageForParams(pkgName);
    setParameterModalOpen(true);
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = pincodeInput.trim();
    if (!code) return;

    const matched = SERVICEABLE_PINCODES[code];
    if (matched) {
      setPincodeResult({
        text: `⚡ High Fleet Density: ${matched.phlebosActive} Phlebotomists active near ${matched.area} (${matched.city}). Guaranteed doorstep collection in ${matched.etaMins} mins.`,
        isAvailable: true
      });
      showToast(`Instant slot confirmed for ${code} (${matched.city})`);
    } else {
      setPincodeResult({
        text: `⚡ Serviceable Metro Area: 3 Phlebotomists active near postal code ${code}. Earliest collection in 38 mins.`,
        isAvailable: true
      });
      showToast(`Dispatch available for postal code ${code}`);
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter packages based on category
  const filteredPackages = HEALTH_PACKAGES.filter(p => {
    if (packageCategory === 'all') return true;
    return p.category === packageCategory || (packageCategory === 'seniors' && p.category === 'seniors');
  });

  // Selected test category filter for catalog
  const [selectedTestCategory, setSelectedTestCategory] = useState<string>('all');

  // Filter tests based on search and selected category
  const filteredTests = POPULAR_TESTS.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    const matchesCategory = selectedTestCategory === 'all' || 
      t.category.toLowerCase().includes(selectedTestCategory.toLowerCase()) ||
      (selectedTestCategory === 'popular' && t.popular);

    if (!q) return matchesCategory;

    const nameMatch = t.name.toLowerCase().includes(q);
    const catMatch = t.category.toLowerCase().includes(q);
    const descMatch = t.description.toLowerCase().includes(q);
    const sampleMatch = t.sampleType.toLowerCase().includes(q);
    const keyMatch = t.keywords ? t.keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase())) : false;
    return (nameMatch || catMatch || descMatch || sampleMatch || keyMatch) && (selectedTestCategory === 'all' || matchesCategory);
  });

  // Search matching packages
  const searchMatchingPackages = HEALTH_PACKAGES.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    return p.name.toLowerCase().includes(q) ||
           p.tagline.toLowerCase().includes(q) ||
           p.keyIncludes.some(k => k.toLowerCase().includes(q)) ||
           p.departments.some(d => d.name.toLowerCase().includes(q) || d.tests.some(t => t.toLowerCase().includes(q)));
  });

  const handleSearchSubmit = (customQuery?: string) => {
    const targetQ = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (targetQ) {
      setSearchQuery(targetQ);
      setSearchResultsOpen(false);
      showToast(`Showing diagnostic test results for "${targetQ}"`);
      setTimeout(() => {
        const el = document.getElementById('searchResultsSection');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      showToast('Please type a test or biomarker to search');
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface flex flex-col relative selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Fixed Navigation Header */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onOpenConsult={() => setConsultModalOpen(true)}
        onOpenDoctorsPortal={() => setDoctorsPortalOpen(true)}
        onOpenCorporate={() => setCorporateModalOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Body with ample top clearance to prevent header overlap */}
      <main className="w-full pt-28 sm:pt-32 lg:pt-36 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* HERO SECTION */}
          <section id="heroSection" className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface pb-8 lg:pb-12">
            {/* Ambient biomedical background glow nodes */}
            <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-0"></div>
            <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none -z-0"></div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-margin pt-2 lg:pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                {/* Left Column: Copy, Smart Search, Actions */}
                <div className="lg:col-span-6 xl:col-span-7 space-y-space-md">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-high text-primary font-label-md text-label-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span className="material-symbols-outlined text-base text-primary">biotech</span>
                    <span>CAP & NABL Dual-Certified Precision Pathology</span>
                  </div>

                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                    Precision Pathology for{' '}
                    <span className="text-primary underline decoration-secondary-container decoration-wavy decoration-2">
                      Life-Critical Decisions.
                    </span>
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    AI-assisted robotic analysis, 99.98% diagnostic accuracy, and sterile doorstep sample collection within 45 minutes across all metropolitan zones.
                  </p>

                  {/* Interactive Test Finder & Search */}
                  <div className="w-full bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl p-space-sm shadow-md space-y-space-sm relative border border-surface-container">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs">
                      <div className="relative flex-1 flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-outline text-xl">search</span>
                        <input
                          className="w-full pl-10 pr-4 py-3 bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
                          id="testSearchInput"
                          placeholder="Search 1,800+ tests (e.g. Thyroid, HbA1c, Vitamin D, CBC, Creatinine)..."
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSearchResultsOpen(e.target.value.length > 0);
                          }}
                          onFocus={() => {
                            if (searchQuery.length > 0) setSearchResultsOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSearchSubmit();
                            }
                          }}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResultsOpen(false);
                            }}
                            className="absolute right-3 text-outline hover:text-on-surface text-sm"
                          >
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        )}
                      </div>

                      <button
                        className="px-space-md py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-space-xs shrink-0 cursor-pointer active:scale-95"
                        id="searchButton"
                        onClick={() => handleSearchSubmit()}
                      >
                        <span className="material-symbols-outlined text-base">saved_search</span>
                        <span>Find Test</span>
                      </button>
                    </div>

                    {/* Search Results Autocomplete Dropdown */}
                    {searchResultsOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-surface-container-high z-50 max-h-80 overflow-y-auto p-2">
                        <div className="flex justify-between items-center px-2 py-1.5 border-b border-surface-container text-[11px] font-bold text-on-surface-variant">
                          <span className="flex items-center gap-1 text-[#005f5e]">
                            <span className="material-symbols-outlined text-xs">science</span>
                            <span>MATCHING DIAGNOSTIC ASSAYS ({filteredTests.length})</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSearchSubmit()}
                              className="text-[#005f5e] font-bold hover:underline text-[10px]"
                            >
                              View On Page
                            </button>
                            <button 
                              onClick={() => setSearchResultsOpen(false)}
                              className="text-slate-400 hover:text-slate-700 text-[10px]"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                        {filteredTests.length > 0 ? (
                          <div className="divide-y divide-surface-container-low">
                            {filteredTests.map((test) => (
                              <div
                                key={test.id}
                                className="p-2.5 hover:bg-surface-container-low rounded-lg transition-colors flex items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                    <span>{test.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-secondary font-medium">
                                      {test.category}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                                    {test.parametersCount} Params • {test.sampleType} • {test.tatHours}-Hr TAT
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="text-right">
                                    <div className="text-xs font-bold text-primary">₹{test.discountedPrice}</div>
                                    <div className="text-[10px] text-outline line-through">₹{test.originalPrice}</div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSearchResultsOpen(false);
                                      handleOpenBooking(test.name);
                                    }}
                                    className="px-2.5 py-1 rounded bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Book
                                  </button>
                                  <a
                                    href={getWhatsAppBookingUrl({
                                      packageName: test.name,
                                      address: 'BDO block club road near parwati chandra hotel, Arrah, Bihar',
                                      pincode: '802301'
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                                    title="Book on WhatsApp"
                                  >
                                    <span className="material-symbols-outlined text-sm">chat</span>
                                  </a>
                                </div>
                              </div>
                            ))}
                            <div className="p-2 border-t border-slate-100 bg-[#f8fafe] rounded-b-lg text-center">
                              <button
                                onClick={() => handleSearchSubmit()}
                                className="text-xs font-bold text-[#005f5e] hover:underline flex items-center justify-center gap-1 mx-auto"
                              >
                                <span>Show all {filteredTests.length} results in full section below</span>
                                <span className="material-symbols-outlined text-xs">arrow_downward</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-xs text-on-surface-variant">
                            No exact test found for "{searchQuery}". Our clinical pathologist will map your custom requirements.
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <button
                                onClick={() => {
                                  setSearchResultsOpen(false);
                                  setPrescriptionModalOpen(true);
                                }}
                                className="text-primary font-bold hover:underline"
                              >
                                Upload Prescription
                              </button>
                              <span>•</span>
                              <button
                                onClick={() => {
                                  setSearchQuery('');
                                  setSearchResultsOpen(false);
                                }}
                                className="text-slate-500 hover:underline"
                              >
                                Clear Search
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Pill Filters */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-space-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0 mr-1">
                        Trending:
                      </span>
                      {[
                        'Full Body Checkup',
                        'Thyroid Profile (T3, T4, TSH)',
                        'HbA1c Diabetes',
                        'Vitamin D3 & B12',
                        'CBC Complete',
                        'Creatinine / Kidney',
                        'Lipid Profile',
                        'Liver (LFT)'
                      ].map((term) => (
                        <button
                          key={term}
                          className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors cursor-pointer"
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearchSubmit(term);
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SCHEDULE HOME SAMPLE COLLECTION SECTION - Prominently visible below search bar */}
                  <div
                    id="scheduleHomeCollectionSection"
                    className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-xl border-2 border-[#005f5e]/30 space-y-3 relative overflow-hidden"
                  >
                    {/* Top gradient highlight strip */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#005f5e] via-[#007a78] to-[#10b981]"></div>

                    {/* Section Title & Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f7f6] text-[#005f5e] flex items-center justify-center shrink-0 shadow-sm border border-[#005f5e]/20">
                          <span className="material-symbols-outlined text-2xl">home_health</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                              Schedule Home Sample Collection
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-extrabold text-[10px] border border-emerald-300">
                              45m ETA
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Sterile painless vacuum blood draw by certified phlebotomists at your doorstep
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 font-bold text-[11px] border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                          <span>5 Active Phlebos</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#005f5e] font-extrabold text-[11px]">
                          ₹0 Fee
                        </span>
                      </div>
                    </div>

                    {/* Verified Location Box */}
                    <div className="bg-[#f8fafe] p-3 rounded-xl border border-[#dae2fd] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-[#005f5e]">location_on</span>
                          Collection Location (Serviceable)
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          PIN: 802301 Confirmed
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        BDO block club road near parwati chandra hotel, Arrah, Bihar - 802301, India
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-slate-600 pt-0.5">
                        <span className="flex items-center gap-1 text-[#006242] font-semibold">
                          <span className="material-symbols-outlined text-xs">bolt</span>
                          Doorstep Arrival: <strong>~35–45 Mins</strong>
                        </span>
                        <span className="flex items-center gap-1 text-[#005f5e] font-semibold">
                          <span className="material-symbols-outlined text-xs">ac_unit</span>
                          IoT Cold Vault: <strong>Active 4.1°C</strong>
                        </span>
                      </div>
                    </div>

                    {/* Slot Picker & Package Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">
                          Select Collection Slot:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setHomeSectionSlot('45min')}
                            className={`p-1.5 rounded-lg text-center border text-[11px] font-bold transition-all cursor-pointer ${
                              homeSectionSlot === '45min'
                                ? 'bg-[#005f5e] text-white border-[#005f5e] shadow-sm ring-2 ring-[#005f5e]/20'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-[#005f5e]'
                            }`}
                          >
                            ⚡ 45m Express
                          </button>
                          <button
                            type="button"
                            onClick={() => setHomeSectionSlot('morning')}
                            className={`p-1.5 rounded-lg text-center border text-[11px] font-bold transition-all cursor-pointer ${
                              homeSectionSlot === 'morning'
                                ? 'bg-[#005f5e] text-white border-[#005f5e] shadow-sm ring-2 ring-[#005f5e]/20'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-[#005f5e]'
                            }`}
                          >
                            🌅 Fasting AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setHomeSectionSlot('custom')}
                            className={`p-1.5 rounded-lg text-center border text-[11px] font-bold transition-all cursor-pointer ${
                              homeSectionSlot === 'custom'
                                ? 'bg-[#005f5e] text-white border-[#005f5e] shadow-sm ring-2 ring-[#005f5e]/20'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-[#005f5e]'
                            }`}
                          >
                            📅 Custom
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">
                          Select Test / Health Package:
                        </label>
                        <select
                          value={homeSectionPackage}
                          onChange={(e) => setHomeSectionPackage(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#f2f3ff] text-slate-900 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                        >
                          {HEALTH_PACKAGES.map((pkg) => (
                            <option key={pkg.id} value={pkg.name}>
                              {pkg.name} ({pkg.parametersCount} Params) - ₹{pkg.discountedPrice}
                            </option>
                          ))}
                          {POPULAR_TESTS.slice(0, 10).map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name} - ₹{t.discountedPrice}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Direct Dispatch & WhatsApp Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenBooking(homeSectionPackage)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#005f5e] to-[#007a78] hover:from-[#004e4d] hover:to-[#006a68] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">directions_car</span>
                        <span>Confirm Home Collection Dispatch</span>
                      </button>

                      <a
                        href={getWhatsAppBookingUrl({
                          packageName: homeSectionPackage,
                          slot: homeSectionSlot === '45min' ? '45-Min Express Slot' : homeSectionSlot === 'morning' ? 'Morning Fasting (6:30 - 9:30 AM)' : 'Custom Slot',
                          address: 'BDO block club road near parwati chandra hotel, Arrah, Bihar',
                          pincode: '802301'
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-center"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>Book on WhatsApp ({WHATSAPP_DISPLAY})</span>
                      </a>

                      <button
                        onClick={() => setPrescriptionModalOpen(true)}
                        className="px-3 py-3 rounded-xl bg-[#f2f3ff] hover:bg-[#dae2fd] text-[#005f5e] font-bold text-xs border border-[#dae2fd] flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                        title="Upload prescription for automatic test matching"
                      >
                        <span className="material-symbols-outlined text-base">receipt_long</span>
                        <span>Upload Rx</span>
                      </button>
                    </div>

                    {/* Trust Highlights */}
                    <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-100 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-600 font-bold">check_circle</span>
                        Zero Home Collection Fee (₹0)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-600 font-bold">check_circle</span>
                        Sterile Sealed Butterfly Needles
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-600 font-bold">check_circle</span>
                        Continuous 2°C - 8°C Cold Chain
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-600 font-bold">check_circle</span>
                        Digital PDF on WhatsApp
                      </span>
                    </div>
                  </div>


                  {/* Live Security Badges */}
                  <div className="flex items-center gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm flex-wrap">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-base">verified</span>
                      <span>NABL ISO 15189:2022</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-base">lock</span>
                      <span>256-Bit HIPAA Encrypted</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-base">science</span>
                      <span>Robotic Dual Validation</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Laboratory Image with Telemetry - Anti-Overlap Layout */}
                <div className="lg:col-span-6 xl:col-span-5 relative mt-4 lg:mt-0 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-surface-container-low border border-surface-container-high">
                    <img
                      alt="High-tech ReZone automated clinical diagnostic laboratory line with optical robotic analyzers and medical technician"
                      className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover scale-100 hover:scale-105 transition-transform duration-700"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEa8r99x8ce15NkWgjc0Zpob7Shhatvdjpsz1BiRyzI1Mx2ml2uDl6NjW0kq4E0nBohYvKPbjl8DX6Y7sFKDVvbKUBJ5d-mtLX4bDEh5zFYD4YBO5lUZTroUPQeI6SQz_adNNjL6XTCvKJXBCahhR03WpWbsCJiEMlhCLQ46aUxFYKN7U0WjyUGcWoJ6oU87bA0UqTQJIAEGbtlhLjO5NpbRoDdp91bo3uC5nNJYNVfsQKr02wQH0d"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/15 to-transparent pointer-events-none"></div>

                    {/* Non-overlapping Top Badge: Lab Line Online */}
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md rounded-xl p-2 px-3 shadow-md flex items-center gap-2 border border-white/60">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                      <span className="text-xs font-bold text-slate-900">
                        Lab Line Alpha: <strong className="text-emerald-700">Online</strong> (99.98% Spec.)
                      </span>
                    </div>

                    {/* Non-overlapping Bottom Badge: IoT Cold Chain Shield */}
                    <div 
                      onClick={() => setTrackerModalOpen(true)}
                      className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-xl rounded-xl p-2.5 px-3.5 shadow-lg max-w-[250px] border border-white/70 cursor-pointer group hover:bg-white transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-[#6ffbbe] text-[#002113] material-symbols-outlined text-base group-hover:animate-spin">ac_unit</span>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-600">Active IoT Specimen Shield</p>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <span>100% Cold-Chain Monitored</span>
                            <span className="material-symbols-outlined text-xs text-[#005f5e]">arrow_forward</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Docked Telemetry Bar Below Image - Guaranteed Zero Overlap on All Screens */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white rounded-xl p-3 shadow-md border border-[#dae2fd] flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#cce5ff] text-[#006398] material-symbols-outlined text-xl shrink-0">bolt</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Turnaround Velocity</p>
                        <p className="text-sm font-extrabold text-slate-900">6-Hr Rapid TAT</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 shadow-md border border-[#dae2fd] flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#dae2fd] text-[#005f5e] material-symbols-outlined text-xl shrink-0">precision_manufacturing</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Robotic Instrumentation</p>
                        <p className="text-sm font-extrabold text-slate-900">450+ Analyzers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK ACTION & TRACKING STRIP - With positive top margin to prevent overlapping */}
          <section className="w-full max-w-[1440px] mx-auto px-margin mt-8 lg:mt-12 relative z-20" id="quickBookingStrip">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {/* Card 1 */}
              <div
                className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md hover:shadow-xl transition-all group cursor-pointer border border-surface-container"
                onClick={() => setReportModalOpen(true)}
              >
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">description</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    Instant OTP
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  Download Test Report
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Enter registered Mobile number or barcode Patient ID for digital records.
                </p>
                <div className="mt-space-sm flex items-center gap-space-xs font-label-md text-label-md text-secondary">
                  <span>Fetch Secure PDF</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md hover:shadow-xl transition-all group cursor-pointer border border-surface-container"
                onClick={() => handleOpenBooking()}
              >
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-xl">directions_car</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                    45 Mins Fast
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                  Book Phlebotomist
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Painless vacuum needles, certified phlebotomists & live GPS tracking.
                </p>
                <div className="mt-space-sm flex items-center gap-space-xs font-label-md text-label-md text-secondary">
                  <span>Select Time Slot</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md hover:shadow-xl transition-all group cursor-pointer border border-surface-container"
                onClick={() => setPrescriptionModalOpen(true)}
              >
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">upload_file</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                    AI-Parsed
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  Upload Prescription
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Our clinical AI parses tests in 90s. Pharmacist verifies and assigns discounts.
                </p>
                <div className="mt-space-sm flex items-center gap-space-xs font-label-md text-label-md text-primary">
                  <span>Drop Prescription File</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>

              {/* Card 4 */}
              <div
                className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md hover:shadow-xl transition-all group cursor-pointer border border-surface-container"
                onClick={() => setConsultModalOpen(true)}
              >
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined text-xl">medical_services</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                    Complimentary
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-tertiary transition-colors">
                  Consult a Pathologist
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Free 1-on-1 tele-consultation to translate complex lab markers into plain terms.
                </p>
                <div className="mt-space-sm flex items-center gap-space-xs font-label-md text-label-md text-tertiary">
                  <span>Speak with MD Specialist</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </div>
          </section>

          {/* DEDICATED SEARCH RESULTS & DIAGNOSTIC TESTS SECTION */}
          <section id="searchResultsSection" className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
              <div className="space-y-space-xs">
                {searchQuery.trim() ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f7f6] text-[#005f5e] font-extrabold text-xs border border-[#005f5e]/20">
                    <span className="material-symbols-outlined text-sm">search</span>
                    <span>ACTIVE SEARCH RESULTS</span>
                  </div>
                ) : (
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#005f5e] font-bold">
                    Individual Clinical Assays
                  </span>
                )}
                
                <h2 className="font-headline-xl text-headline-xl text-on-surface">
                  {searchQuery.trim() ? (
                    <span>
                      Matching Tests for &ldquo;<span className="text-[#005f5e]">{searchQuery}</span>&rdquo; ({filteredTests.length})
                    </span>
                  ) : (
                    'Diagnostic Test Catalog & Biomarkers'
                  )}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  {searchQuery.trim() ? (
                    `Found ${filteredTests.length} diagnostic assays matching your query. All tests include sterile home sample collection with verified cold-chain protocol.`
                  ) : (
                    'Select from over 1,800+ dual-certified clinical tests. Direct doorstep phlebotomist dispatch with guaranteed 4–6 hour digital reporting.'
                  )}
                </p>
              </div>

              {/* Clear Search & Category Filters */}
              <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTestCategory('all');
                      showToast('Search cleared. Showing all tests.');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    <span>Clear Search</span>
                  </button>
                )}
              </div>
            </div>

            {/* Test Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-space-md">
              {[
                { id: 'all', label: `All Tests (${POPULAR_TESTS.length})` },
                { id: 'popular', label: '★ Most Popular' },
                { id: 'diabetes', label: 'Diabetes & Sugar' },
                { id: 'endocrinology', label: 'Thyroid & Hormones' },
                { id: 'cardiac', label: 'Cardiac & Lipid' },
                { id: 'renal', label: 'Kidney & Creatinine' },
                { id: 'vitamins', label: 'Vitamins & Minerals' },
                { id: 'hematology', label: 'Blood & Infections' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedTestCategory(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedTestCategory === tab.id
                      ? 'bg-[#005f5e] text-white shadow-sm ring-2 ring-[#005f5e]/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Matching Whole-Body Health Packages Banner (when searching) */}
            {searchQuery.trim() && searchMatchingPackages.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#e6f7f6] via-[#f0f9f8] to-[#e6f0fa] border border-[#005f5e]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl text-[#005f5e]">verified</span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Looking for comprehensive screening? {searchMatchingPackages.length} Whole-Body Package(s) include &ldquo;{searchQuery}&rdquo;:
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#005f5e] bg-white px-2 py-0.5 rounded-full shadow-sm">
                    High Value Bundle
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {searchMatchingPackages.map((pkg) => (
                    <div key={pkg.id} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{pkg.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{pkg.parametersCount} Parameters • Fasting {pkg.fastingHours}h</div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-sm font-extrabold text-[#005f5e]">₹{pkg.discountedPrice}</span>
                          <span className="text-[11px] text-slate-400 line-through">₹{pkg.originalPrice}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">Save {pkg.discountPercentage}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenBooking(pkg.name)}
                          className="px-2.5 py-1.5 bg-[#005f5e] hover:bg-[#004e4d] text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Book Package
                        </button>
                        <a
                          href={getWhatsAppBookingUrl({
                            packageName: pkg.name,
                            address: 'BDO block club road near parwati chandra hotel, Arrah, Bihar',
                            pincode: '802301'
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Cards Grid */}
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                {filteredTests.map((test) => {
                  const savePercentage = Math.round(((test.originalPrice - test.discountedPrice) / test.originalPrice) * 100);
                  return (
                    <div
                      key={test.id}
                      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-200 flex flex-col justify-between group hover:border-[#005f5e]/40 relative overflow-hidden"
                    >
                      {/* Top ribbon highlight */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005f5e] to-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#e6f7f6] text-[#005f5e] border border-[#005f5e]/20">
                            {test.category}
                          </span>
                          <div className="flex items-center gap-1">
                            {test.popular && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[11px] text-amber-700">star</span>
                                <span>POPULAR</span>
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                              {test.tatHours}-Hr TAT
                            </span>
                          </div>
                        </div>

                        {/* Test Name */}
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#005f5e] transition-colors leading-snug">
                          {test.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                          {test.description}
                        </p>

                        {/* Key Assay Metadata Pills */}
                        <div className="mt-3 py-2 px-2.5 rounded-xl bg-[#f8fafe] border border-slate-100 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">Parameters:</span>
                            <span className="font-bold">{test.parametersCount} {test.parametersCount > 1 ? 'Tests' : 'Assay'}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">Sample Specimen:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[130px]">{test.sampleType}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">Fasting:</span>
                            <span className={`font-semibold ${test.fastingHours > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                              {test.fastingHours > 0 ? `${test.fastingHours} Hours Fasting` : 'No Fasting Req.'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Booking Buttons */}
                      <div className="pt-3 mt-3 border-t border-slate-100">
                        {/* Rupees Pricing */}
                        <div className="flex items-baseline justify-between mb-2.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-[#005f5e]">₹{test.discountedPrice}</span>
                            <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                            {savePercentage}% OFF
                          </span>
                        </div>

                        {/* Zero Collection Fee */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-600 mb-2 font-medium">
                          <span className="material-symbols-outlined text-xs text-emerald-600 font-bold">check_circle</span>
                          <span>Doorstep Collection: <strong>FREE (₹0)</strong></span>
                        </div>

                        {/* Dual Action Buttons: Home Booking + WhatsApp */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenBooking(test.name)}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#005f5e] to-[#007a78] hover:from-[#004e4d] hover:to-[#006a68] text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">home_pin</span>
                            <span>Book Home Visit</span>
                          </button>

                          <a
                            href={getWhatsAppBookingUrl({
                              packageName: test.name,
                              address: 'BDO block club road near parwati chandra hotel, Arrah, Bihar',
                              pincode: '802301'
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow transition-all active:scale-95 cursor-pointer shrink-0"
                            title={`Book ${test.name} on WhatsApp`}
                          >
                            <span className="material-symbols-outlined text-base">chat</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State when no tests match */
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-slate-300 space-y-4 max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#e6f7f6] text-[#005f5e] flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined text-3xl">science</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    No direct catalog match for &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Don&rsquo;t worry! Our central NABL laboratory performs over 1,800+ specialized molecular and clinical assays. You can upload your doctor&rsquo;s handwritten prescription or consult our pathologist.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTestCategory('all');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    View All Popular Tests
                  </button>
                  <button
                    onClick={() => setPrescriptionModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#005f5e] hover:bg-[#004e4d] text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>Upload Doctor Prescription (Rx)</span>
                  </button>
                  <a
                    href={getWhatsAppUrl(`Hello ReZone Patholab, I need to check availability of this test: "${searchQuery}" for address: BDO block club road near parwati chandra hotel, Arrah, Bihar (802301).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Ask On WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* POPULAR PREVENTIVE HEALTH CHECKUP PACKAGES */}
          <section id="packagesSection" className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
              <div className="space-y-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Preventive Diagnostic Intelligence
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">Curated Whole-Body Health Packages</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Comprehensive clinical screenings engineered to detect physiological anomalies up to 36 months before symptoms manifest.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-space-xs shrink-0 bg-surface-container-low p-1 rounded-xl">
                {(['all', 'men', 'women', 'seniors'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setPackageCategory(cat);
                      showToast(`Showing ${cat === 'all' ? 'All Packages' : cat.toUpperCase() + ' Health Packages'}`);
                    }}
                    className={`px-space-sm py-1.5 rounded-lg font-label-md text-label-md capitalize transition-colors cursor-pointer ${
                      packageCategory === cat
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {cat === 'all' ? 'All Ages' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Package Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
              {filteredPackages.map((pkg) => {
                const isFeatured = pkg.isRecommended;
                return (
                  <div
                    key={pkg.id}
                    className={`flex flex-col rounded-2xl p-space-md transition-all duration-300 relative group border ${
                      isFeatured
                        ? 'bg-surface-container-lowest shadow-xl scale-[1.02] border-primary/30 bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest to-surface-container-high/40'
                        : 'bg-surface-container-lowest shadow-md hover:shadow-xl border-surface-container'
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm tracking-wide shadow-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">hotel_class</span>
                        <span>MOST RECOMMENDED</span>
                      </div>
                    )}

                    <div className={`flex items-center justify-between pb-space-xs ${isFeatured ? 'mt-2' : ''}`}>
                      <span className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm font-semibold ${
                        isFeatured ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface'
                      }`}>
                        {pkg.parametersCount} Parameters
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                        {pkg.discountPercentage}% OFF
                      </span>
                    </div>

                    <h3 className={`font-headline-sm text-headline-sm text-on-surface pt-space-xs group-hover:text-primary transition-colors ${
                      isFeatured ? 'text-primary font-bold' : ''
                    }`}>
                      {pkg.name}
                    </h3>

                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    <div className={`my-space-sm py-space-xs px-space-sm rounded-lg space-y-1 ${
                      isFeatured ? 'bg-surface-container-high' : 'bg-surface-container-low'
                    }`}>
                      <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                        <span>Fasting: {pkg.fastingHours} Hours Required</span>
                      </div>
                      <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                        <span className="truncate">{pkg.keyIncludes[0]}</span>
                      </div>
                      <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-tertiary">
                        <span className="material-symbols-outlined text-sm">home_pin</span>
                        <span>{pkg.perks[0]}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-space-sm flex items-baseline gap-space-xs">
                      <span className={`font-headline-lg text-headline-lg font-bold ${
                        isFeatured ? 'text-primary' : 'text-on-surface'
                      }`}>
                        ₹{pkg.discountedPrice}
                      </span>
                      <span className="font-body-md text-body-md text-outline line-through">
                        ₹{pkg.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded ml-auto">
                        Save {pkg.discountPercentage}%
                      </span>
                    </div>

                    <div className="mt-space-sm flex flex-col gap-space-xs">
                      <div className="flex gap-1.5">
                        <button
                          className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                          onClick={() => handleOpenBooking(pkg.name)}
                        >
                          <span>{isFeatured ? 'Book (Same-Day)' : 'Book Slot'}</span>
                          <span className="material-symbols-outlined text-base">
                            {isFeatured ? 'bolt' : 'calendar_add_on'}
                          </span>
                        </button>
                        <a
                          href={getWhatsAppBookingUrl({
                            packageName: pkg.name,
                            address: 'BDO block club road near parwati chandra hotel, Arrah, Bihar',
                            pincode: '802301'
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-sm transition-all"
                          title="Book on WhatsApp"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                        </a>
                      </div>

                      <button
                        className="w-full py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors cursor-pointer"
                        onClick={() => handleViewParameters(pkg.name)}
                      >
                        View All {pkg.parametersCount} Parameters
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* THE REZONE PRECISION ADVANTAGE (Creative interactive visual section) */}
          <section id="protocolSection" className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl">
            <div className="bg-surface-container-low rounded-3xl p-space-md sm:p-space-lg lg:p-space-xl shadow-inner relative overflow-hidden border border-surface-container">
              <div className="max-w-2xl mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Surgical Standard Protocols
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface mt-1">
                  Why 10,000+ Physicians Rely On ReZone Diagnostic Intelligence
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Laboratory errors alter lives. Our robotic workflow eliminates human transfer variables from the instant the sample is collected to molecular validation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {/* Feature 1 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-surface-container">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Dual-Verification Protocol
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    Every anomalous biomarker or critical value is independently cross-analyzed and co-signed by two Senior MD Pathologists prior to clinical release.
                  </p>
                  <div className="mt-4 pt-3 flex items-center justify-between text-label-sm font-label-sm text-primary border-t border-surface-container-low">
                    <span>Accuracy Rate</span>
                    <span className="font-bold">99.98%</span>
                  </div>
                  {/* SVG sparkline accuracy */}
                  <div className="w-full h-8 mt-1 text-primary">
                    <svg className="w-full h-full stroke-current fill-none stroke-2" viewBox="0 0 100 24">
                      <path d="M0,20 Q20,18 40,8 T70,4 T100,2"></path>
                    </svg>
                  </div>
                </div>

                {/* Feature 2 */}
                <div 
                  onClick={() => setTrackerModalOpen(true)}
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-surface-container cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary mb-space-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">device_thermostat</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-secondary transition-colors">
                    Smart Cold-Chain IoT Fleet
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    Active insulated transport vaults continuously transmit GPS location and live tube temperature logs (2°C - 8°C) to the central laboratory intake.
                  </p>
                  <div className="mt-4 pt-3 flex items-center justify-between text-label-sm font-label-sm text-secondary border-t border-surface-container-low">
                    <span>Real-time Variance</span>
                    <span className="font-bold">±0.2°C Tolerated</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary-fixed mt-3 overflow-hidden">
                    <div className="h-full bg-secondary rounded-full w-11/12 animate-pulse"></div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-surface-container">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-sm">
                    <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Zero Sample Mix-Up
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    2D Cryo-resistant matrix barcodes printed directly at patient bedside. Optical robotic arms route tubes automatically without manual relabeling.
                  </p>
                  <div className="mt-4 pt-3 flex items-center justify-between text-label-sm font-label-sm text-tertiary border-t border-surface-container-low">
                    <span>Traceability</span>
                    <span className="font-bold">100% Chain-of-Custody</span>
                  </div>
                  {/* Barcode simulation */}
                  <div className="flex items-center gap-1 mt-3 h-5">
                    <span className="w-1 h-full bg-on-surface-variant"></span>
                    <span className="w-2 h-full bg-on-surface"></span>
                    <span className="w-0.5 h-full bg-outline"></span>
                    <span className="w-1.5 h-full bg-on-surface"></span>
                    <span className="w-1 h-full bg-outline"></span>
                    <span className="w-3 h-full bg-on-surface"></span>
                    <span className="w-0.5 h-full bg-outline"></span>
                    <span className="w-2 h-full bg-on-surface"></span>
                    <span className="w-1 h-full bg-outline"></span>
                    <span className="w-0.5 h-full bg-on-surface"></span>
                    <span className="w-2 h-full bg-on-surface"></span>
                  </div>
                </div>

                {/* Feature 4 */}
                <div 
                  onClick={() => setReportModalOpen(true)}
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-surface-container cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-space-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">insights</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Interactive Smart Reports
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    No cryptic multi-page PDFs. We provide intuitive biological sliders, 5-year longitudinal trend graphs, and personalized lifestyle health recommendations.
                  </p>
                  <div className="mt-4 pt-3 flex items-center justify-between text-label-sm font-label-sm text-primary border-t border-surface-container-low">
                    <span>Patient Comprehension</span>
                    <span className="font-bold">4.9 / 5.0 Star</span>
                  </div>
                  <div className="w-full flex items-center gap-1 mt-3">
                    <span className="h-2 flex-1 rounded-l bg-primary-fixed"></span>
                    <span className="h-2 flex-1 bg-tertiary-fixed"></span>
                    <span className="h-2 flex-1 rounded-r bg-secondary-fixed"></span>
                  </div>
                </div>
              </div>

              {/* Sample Report Interactive Teaser */}
              <div className="mt-space-lg bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-surface-container">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-xs">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                      <span className="font-label-md text-label-md text-primary uppercase">
                        Interactive Telemetry Preview
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                      Real-time Biometric Reference Track (Specimen #RZ-99420-BIO)
                    </h4>
                  </div>
                  <button 
                    onClick={() => setReportModalOpen(true)}
                    className="font-label-sm text-label-sm text-primary hover:text-on-primary hover:bg-primary bg-surface-container px-3 py-1 rounded-full self-start md:self-auto transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Live Patient Demo View</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-center">
                  {/* Metric 1: HbA1c */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm border border-surface-container">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-md text-label-md text-on-surface">Glycated HbA1c</span>
                      <span className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded ${
                        hba1cVal < 5.7 ? 'text-tertiary bg-tertiary-fixed/30' : 'text-error bg-error-container'
                      }`}>
                        {hba1cVal < 5.7 ? 'OPTIMAL' : 'ELEVATED'}
                      </span>
                    </div>
                    <div className="text-headline-md font-headline-md text-on-surface flex items-baseline gap-1">
                      <span>{hba1cVal}</span>
                      <span className="text-body-sm font-body-sm text-outline">%</span>
                    </div>

                    <div className="relative w-full h-3 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                      <div className="absolute left-0 w-2/3 h-full bg-gradient-to-r from-tertiary-fixed to-tertiary"></div>
                      <div
                        className="absolute top-0 bottom-0 w-1.5 bg-on-surface shadow transition-all duration-300"
                        style={{ left: `${Math.min(95, Math.max(5, (hba1cVal / 7.0) * 100))}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-label-sm font-label-sm text-outline mt-1">
                      <span>&lt;5.7% (Normal)</span>
                      <span>&gt;6.5% (Diabetic)</span>
                    </div>

                    {/* Interactive slider for testing */}
                    <div className="mt-3 pt-2 border-t border-surface-container flex items-center gap-2 text-[10px]">
                      <span className="text-outline">Test Value:</span>
                      <input 
                        type="range" 
                        min="4.5" 
                        max="7.5" 
                        step="0.1" 
                        value={hba1cVal} 
                        onChange={(e) => setHba1cVal(Number(e.target.value))} 
                        className="flex-1 accent-primary h-1" 
                      />
                    </div>
                  </div>

                  {/* Metric 2: 25-OH Vitamin D3 */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm border border-surface-container">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-md text-label-md text-on-surface">25-OH Vitamin D Total</span>
                      <span className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded ${
                        vitDVal >= 30 ? 'text-tertiary bg-tertiary-fixed/30' : 'text-secondary bg-secondary-fixed/50'
                      }`}>
                        {vitDVal >= 30 ? 'SUFFICIENT' : 'MILD DEFICIENCY'}
                      </span>
                    </div>
                    <div className="text-headline-md font-headline-md text-on-surface flex items-baseline gap-1">
                      <span>{vitDVal}</span>
                      <span className="text-body-sm font-body-sm text-outline">ng/mL</span>
                    </div>

                    <div className="relative w-full h-3 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                      <div className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-secondary-container to-secondary"></div>
                      <div
                        className="absolute top-0 bottom-0 w-1.5 bg-on-surface shadow transition-all duration-300"
                        style={{ left: `${Math.min(95, Math.max(5, (vitDVal / 60) * 100))}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-label-sm font-label-sm text-outline mt-1">
                      <span>Deficient (&lt;30)</span>
                      <span>Sufficient (30-100)</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-surface-container flex items-center gap-2 text-[10px]">
                      <span className="text-outline">Test Value:</span>
                      <input 
                        type="range" 
                        min="10" 
                        max="60" 
                        step="0.5" 
                        value={vitDVal} 
                        onChange={(e) => setVitDVal(Number(e.target.value))} 
                        className="flex-1 accent-secondary h-1" 
                      />
                    </div>
                  </div>

                  {/* Metric 3: Thyroid Stimulating Hormone */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm border border-surface-container">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-md text-label-md text-on-surface">TSH (Ultrasensitive)</span>
                      <span className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded ${
                        tshVal >= 0.4 && tshVal <= 4.5 ? 'text-tertiary bg-tertiary-fixed/30' : 'text-error bg-error-container'
                      }`}>
                        {tshVal >= 0.4 && tshVal <= 4.5 ? 'EUTHYROID' : 'ABNORMAL'}
                      </span>
                    </div>
                    <div className="text-headline-md font-headline-md text-on-surface flex items-baseline gap-1">
                      <span>{tshVal}</span>
                      <span className="text-body-sm font-body-sm text-outline">μIU/mL</span>
                    </div>

                    <div className="relative w-full h-3 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
                      <div className="absolute left-1/4 w-1/2 h-full bg-gradient-to-r from-tertiary-fixed to-primary"></div>
                      <div
                        className="absolute top-0 bottom-0 w-1.5 bg-on-surface shadow transition-all duration-300"
                        style={{ left: `${Math.min(95, Math.max(5, (tshVal / 6.0) * 100))}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-label-sm font-label-sm text-outline mt-1">
                      <span>0.4 (Low)</span>
                      <span>4.5 (High)</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-surface-container flex items-center gap-2 text-[10px]">
                      <span className="text-outline">Test Value:</span>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="6.0" 
                        step="0.05" 
                        value={tshVal} 
                        onChange={(e) => setTshVal(Number(e.target.value))} 
                        className="flex-1 accent-primary h-1" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LAB METRICS & ACCREDITATIONS */}
          <section className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter text-center">
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container">
                <span className="material-symbols-outlined text-3xl text-primary mb-1">biotech</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">5.2M+</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Diagnostics Conducted Annually</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container">
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">hub</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">150+</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Metro Collection Centers & Hubs</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container">
                <span className="material-symbols-outlined text-3xl text-tertiary mb-1">speed</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">45 Mins</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Average Doorstep Phlebotomist ETA</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container">
                <span className="material-symbols-outlined text-3xl text-primary-container mb-1">verified</span>
                <div className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">4.9 / 5</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Patient Trust Index (120k+ Reviews)</p>
              </div>
            </div>

            {/* Accreditations Container */}
            <div className="mt-space-md bg-surface-container-low rounded-2xl p-space-md flex flex-wrap items-center justify-around gap-space-md border border-surface-container">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-2xl text-primary">verified_user</span>
                <div>
                  <div className="font-label-md text-label-md font-bold">NABL ISO 15189:2022</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Accredited Testing Laboratory</div>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-2xl text-secondary">workspace_premium</span>
                <div>
                  <div className="font-label-md text-label-md font-bold">CAP Certified</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">College of American Pathologists</div>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-2xl text-tertiary">policy</span>
                <div>
                  <div className="font-label-md text-label-md font-bold">ICMR Approved</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Molecular Diagnostics Node</div>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-2xl text-primary">security</span>
                <div>
                  <div className="font-label-md text-label-md font-bold">HIPAA Compliant</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Cryptographic Data Architecture</div>
                </div>
              </div>
            </div>
          </section>

          {/* DOCTOR & PATIENT TESTIMONIALS + FAQ ACCORDION */}
          <section className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {/* Testimonials (7 cols) */}
              <div className="lg:col-span-7 space-y-space-md">
                <div className="space-y-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Clinical Endorsements
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    Trusted by Oncologists, Cardiologists & Families
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {/* Testimonial 1 */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-sm flex flex-col justify-between border border-surface-container">
                    <div className="space-y-2">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
                        "In oncology and targeted immunotherapy, assay precision is everything. ReZone's dual-verification protocol and molecular panel speeds have eliminated indeterminate repeat draws for my patients."
                      </p>
                    </div>
                    <div className="flex items-center gap-space-xs pt-space-xs">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                        DR
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">Dr. Rajesh Varma, MD, DM</p>
                        <p className="font-label-sm text-label-sm text-outline">Lead Medical Oncologist, Metro Cancer Inst.</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-sm flex flex-col justify-between border border-surface-container">
                    <div className="space-y-2">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
                        "The phlebotomist arrived within 35 minutes of booking for my 78-year-old mother. Sterile, completely painless collection with zero bruising, and the digital interactive report was ready by 4 PM."
                      </p>
                    </div>
                    <div className="flex items-center gap-space-xs pt-space-xs">
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-secondary">
                        AK
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">Ananya Kulkarni</p>
                        <p className="font-label-sm text-label-sm text-outline">Executive Care Subscriber</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner inside Testimonials */}
                <div className="bg-surface-container-high rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border border-surface-container-highest">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-3xl text-primary">forum</span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold">
                        Have a complex medical prescription?
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Our clinical team can prescribe the exact panel test matches.
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-space-sm py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md whitespace-nowrap shadow-sm hover:bg-primary-container transition-colors cursor-pointer self-start sm:self-auto"
                    onClick={() => setPrescriptionModalOpen(true)}
                  >
                    Ask Our Chemist
                  </button>
                </div>
              </div>

              {/* FAQ Accordion (5 cols) */}
              <div className="lg:col-span-5 space-y-space-md">
                <div className="space-y-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Patient Assistance
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-space-xs">
                  {/* Accordion Item 1 */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
                    <button
                      className="w-full px-space-md py-space-sm flex items-center justify-between text-left font-label-lg text-label-lg text-on-surface cursor-pointer"
                      onClick={() => setExpandedFaq(expandedFaq === 'faq1' ? null : 'faq1')}
                    >
                      <span>Do I need to fast before sample collection?</span>
                      <span className={`material-symbols-outlined text-lg transition-transform text-outline ${
                        expandedFaq === 'faq1' ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {expandedFaq === 'faq1' && (
                      <div className="px-space-md pb-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Fasting requirements depend on the tests booked. Lipid panels, blood glucose (fasting), and whole-body checkups generally require 10–12 hours of water-only fasting. Vitamin panels and complete blood counts (CBC) do not strictly mandate fasting unless combined with metabolic indicators.
                      </div>
                    )}
                  </div>

                  {/* Accordion Item 2 */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
                    <button
                      className="w-full px-space-md py-space-sm flex items-center justify-between text-left font-label-lg text-label-lg text-on-surface cursor-pointer"
                      onClick={() => setExpandedFaq(expandedFaq === 'faq2' ? null : 'faq2')}
                    >
                      <span>How do I receive and share my test reports?</span>
                      <span className={`material-symbols-outlined text-lg transition-transform text-outline ${
                        expandedFaq === 'faq2' ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {expandedFaq === 'faq2' && (
                      <div className="px-space-md pb-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        As soon as your samples pass dual pathologist authorization, you will receive an encrypted SMS & WhatsApp notification with a direct download link. You can also view interactive trend graphs directly via the Download Reports tab using your registered phone number.
                      </div>
                    )}
                  </div>

                  {/* Accordion Item 3 */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
                    <button
                      className="w-full px-space-md py-space-sm flex items-center justify-between text-left font-label-lg text-label-lg text-on-surface cursor-pointer"
                      onClick={() => setExpandedFaq(expandedFaq === 'faq3' ? null : 'faq3')}
                    >
                      <span>How safe is the home blood collection process?</span>
                      <span className={`material-symbols-outlined text-lg transition-transform text-outline ${
                        expandedFaq === 'faq3' ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {expandedFaq === 'faq3' && (
                      <div className="px-space-md pb-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Every ReZone phlebotomist is certified, vaccinated, and follows strict zero-contact PPE protocol. We use single-use sealed butterfly vacuum sets (Becton Dickinson) opened only in your presence. The tube is immediately barcoded and locked in an active cold-chain IoT container.
                      </div>
                    )}
                  </div>

                  {/* Accordion Item 4 */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
                    <button
                      className="w-full px-space-md py-space-sm flex items-center justify-between text-left font-label-lg text-label-lg text-on-surface cursor-pointer"
                      onClick={() => setExpandedFaq(expandedFaq === 'faq4' ? null : 'faq4')}
                    >
                      <span>Are ReZone test reports valid for hospital admission?</span>
                      <span className={`material-symbols-outlined text-lg transition-transform text-outline ${
                        expandedFaq === 'faq4' ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {expandedFaq === 'faq4' && (
                      <div className="px-space-md pb-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Yes. ReZone is an ISO 15189:2022 NABL and CAP-accredited diagnostic facility. Our reports are fully recognized and accepted by all government, private multi-specialty hospitals, insurance claim underwriters, and medical visa institutions globally.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* URGENT SPECIMEN & CALL-TO-ACTION BANNER - High-Contrast Redesign */}
          <section className="w-full max-w-[1440px] mx-auto px-margin pt-space-xl pb-space-md">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#003837] via-[#004e4c] to-[#002f4a] p-6 sm:p-10 lg:p-12 text-white shadow-2xl border-2 border-[#007a78]/50 overflow-hidden">
              {/* Subtle ambient lighting nodes */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                {/* High Contrast Visible Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981] text-[#002113] font-extrabold text-xs shadow-md tracking-wide">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#002113] animate-ping"></span>
                  <span>ACTIVE RAPID PHLEBOTOMY FLEET</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Need an urgent test today? Certified phlebotomists are active in your neighborhood right now.
                </h2>

                <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed max-w-2xl">
                  Doorstep coverage verified for <strong className="text-[#6ffbbe] font-bold">BDO block club road near parwati chandra hotel, Arrah, Bihar (PIN 802301)</strong>. Enter your postal code to verify instant 45-minute sterile blood collection availability.
                </p>

                {/* Quick Area Shortcuts */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Check:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPincodeInput('802301');
                      const m = SERVICEABLE_PINCODES['802301'];
                      setPincodeResult({
                        text: `⚡ High Fleet Density: ${m.phlebosActive} Phlebotomists active near ${m.area} (${m.city}). Guaranteed doorstep collection in ${m.etaMins} mins.`,
                        isAvailable: true,
                        area: m.area,
                        eta: m.etaMins
                      });
                      showToast('Selected Bihar (802301) - 5 Phlebotomists Active');
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 font-bold text-xs transition-colors border border-white/30 cursor-pointer"
                  >
                    📍 Bihar (802301 - Arrah)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPincodeInput('110001');
                      const m = SERVICEABLE_PINCODES['110001'];
                      setPincodeResult({
                        text: `⚡ High Fleet Density: ${m.phlebosActive} Phlebotomists active near ${m.area} (${m.city}). Guaranteed doorstep collection in ${m.etaMins} mins.`,
                        isAvailable: true,
                        area: m.area,
                        eta: m.etaMins
                      });
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 font-medium text-xs transition-colors border border-white/20 cursor-pointer"
                  >
                    Delhi (110001)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPincodeInput('400001');
                      const m = SERVICEABLE_PINCODES['400001'];
                      setPincodeResult({
                        text: `⚡ High Fleet Density: ${m.phlebosActive} Phlebotomists active near ${m.area} (${m.city}). Guaranteed doorstep collection in ${m.etaMins} mins.`,
                        isAvailable: true,
                        area: m.area,
                        eta: m.etaMins
                      });
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 font-medium text-xs transition-colors border border-white/20 cursor-pointer"
                  >
                    Mumbai (400001)
                  </button>
                </div>

                {/* Pin Code Check & WhatsApp Booking Form */}
                <div className="pt-2 max-w-xl space-y-3">
                  <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5" onSubmit={handlePincodeSubmit}>
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[#005f5e] text-xl font-bold">location_on</span>
                      <input
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-950 placeholder:text-slate-500 font-bold text-sm shadow-md focus:outline-none focus:ring-4 focus:ring-[#10b981]/40 border-2 border-white"
                        id="pincodeInput"
                        maxLength={6}
                        placeholder="Enter 6-digit Pincode (e.g. 802301)"
                        required
                        type="text"
                        value={pincodeInput}
                        onChange={(e) => setPincodeInput(e.target.value)}
                      />
                    </div>
                    <button
                      className="px-5 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#002113] hover:text-white font-extrabold text-sm shadow-lg whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      type="submit"
                    >
                      <span>Check Slot</span>
                      <span className="material-symbols-outlined text-base">bolt</span>
                    </button>
                    <a
                      href={getWhatsAppBookingUrl({
                        pincode: pincodeInput || '802301',
                        slot: '45-Min Express Doorstep Visit'
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm shadow-lg whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Book on WhatsApp</span>
                    </a>
                  </form>

                  {/* Confirmed Slot Result Card - Ultra High Contrast & Clarity */}
                  {pincodeResult && (
                    <div className="p-4 rounded-2xl bg-white text-slate-950 shadow-2xl border-2 border-emerald-400 animate-in fade-in space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                        <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                          <span className="material-symbols-outlined text-lg text-emerald-600">verified</span>
                          RAPID DOORSTEP FLEET ACTIVE IN YOUR AREA
                        </span>
                        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          ⚡ 28–45 Min ETA Guaranteed
                        </span>
                      </div>

                      <div className="text-xs text-slate-800 space-y-1">
                        <p className="font-semibold text-slate-900 leading-snug">
                          {pincodeResult.text}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          📍 <strong>Assigned Location:</strong> {pincodeResult.area || 'BDO block club road near parwati chandra hotel, Arrah, Bihar - 802301'}
                        </p>
                      </div>

                      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenBooking()}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#005f5e] hover:bg-[#007a78] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">home_health</span>
                          <span>Book Doorstep Visit Now</span>
                        </button>
                        <a
                          href={getWhatsAppBookingUrl({
                            address: 'BDO block club road near parwati chandra hotel',
                            pincode: pincodeInput || '802301',
                            slot: 'Instant 45-Min Express Home Collection'
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer text-center"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>
                          <span>Confirm on WhatsApp ({WHATSAPP_DISPLAY})</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onOpenCorporate={() => setCorporateModalOpen(true)}
        onOpenDoctorsPortal={() => setDoctorsPortalOpen(true)}
        onOpenConsult={() => setConsultModalOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Mobile Sticky Bottom Bar */}
      <MobileBottomBar
        onOpenBooking={() => handleOpenBooking()}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
      />

      {/* MODAL SCREENS */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        defaultPackageName={selectedPackageForBooking}
        onBookingConfirmed={(bookingId) => {
          setActiveBookingId(bookingId);
          showToast(`Phlebotomist dispatched for ${bookingId}`);
          setTrackerModalOpen(true);
        }}
      />

      <ReportViewerModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      <PrescriptionModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        onBookExtractedPackage={(packageName) => {
          handleOpenBooking(packageName);
        }}
      />

      <PhlebotomistTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        bookingId={activeBookingId}
      />

      <ParameterModal
        isOpen={parameterModalOpen}
        onClose={() => setParameterModalOpen(false)}
        packageName={selectedPackageForParams}
        onBookNow={(pkgName) => {
          handleOpenBooking(pkgName);
        }}
      />

      <PathologistConsultModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
        onConsultBooked={() => {
          showToast('Free pathologist consultation confirmed!');
        }}
      />

      <DoctorsPortalModal
        isOpen={doctorsPortalOpen}
        onClose={() => setDoctorsPortalOpen(false)}
      />

      <CorporateWellnessModal
        isOpen={corporateModalOpen}
        onClose={() => setCorporateModalOpen(false)}
      />

      {/* Floating WhatsApp Quick Booking Widget */}
      <aside aria-label="WhatsApp Quick Appointment" className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-40 flex items-center gap-2 group">
        <div className="hidden sm:flex items-center gap-1.5 bg-white text-slate-900 text-xs font-bold py-1.5 px-3 rounded-full shadow-xl border border-emerald-300 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
          <span>Book on WhatsApp ({WHATSAPP_DISPLAY})</span>
        </div>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book on WhatsApp"
          className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-[#25D366]/25 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      </aside>


      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-6 left-4 sm:left-auto right-4 sm:right-24 z-50 bg-[#283044] text-[#eef0ff] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-300 border border-[#6e7978]/30">
          <span className="material-symbols-outlined text-[#6ffbbe] text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
