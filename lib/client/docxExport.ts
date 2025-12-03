// Re-export template-specific docx exporters.
// The repository originally exported a single `exportToDocx` for template1. To keep
// backward compatibility we re-export the Template1 implementation as `exportToDocx`.

export { exportToDocx } from './templates1docxexport';
export { exportToDocx as exportTemplate2Docx } from './templates2docxexport';
export { exportToDocx as exportTemplate3Docx } from './templates3docxexport';
