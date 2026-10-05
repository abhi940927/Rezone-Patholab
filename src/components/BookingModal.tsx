import React, { useState, useEffect } from 'react';
import { HEALTH_PACKAGES, POPULAR_TESTS, SERVICEABLE_PINCODES, ACCEPTED_HOME_COLLECTION_PINCODE } from '../data/mockData';
import { getWhatsAppBookingUrl, WHATSAPP_DISPLAY, BOOKING_CALL_NUMBER, BOOKING_CALL_DISPLAY, DOCTOR_NAME, DOCTOR_TITLE } from '../utils/whatsapp';
import { useDB, currentUser, createBooking } from '../utils/store';
import { BookingStatusCard } from './BookingStatusCard';
import { AuthModal } from './AuthModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackageName?: string;
  onBookingConfirmed: (bookingId: string) => void;
  onLaunchTracker?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultPackageName,
  onBookingConfirmed,
  onLaunchTracker
}) => {
  const [selectedItem, setSelectedItem] = useState(defaultPackageName || 'ReZone Comprehensive Vital Plus');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [locationFailed, setLocationFailed] = useState(false);
  const [slotType, setSlotType] = useState<'45min' | 'morning' | 'evening'>('45min');
  const [fastingConfirmed, setFastingConfirmed] = useState(true);
  const [hardCopy, setHardCopy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Dropped GPS location state
  const [droppedLocation, setDroppedLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    mapsUrl: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const db = useDB();
  const user = currentUser(db);
  useEffect(() => {
    if (user && user.role === 'patient') {
      setPatientName(n => n || user.name);
      setMobile(m => m || user.phone);
    }
  }, [user?.id]);

  if (!isOpen) return null;
  if (!user || user.role !== 'patient') return <AuthModal isOpen onClose={onClose} onSuccess={() => {}} />;

  // Find item price
  const matchedPkg = HEALTH_PACKAGES.find(p => p.name.toLowerCase() === selectedItem.toLowerCase());
  const matchedTest = POPULAR_TESTS.find(t => t.name.toLowerCase() === selectedItem.toLowerCase());
  const price = matchedPkg ? matchedPkg.discountedPrice : (matchedTest ? matchedTest.discountedPrice : 999);
  const originalPrice = matchedPkg ? matchedPkg.originalPrice : (matchedTest ? matchedTest.originalPrice : 1999);
  const totalPrice = price + (hardCopy ? 50 : 0);

  // Strict pincode 802301 check
  const isServiceablePincode = pincode.trim() === ACCEPTED_HOME_COLLECTION_PINCODE;
  const pincodeInfo = isServiceablePincode ? SERVICEABLE_PINCODES['802301'] : null;

  const fillFromCoords = async (lat: number, lng: number) => {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const j = await r.json();
      if (j?.display_name) setAddress(a => (a.trim() ? a : j.display_name));
      const pc = j?.address?.postcode;
      if (pc) setPincode(p => (p.trim() ? p : String(pc).replace(/\s/g, '')));
    } catch { /* address lookup is optional */ }
  };

  const handleDropLocation = () => {
    setLocationNote(null);
    setLocationFailed(false);
    if (!('geolocation' in navigator)) {
      setLocationFailed(true);
      setLocationNote('Your browser cannot share GPS. Please type your full address instead.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setDroppedLocation({ lat, lng, accuracy: Math.round(pos.coords.accuracy), mapsUrl: `https://maps.google.com/?q=${lat},${lng}` });
        setLocationNote(`Your exact GPS pin is attached (accurate to about ${Math.round(pos.coords.accuracy)} m). Please check the address above.`);
        setIsLocating(false);
        fillFromCoords(lat, lng);
      },
      (error) => {
        setDroppedLocation(null);
        setLocationFailed(true);
        setLocationNote(error.code === 1
          ? 'Location permission is blocked. Allow location access for this site in your browser, then tap the button again, or type your address.'
          : 'Could not get your location. Please type your full address.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isServiceablePincode) return;
    if (address.trim().length < 10) return alert('Please enter your full address (house no., street, landmark, area).');
    setIsSubmitting(true);
    const r = await createBooking({
      userId: user.id, patientName: patientName.trim() || user.name, age, gender,
      mobile: mobile || user.phone, packageName: selectedItem, totalPrice,
      address: address.trim(), pincode: pincode.trim(),
      latitude: droppedLocation?.lat, longitude: droppedLocation?.lng
    });
    setIsSubmitting(false);
    if (!r.ok) return alert(r.error);
    setBookingSuccess(r.booking.id);
    onBookingConfirmed(r.booking.id);
  };


  const handleFinish = () => {
    setBookingSuccess(null);
    onClose();
    onLaunchTracker?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-[#eaedff]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7978] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#f2f3ff] transition-colors"
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {bookingSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#6ffbbe]/40 text-[#006242] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#6ffbbe]/20">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#005f5e]">Booking Confirmed</span>
              <h3 className="text-2xl font-bold text-[#131b2e] mt-1">Phlebotomist Dispatched!</h3>
              <p className="text-xs text-[#3e4948] mt-1">
                Booking Reference: <strong className="text-[#005f5e] font-mono text-sm">{bookingSuccess}</strong>
              </p>
            </div>

            <div className="p-4 bg-[#f2f3ff] rounded-xl text-left text-xs space-y-2 border border-[#eaedff]">
              <div className="flex justify-between items-center pb-2 border-b border-[#dae2fd]">
                <span className="text-[#3e4948]">Assigned Phlebotomist:</span>
                <span className="font-bold text-[#131b2e] flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#006398]">medical_services</span>
                  Aarav Sharma (Certified BD Vaccutainer)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#3e4948]">Estimated Arrival Time:</span>
                <span className="font-bold text-[#006242]">{pincodeInfo?.etaMins || 28} Minutes (Sterile Sealed Kit)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#3e4948]">Specimen Vault ID:</span>
                <span className="font-mono text-[#006398]">IoT-VAULT #412 (Active 4.1°C)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#dae2fd]">
                <span className="text-[#3e4948]">Total to Pay at Doorstep:</span>
                <span className="text-base font-bold text-[#005f5e]">₹{totalPrice}</span>
              </div>
            </div>

            <BookingStatusCard bookingId={bookingSuccess} />

            <p className="text-[11px] text-[#6e7978]">
              SMS & WhatsApp notification with real-time phlebotomist GPS link sent to {mobile || '+1 (555) 019-2831'}.
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <span className="material-symbols-outlined text-base">near_me</span>
              <span>Launch Live GPS Phlebotomist Tracker</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#005f5e] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">home_health</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#131b2e]">Book Doorstep Blood Collection</h3>
                <p className="text-xs text-[#3e4948]">Painless vacuum blood collection in 45 minutes by certified medical staff</p>
              </div>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#005f5e] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">stethoscope</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#131b2e]">{DOCTOR_NAME}</div>
                  <div className="text-[10px] text-[#3e4948]">{DOCTOR_TITLE}</div>
                </div>
              </div>
              <a
                href={`tel:+91${BOOKING_CALL_NUMBER}`}
                className="px-3.5 py-2 rounded-lg bg-white border border-[#005f5e] text-[#005f5e] hover:bg-[#005f5e] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Call to Book: {BOOKING_CALL_DISPLAY}</span>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Selected Package / Test */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3e4948] mb-1">
                  Selected Health Package or Test
                </label>
                <div className="relative">
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#bdc9c8] rounded-lg text-xs font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                  >
                    <optgroup label="Whole-Body Preventive Health Packages">
                      {HEALTH_PACKAGES.map((pkg) => (
                        <option key={pkg.id} value={pkg.name}>
                          {pkg.name} ({pkg.parametersCount} Parameters) - ₹{pkg.discountedPrice}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Individual Diagnostic Tests">
                      {POPULAR_TESTS.map((test) => (
                        <option key={test.id} value={test.name}>
                          {test.name} - ₹{test.discountedPrice}
                        </option>
                      ))}
                    </optgroup>

                  </select>
                </div>
              </div>

              {/* Slot selection - Redesigned for maximum readability & high contrast */}
              <div className="bg-[#f8fafe] p-3.5 rounded-xl border border-[#dae2fd] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                    Select Collection Time Slot
                  </label>
                  <span className="text-[11px] font-semibold text-[#005f5e] bg-[#e6f7f6] px-2 py-0.5 rounded-full border border-[#005f5e]/20">
                    {slotType === '45min' ? '⚡ 45-Min Express Slot' : slotType === 'morning' ? '🌅 Morning Fasting Slot' : '📅 Custom Slot'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: 45 Mins */}
                  <button
                    type="button"
                    onClick={() => setSlotType('45min')}
                    className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                      slotType === '45min'
                        ? 'border-[#005f5e] bg-white text-slate-900 shadow-md ring-2 ring-[#005f5e]/15'
                        : 'border-[#dae2fd] bg-white text-slate-700 hover:border-[#005f5e]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                        <span className="material-symbols-outlined text-base text-[#007a78]">bolt</span>
                        Express 45 Mins
                      </span>
                      {slotType === '45min' && (
                        <span className="material-symbols-outlined text-sm text-[#005f5e]">check_circle</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                      Earliest: ~35 Mins
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                      Immediate doorstep dispatch with cold-chain kit.
                    </p>
                  </button>

                  {/* Option 2: Morning Fasting */}
                  <button
                    type="button"
                    onClick={() => setSlotType('morning')}
                    className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                      slotType === 'morning'
                        ? 'border-[#005f5e] bg-white text-slate-900 shadow-md ring-2 ring-[#005f5e]/15'
                        : 'border-[#dae2fd] bg-white text-slate-700 hover:border-[#005f5e]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                        <span className="material-symbols-outlined text-base text-[#006398]">wb_sunny</span>
                        Morning Fasting
                      </span>
                      {slotType === 'morning' && (
                        <span className="material-symbols-outlined text-sm text-[#005f5e]">check_circle</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                      Tomorrow 6:30 - 9:30 AM
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                      Ideal for Sugar, Lipids & Thyroid tests.
                    </p>
                  </button>

                  {/* Option 3: Custom Time */}
                  <button
                    type="button"
                    onClick={() => setSlotType('evening')}
                    className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                      slotType === 'evening'
                        ? 'border-[#005f5e] bg-white text-slate-900 shadow-md ring-2 ring-[#005f5e]/15'
                        : 'border-[#dae2fd] bg-white text-slate-700 hover:border-[#005f5e]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                        <span className="material-symbols-outlined text-base text-slate-700">schedule</span>
                        Custom Time
                      </span>
                      {slotType === 'evening' && (
                        <span className="material-symbols-outlined text-sm text-[#005f5e]">check_circle</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                      Today Afternoon / Eve
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                      Choose specific time slot (2 PM - 7 PM).
                    </p>
                  </button>
                </div>

                {/* Sub-slot details based on selection */}
                {slotType === '45min' && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0"></span>
                    <span>
                      <strong>Express Slot Active:</strong> A certified phlebotomist near {pincode || 'your area'} will arrive in <strong>35–45 minutes</strong> with sealed vacuum tubes.
                    </span>
                  </div>
                )}

                {slotType === 'morning' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-700">Choose Specific Morning Fasting Window:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {['6:30 - 7:30 AM', '7:30 - 8:30 AM', '8:30 - 9:30 AM', '9:30 - 10:30 AM'].map((timeStr, tIdx) => (
                        <button
                          key={timeStr}
                          type="button"
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                            tIdx === 1 
                              ? 'bg-[#005f5e] text-white border-[#005f5e] shadow-sm' 
                              : 'bg-white text-slate-800 border-[#dae2fd] hover:border-[#005f5e]'
                          }`}
                        >
                          {timeStr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {slotType === 'evening' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-700">Choose Afternoon / Evening Window:</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['2:00 - 4:00 PM', '4:00 - 6:00 PM', '6:00 - 8:00 PM'].map((timeStr, tIdx) => (
                        <button
                          key={timeStr}
                          type="button"
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                            tIdx === 0 
                              ? 'bg-[#005f5e] text-white border-[#005f5e] shadow-sm' 
                              : 'bg-white text-slate-800 border-[#dae2fd] hover:border-[#005f5e]'
                          }`}
                        >
                          {timeStr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Jonathan Davis"
                    className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Age & Gender</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className="w-14 px-2 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                      className="flex-1 px-1 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. +91 9905359191"
                    className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Postal / Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 802301"
                    className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">Service Zone Status</label>
                  {isServiceablePincode ? (
                    <div className="px-2.5 py-2 bg-[#eaedff] rounded-lg text-[10px] text-[#006398] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006242] animate-ping"></span>
                      <span>{pincodeInfo?.phlebosActive} Phlebotomists Active ({pincodeInfo?.etaMins}m ETA)</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      <span>Not Serviceable (Only 802301)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Strict Pincode Restriction Warning */}
              {pincode.trim() !== '' && !isServiceablePincode && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-xs text-red-900 flex items-start gap-2.5 animate-in fade-in">
                  <span className="material-symbols-outlined text-red-600 text-xl shrink-0 mt-0.5">cancel</span>
                  <div className="flex-1">
                    <div className="font-extrabold text-red-900">
                      Home collection is ONLY available for pincode 802301 (Arrah, Bihar).
                    </div>
                    <p className="text-[11px] text-red-700 mt-0.5 leading-snug">
                      Pincode "{pincode}" is not acceptable for home collection. Doorstep visits cannot be dispatched outside 802301.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPincode('802301');
                      }}
                      className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Use Pincode 802301 (Serviceable Area)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Doorstep Address & Location Drop */}
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label className="block text-[11px] font-medium text-[#3e4948]">Your Address / Landmark (where we collect the sample)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDropLocation}
                      disabled={isLocating}
                      className="text-[11px] font-bold text-white bg-[#005f5e] hover:bg-[#007a78] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                      title="Pin your current location and send via WhatsApp"
                    >
                      <span className={`material-symbols-outlined text-sm ${isLocating ? 'animate-spin' : ''}`}>
                        {isLocating ? 'progress_activity' : 'my_location'}
                      </span>
                      <span>{isLocating ? 'Detecting GPS...' : '📍 Drop My Location'}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no., street, landmark, area, city"
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                />

                <p className="text-[10px] text-[#6e7978] mt-1">Type your full address, then tap Drop My Location so our phlebotomist can find your exact spot.</p>

                {/* Dropped Location Confirmation Chip */}
                {droppedLocation && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="material-symbols-outlined text-emerald-700 text-base shrink-0">pin_drop</span>
                      <div className="truncate">
                        <span className="font-bold text-emerald-900">GPS Location Dropped: </span>
                        <span className="font-mono text-[11px] text-emerald-800">
                          {droppedLocation.lat.toFixed(4)}, {droppedLocation.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={droppedLocation.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 flex items-center gap-0.5"
                    >
                      <span>Preview Map</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>
                )}

                {locationNote && (
                  <p className={`text-[10px] mt-1 flex items-center gap-1 ${locationFailed ? 'text-[#ba1a1a]' : 'text-emerald-700'}`}>
                    <span className="material-symbols-outlined text-xs">info</span>
                    <span>{locationNote}</span>
                  </p>
                )}
              </div>

              {/* Preferences */}
              <div className="space-y-1.5 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#3e4948]">
                  <input
                    type="checkbox"
                    checked={fastingConfirmed}
                    onChange={(e) => setFastingConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005f5e] focus:ring-[#005f5e]"
                  />
                  <span>Patient is informed regarding water-only fasting requirements</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#3e4948]">
                  <input
                    type="checkbox"
                    checked={hardCopy}
                    onChange={(e) => setHardCopy(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005f5e] focus:ring-[#005f5e]"
                  />
                  <span>Deliver physical laminated medical report along with digital PDF (+₹50)</span>
                </label>
              </div>

              {/* Total & Submit & WhatsApp */}
              <div className="pt-3 border-t border-[#eaedff] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-[#6e7978]">
                    Pay via UPI / Card / Cash at Doorstep
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-[#005f5e]">₹{totalPrice}</span>
                    <span className="text-xs text-[#6e7978] line-through">₹{originalPrice}</span>
                    <span className="text-[10px] font-bold text-[#006242] bg-[#6ffbbe]/30 px-1.5 py-0.5 rounded">
                      Zero Home Collection Fee
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <a
                    href={
                      isServiceablePincode
                        ? getWhatsAppBookingUrl({
                            packageName: selectedItem,
                            slot: slotType === '45min' ? '45-Min Express Slot' : slotType === 'morning' ? 'Morning Fasting (6:30 - 9:30 AM)' : 'Custom Slot',
                            address: address,
                            pincode: pincode,
                            patientName: patientName,
                            locationUrl: droppedLocation?.mapsUrl
                          })
                        : '#'
                    }
                    onClick={(e) => {
                      if (!isServiceablePincode) {
                        e.preventDefault();
                        alert('Home collection is ONLY available for pincode 802301. Other pincodes are not acceptable.');
                      }
                    }}
                    target={isServiceablePincode ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className={`px-3.5 py-2.5 rounded-lg text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
                      isServiceablePincode ? 'bg-[#25D366] hover:bg-[#20ba59] cursor-pointer' : 'bg-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Book on WhatsApp</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isServiceablePincode}
                    className="px-5 py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        <span>Assigning Phlebo...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Dispatch</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
