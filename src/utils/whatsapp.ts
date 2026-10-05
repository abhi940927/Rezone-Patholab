export const WHATSAPP_NUMBER = '919905359191';
export const WHATSAPP_DISPLAY = '+91 9905359191';
export const PHONE_NUMBER = '+919279816571';
export const PHONE_DISPLAY = '+91 9279816571';

export const BOOKING_CALL_NUMBER = '9279816571';
export const BOOKING_CALL_DISPLAY = '+91 9279816571';
export const DOCTOR_NAME = 'Dr. Anil Kumar Singh';
export const DOCTOR_TITLE = 'MD Pathology (Senior Clinical Pathologist & Lab Director)';

export const LAB_ADDRESS = 'BDO block club road near parwati chandra hotel, Arrah, Bihar - 802301, India';
export const DEFAULT_COLLECTION_PINCODE = '802301';

export const getWhatsAppUrl = (customMessage?: string) => {
  const defaultMsg = `Hello ReZone Patholab, I want to book a home blood sample collection appointment.

📍 Address: (I will share my address and live location here)
📮 Pincode: ${DEFAULT_COLLECTION_PINCODE}, Bihar, India
🧪 Package: ReZone Comprehensive Vital Plus (92 Parameters)
⚡ Slot Request: 45-Min Express Doorstep Visit`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customMessage || defaultMsg)}`;
};

export const getWhatsAppBookingUrl = (params?: {
  packageName?: string;
  slot?: string;
  address?: string;
  pincode?: string;
  patientName?: string;
  locationUrl?: string;
}) => {
  const pkg = params?.packageName || 'ReZone Comprehensive Vital Plus (92 Parameters)';
  const slot = params?.slot || '45-Min Express Doorstep Visit';
  const addr = params?.address || '(I will share my address and live location here)';
  const pin = params?.pincode || DEFAULT_COLLECTION_PINCODE;
  const name = params?.patientName ? `\n👤 Patient: ${params.patientName}` : '';
  const loc = params?.locationUrl ? `\n🗺️ Live Dropped Location (Google Maps): ${params.locationUrl}` : '';

  const message = `Hello ReZone Patholab, I want to book a home blood sample collection appointment.${name}

📍 Address: ${addr}
📮 Pincode: ${pin}, Bihar, India${loc}
🧪 Selected Test/Package: ${pkg}
⚡ Requested Slot: ${slot}
🚚 Doorstep Collection Fee: FREE (₹0)`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const getWhatsAppDoctorConsultUrl = (params?: {
  doctorName?: string;
  specialistTitle?: string;
  patientName?: string;
  phone?: string;
  slot?: string;
  mode?: string;
  address?: string;
  locationUrl?: string;
  notes?: string;
}) => {
  const doc = params?.doctorName || 'Senior Pathologist / Consultant';
  const title = params?.specialistTitle ? ` (${params.specialistTitle})` : '';
  const name = params?.patientName ? `\n👤 Patient Name: ${params.patientName}` : '';
  const phone = params?.phone ? `\n📞 Patient Mobile: ${params.phone}` : '';
  const mode = params?.mode || 'Video Call Consultation';
  const slot = params?.slot || 'Today at 04:30 PM';
  const loc = params?.locationUrl ? `\n🗺️ Patient Dropped Location (Google Maps): ${params.locationUrl}` : '';
  const addr = params?.address ? `\n📍 Address: ${params.address}` : '';
  const notes = params?.notes ? `\n📝 Medical Notes / Query: ${params.notes}` : '';

  const message = `Hello ReZone Patholab, I would like to schedule a consultation with ${doc}${title}.${name}${phone}

🩺 Consultation Mode: ${mode}
⏰ Preferred Slot: ${slot}${addr}${loc}${notes}

Please connect me with the doctor / consultant. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const getWhatsAppSendReportUrl = (params: {
  patientName: string;
  patientPhone?: string;
  packageName: string;
  specimenId: string;
  bloodStatus: string;
  doctorName?: string;
}) => {
  const doc = params.doctorName || `${DOCTOR_NAME}, ${DOCTOR_TITLE}`;
  const phone = params.patientPhone ? params.patientPhone.replace(/\D/g, '') : WHATSAPP_NUMBER;
  const targetNumber = phone.length === 10 ? `91${phone}` : (phone || WHATSAPP_NUMBER);

  const message = `Hello ${params.patientName}, your blood checkup report from ReZone Patholab is ready!

🔬 Test / Package: ${params.packageName}
🩸 Specimen Barcode: ${params.specimenId}
🩺 Lab Analysis Status: ${params.bloodStatus}
👨‍⚕️ Verified & Signed by: ${doc}
🏢 Lab Location: ${LAB_ADDRESS}

✅ Your blood sample analysis has been completed with NABL & CAP certified quality controls.
📄 Digital Report & Biomarker PDF has been generated. For queries, please call ${BOOKING_CALL_DISPLAY}.`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
};

