import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { CoverLetter, ResumeType } from '@/lib/schemes/resumeSchema';

export const exportCoverTemplate1Docx = async (cover: CoverLetter | null, resume?: ResumeType | null) => {
  if (!cover) return;

  const children: any[] = [];

  // Header block (large background in page) - approximate with centered header
  children.push(new Paragraph({ children: [new TextRun({ text: cover.name || (resume?.name ?? 'Your Name'), bold: true, size: 40 })], alignment: AlignmentType.LEFT, spacing: { after: 120 } }));
  if (cover.email || resume?.contactInfo?.email) children.push(new Paragraph({ children: [new TextRun({ text: cover.email || resume?.contactInfo?.email || '', size: 18 })], alignment: AlignmentType.LEFT, spacing: { after: 40 } }));
  if (cover.headline || resume?.headline) children.push(new Paragraph({ children: [new TextRun({ text: cover.headline || resume?.headline || '', italics: true, size: 18, color: '666666' })], alignment: AlignmentType.LEFT, spacing: { after: 120 } }));

  // Title
  children.push(new Paragraph({ children: [new TextRun({ text: 'Job Application Letter', bold: true, size: 22 })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }));

  // Date
  children.push(new Paragraph({ children: [new TextRun({ text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), size: 12 })], spacing: { after: 40 } }));

  // Dear line
  children.push(new Paragraph({ children: [new TextRun({ text: `Dear ${cover.hiringManagerName || 'Hiring Manager'},`, size: 12 })], spacing: { after: 20 } }));

  // Letter paragraphs (preserve each paragraph)
  if (Array.isArray(cover.letter) && cover.letter.length) {
    cover.letter.forEach((p) => {
      children.push(new Paragraph({ children: [new TextRun({ text: p, size: 12 })], spacing: { after: 160 } }));
    });
  }

  // Closing & signature
  children.push(new Paragraph({ children: [new TextRun({ text: 'Sincerely,', size: 12 })], spacing: { after: 80 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: cover.name || resume?.name || '', bold: true, size: 14 })], spacing: { after: 40 } }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${(cover.name || resume?.name || 'coverletter').replace(/[^a-z0-9]/gi, '_')}_cover_template1.docx`;
  saveAs(blob, filename);
};
