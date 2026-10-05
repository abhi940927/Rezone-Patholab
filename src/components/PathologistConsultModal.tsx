import React, { useState } from 'react';
import { getWhatsAppDoctorConsultUrl, WHATSAPP_DISPLAY } from '../utils/whatsapp';

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
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [slot, setSlot] = useState('Today at 04:30 PM');
  const [booked, setBooked] = useState(false);

  // Dropped GPS location state
  const [droppedLocation, setDroppedLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    mapsUrl: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const doctorName = selectedSpecialist === 'oncology' ? 'Dr. Anil Kumar Singh' : 'Dr. Sarah Chen, PhD';
  const specialistTitle = selectedSpecialist === 'oncology' 
    ? 'MD Pathology — Senior Clinical Pathologist & Lab Director' 
    : 'Clinical Biochemistry & Metabolic Consultant';

  const handleDropLocation = () => {
    setIsLocating(true);
    setLocationNote(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
          setDroppedLocation({
            lat,
            lng,
            accuracy: Math.round(pos.coords.accuracy),
            mapsUrl
          });
          setLocationNote('Live location dropped! Google Maps link attached for Doctor.');
          setIsLocating(false);
        },
        (_err) => {
          const lat = 25.556041;
          const lng = 84.660332;
          const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
          setDroppedLocation({
            lat,
            lng,
            mapsUrl
          });
          setLocationNote('GPS sensor unavailable. Attached Arrah Hub coordinates (25.5560° N, 84.6603° E).');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      const lat = 25.556041;
      const lng = 84.660332;
      setDroppedLocation({
        lat,
        lng,
        mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
      });
      setLocationNote('Attached Arrah Hub coordinates (25.5560° N, 84.6603° E).');
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      onConsultBooked();
    }, 1500);
  };

  const whatsappUrl = getWhatsAppDoctorConsultUrl({
    doctorName,
    specialistTitle,
    patientName: name,
    phone,
    slot,
    mode: mode === 'video' ? 'Video Call Consultation' : mode === 'phone' ? 'Phone Call Consultation' : 'Written Review Note',
    address,
    locationUrl: droppedLocation?.mapsUrl,
    notes
  });

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
              Your complimentary session with <strong>{doctorName}</strong> is confirmed for <strong>{slot}</strong>.
            </p>
            <p className="text-[11px] text-[#6e7978]">
              A secure encrypted video link has been dispatched to {phone || 'your registered number'}.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Send to Doctor via WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-[#005f5e] hover:bg-[#007a78] text-white text-xs font-bold transition-all"
              >
                Done
              </button>
            </div>
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
                    <div className="text-xs font-bold text-[#131b2e]">Dr. Anil Kumar Singh</div>
                    <div className="text-[10px] text-[#3e4948]">MD Pathology — Senior Lab Director</div>
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

              {/* Patient Location & GPS Drop */}
              <div className="bg-[#f8fafe] p-3 rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="block text-[11px] font-bold text-[#131b2e] uppercase tracking-wider">
                    Patient Location & Landmark
                  </label>
                  <button
                    type="button"
                    onClick={handleDropLocation}
                    disabled={isLocating}
                    className="text-[11px] font-bold text-white bg-[#005f5e] hover:bg-[#007a78] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-sm ${isLocating ? 'animate-spin' : ''}`}>
                      {isLocating ? 'progress_activity' : 'my_location'}
                    </span>
                    <span>{isLocating ? 'Detecting GPS...' : '📍 Drop My Location'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. BDO block club road near parwati chandra hotel, Arrah, Bihar - 802301, India"
                  className="w-full px-3 py-2 bg-white rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                />

                {droppedLocation && (
                  <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="material-symbols-outlined text-emerald-700 text-base shrink-0">pin_drop</span>
                      <div className="truncate">
                        <span className="font-bold text-emerald-900">GPS Pinned: </span>
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
                  <p className="text-[10px] text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    <span>{locationNote}</span>
                  </p>
                )}
              </div>

              {/* Consultation Notes */}
              <div>
                <label className="block text-[11px] font-medium text-[#3e4948] mb-0.5">
                  Reason for Consultation / Doctor Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Discuss elevated blood sugar & lipid panel report..."
                  className="w-full px-3 py-2 bg-[#f2f3ff] rounded-lg text-xs text-[#131b2e] border border-[#bdc9c8] focus:outline-none focus:ring-2 focus:ring-[#005f5e]"
                />
              </div>

              {/* Action Buttons: WhatsApp & Direct Booking */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Send Location & Consult on WhatsApp</span>
                </a>

                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-lg bg-[#006242] hover:bg-[#007d55] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">event_available</span>
                  <span>Confirm Slot</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
