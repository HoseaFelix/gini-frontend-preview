// Utilities for export flows. Avoid top-level imports of browser-only
// code. Dynamically import the implementation only when called from the
// browser so bundlers don't evaluate DOM-dependent libraries on the server.

export async function handleSaveAsPDF() {
  if (typeof window === 'undefined') {
    throw new Error('handleSaveAsPDF must be called in the browser');
  }

  const mod = await import('@/lib/constants/constants');
  const generatePDF = (mod as any).generatePDF || (mod as any).default;
  if (typeof generatePDF !== 'function') {
    throw new Error('generatePDF is not available from constants module');
  }

  const pdfBuffer = await generatePDF();

  // save to localStorage as base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
  localStorage.setItem('resumePDF', base64);

  // navigate to viewer page
  window.location.href = '/pdf2docxconverter';
}

export default handleSaveAsPDF;
