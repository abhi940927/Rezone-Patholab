export const WHATSAPP_NUMBER = '919905359191';
export const WHATSAPP_DISPLAY = '+91 9905359191';
export const PHONE_NUMBER = '+919905359191';
export const PHONE_DISPLAY = '+91 9905359191';

export const DEFAULT_COLLECTION_ADDRESS = 'BDO block club road near parwati chandra hotel, Arrah, Bihar';
export const DEFAULT_COLLECTION_PINCODE = '802301';

export const getWhatsAppUrl = (customMessage?: string) => {
  const defaultMsg = `Hello ReZone Patholab, I want to book a home blood sample collection appointment.

📍 Address: ${DEFAULT_COLLECTION_ADDRESS}
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
}) => {
  const pkg = params?.packageName || 'ReZone Comprehensive Vital Plus (92 Parameters)';
  const slot = params?.slot || '45-Min Express Doorstep Visit';
  const addr = params?.address || DEFAULT_COLLECTION_ADDRESS;
  const pin = params?.pincode || DEFAULT_COLLECTION_PINCODE;
  const name = params?.patientName ? `\n👤 Patient: ${params.patientName}` : '';

  const message = `Hello ReZone Patholab, I want to book a home blood sample collection appointment.${name}

📍 Address: ${addr}
📮 Pincode: ${pin}, Bihar, India
🧪 Selected Test/Package: ${pkg}
⚡ Requested Slot: ${slot}
🚚 Doorstep Collection Fee: FREE (₹0)`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

