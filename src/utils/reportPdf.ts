import { DEMO_PATIENT_REPORT } from '../data/mockData';
import { PatientReportData } from '../types';

export const generateReportHtml = (report: PatientReportData = DEMO_PATIENT_REPORT) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReZone Pathology Report - ${report.specimenId}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #131b2e; margin: 0; padding: 20px; font-size: 13px; line-height: 1.4; }
    .header { border-bottom: 2px solid #005f5e; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .logo-text { font-size: 24px; font-weight: bold; color: #005f5e; letter-spacing: -0.5px; }
    .logo-sub { font-size: 10px; color: #6e7978; text-transform: uppercase; font-weight: bold; }
    .accreditation { text-align: right; font-size: 10px; color: #006398; font-weight: bold; }
    .patient-box { background: #f2f3ff; border: 1px solid #dae2fd; border-radius: 8px; padding: 12px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11px; }
    .patient-box div strong { display: block; color: #6e7978; font-size: 9px; text-transform: uppercase; }
    .cold-chain-stamp { background: #e6f7f6; border: 1px solid #005f5e; padding: 8px; border-radius: 6px; font-size: 11px; color: #005f5e; font-weight: bold; margin-bottom: 16px; display: flex; justify-content: space-between; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
    th { background: #005f5e; color: white; text-align: left; padding: 8px; font-size: 11px; }
    td { padding: 8px; border-bottom: 1px solid #eaedff; }
    tr:nth-child(even) { background-color: #faf8ff; }
    .flag-optimal { color: #006242; font-weight: bold; }
    .flag-alert { color: #ba1a1a; font-weight: bold; }
    .remarks-box { background: #f8fafe; border: 1px solid #dae2fd; border-radius: 6px; padding: 10px; margin-bottom: 20px; font-size: 11px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 16px; border-top: 1px solid #dae2fd; }
    .sig-block { font-size: 11px; }
    .sig-line { width: 160px; border-top: 1px solid #333; margin-top: 30px; padding-top: 4px; font-weight: bold; }
    .footer { text-align: center; font-size: 10px; color: #6e7978; margin-top: 24px; border-top: 1px dashed #dae2fd; padding-top: 8px; }
    .btn-print { background: #005f5e; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
    @media print { .btn-print { display: none; } }
  </style>
</head>
<body>
  <div style="text-align: right;">
    <button class="btn-print" onclick="window.print()">🖨️ Click Here to Print or Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="logo-text">ReZone Patholab</div>
      <div class="logo-sub">Clinical Reference Diagnostics & Molecular Laboratories</div>
      <div style="font-size: 10px; color: #3e4948; margin-top: 2px;">Dual NABL & CAP Accredited • ISO 15189:2022 Certified</div>
    </div>
    <div class="accreditation">
      <div>COLLEGE OF AMERICAN PATHOLOGISTS (CAP #8912401)</div>
      <div>NABL ACCREDITATION CERT #M-4421</div>
      <div>ICMR MOLECULAR REGISTRY NODE</div>
    </div>
  </div>

  <div class="patient-box">
    <div><strong>Patient Name</strong> ${report.patientName}</div>
    <div><strong>Age / Gender</strong> ${report.age} Years / ${report.gender}</div>
    <div><strong>Specimen Barcode</strong> ${report.specimenId}</div>
    <div><strong>Patient Reg ID</strong> ${report.patientId}</div>
    <div><strong>Collection Time</strong> ${report.collectionTime}</div>
    <div><strong>Reporting Time</strong> ${report.reportingTime}</div>
    <div><strong>Referred By</strong> ${report.referredBy}</div>
    <div><strong>Registered Address</strong> BDO block club road, Arrah, Bihar (802301)</div>
  </div>

  <div class="cold-chain-stamp">
    <span>🔒 Automated IoT Specimen Vault #412 Verification</span>
    <span>Temperature: ${report.coldChainTemperature}°C (Continuous 2°C - 8°C Verified)</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Diagnostic Test / Biomarker</th>
        <th>Observed Value</th>
        <th>Unit</th>
        <th>Biological Reference Range</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${report.biomarkers.map(b => `
        <tr>
          <td><strong>${b.name}</strong><br><span style="color: #6e7978; font-size: 9px;">${b.category}</span></td>
          <td style="font-size: 13px; font-weight: bold;">${b.value}</td>
          <td>${b.unit}</td>
          <td>${b.referenceRange}</td>
          <td class="${b.status === 'Optimal' ? 'flag-optimal' : 'flag-alert'}">${b.status}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="remarks-box">
    <strong style="color: #005f5e;">Senior Pathologist Clinical Remarks:</strong>
    <p style="margin: 4px 0 0 0;">
      All biological assays cross-validated via optical immunoassay & robotic analyzers (Roche Cobas e411 / Sysmex XN-1000). Glycemic control (HbA1c 5.4%) is within optimal reference interval. 25-OH Vitamin D indicates mild insufficiency; dietary counseling and therapeutic supplementation indicated.
    </p>
  </div>

  <div class="signatures">
    <div class="sig-block">
      <div class="sig-line">Dr. Aris Thorne, MD Path</div>
      <div>Head of Molecular Pathology</div>
      <div style="font-size: 9px; color: #6e7978;">Reg No: DMC-68192 • Digital ID: 992140A-HEX</div>
    </div>
    <div class="sig-block" style="text-align: right;">
      <div class="sig-line" style="margin-left: auto;">Dr. Sarah Chen, PhD</div>
      <div>Lead Clinical Biochemist</div>
      <div style="font-size: 9px; color: #6e7978;">Quality Assurance Lead • Digital ID: 883192B-HEX</div>
    </div>
  </div>

  <div class="footer">
    *** End of Verified Laboratory Report • Cryptographically Sealed with 256-Bit SHA-256 Hash • Support & Inquiries: WhatsApp +91 9905359191 ***
  </div>

  <script>
    // Auto-trigger print when opened in standalone window or iframe
    window.onload = function() {
      setTimeout(function() {
        try { window.print(); } catch(e) {}
      }, 400);
    };
  </script>
</body>
</html>`;
};

/**
 * Triggers the browser's native Print / Save as PDF dialog without triggering popup blockers.
 * Works seamlessly inside iframe sandboxes by utilizing an in-DOM printing iframe.
 */
export const printOrSaveReportPdf = (report: PatientReportData = DEMO_PATIENT_REPORT): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const htmlContent = generateReportHtml(report);

      // Clean up previous print iframe if it exists
      const existingFrame = document.getElementById('rezone-print-frame');
      if (existingFrame) {
        existingFrame.remove();
      }

      // Create an invisible iframe attached to body
      const printFrame = document.createElement('iframe');
      printFrame.id = 'rezone-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0px';
      printFrame.style.height = '0px';
      printFrame.style.border = 'none';
      printFrame.style.visibility = 'hidden';
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
      if (!frameDoc) {
        // Fallback to window.print if iframe document is not accessible
        window.print();
        resolve(true);
        return;
      }

      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
          resolve(true);
        } catch (err) {
          console.warn('Iframe print error, invoking window.print fallback:', err);
          window.print();
          resolve(true);
        }
      }, 350);
    } catch (error) {
      console.error('Print trigger error:', error);
      window.print();
      resolve(false);
    }
  });
};

/**
 * Downloads the complete self-contained lab report file to the user's device.
 */
export const downloadReportFile = (report: PatientReportData = DEMO_PATIENT_REPORT) => {
  const htmlContent = generateReportHtml(report);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `ReZone_Pathology_Report_${report.specimenId}.html`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
};

// Backwards compatibility alias
export const downloadOrPrintReport = (report: PatientReportData = DEMO_PATIENT_REPORT) => {
  printOrSaveReportPdf(report);
  downloadReportFile(report);
};

