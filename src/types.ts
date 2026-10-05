export interface DiagnosticTest {
  id: string;
  name: string;
  category: string;
  parametersCount: number;
  fastingHours: number;
  tatHours: number;
  originalPrice: number;
  discountedPrice: number;
  popular?: boolean;
  sampleType: string;
  description: string;
  keywords?: string[];
}

export interface HealthPackage {
  id: string;
  name: string;
  tagline: string;
  parametersCount: number;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  isRecommended?: boolean;
  fastingHours: number;
  keyIncludes: string[];
  perks: string[];
  category: 'all' | 'men' | 'women' | 'seniors';
  departments: {
    name: string;
    tests: string[];
  }[];
}

export interface PatientReportData {
  patientId: string;
  specimenId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  collectionTime: string;
  reportingTime: string;
  referredBy: string;
  pathologist: string;
  coSigner: string;
  coldChainTemperature: number; // e.g. 4.2°C
  biomarkers: {
    name: string;
    category: string;
    value: number;
    unit: string;
    referenceRange: string;
    minNormal: number;
    maxNormal: number;
    status: 'Optimal' | 'Mild Alert' | 'Critical';
    interpretation: string;
    historicalTrend: { year: string; value: number }[];
  }[];
}

export interface BookingFormData {
  selectedPackageOrTest: string;
  patientName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  address: string;
  pincode: string;
  slotDate: string;
  slotTime: string;
  fastingConfirmed: boolean;
  femalePhlebotomistPreferred: boolean;
  hardCopyReportNeeded: boolean;
}

export interface BookingDetails {
  bookingId: string;
  specimenId: string;
  patientName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  packageName: string;
  totalPrice: number;
}
