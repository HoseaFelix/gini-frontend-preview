import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import type { CoverLetter, ResumeType } from '@/lib/schemes/resumeSchema';

export const exportCoverTemplate2Docx = async (cover: CoverLetter | null, resume?: ResumeType | null) => {
  if (!cover) return;

  const children: any[] = [];

  // Left column info (Name, Headline, Phone, Email) - we'll put them first stacked
  children.push(new Paragraph({ children: [new TextRun({ text: cover.name || (resume?.name ?? 'Your Name'), bold: true, size: 32 })], spacing: { after: 60 } }));
  if (cover.headline || resume?.headline) children.push(new Paragraph({ children: [new TextRun({ text: cover.headline || resume?.headline || '', italics: true, size: 14, color: '666666' })], spacing: { after: 40 } }));
  if (resume?.contactInfo?.phone) children.push(new Paragraph({ children: [new TextRun({ text: `Phone: ${resume.contactInfo.phone}`, size: 12 })], spacing: { after: 20 } }));
  if (cover.email || resume?.contactInfo?.email) children.push(new Paragraph({ children: [new TextRun({ text: `Email: ${cover.email || resume?.contactInfo?.email || ''}`, size: 12 })], spacing: { after: 40 } }));

  // Date
  children.push(new Paragraph({ children: [new TextRun({ text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), size: 12 })], spacing: { after: 40 } }));

  // Dear line
  children.push(new Paragraph({ children: [new TextRun({ text: `Dear ${cover.hiringManagerName || 'Hiring Manager'},`, size: 12 })], spacing: { after: 20 } }));

  // Letter paragraphs
  if (Array.isArray(cover.letter) && cover.letter.length) {
    cover.letter.forEach((p) => children.push(new Paragraph({ children: [new TextRun({ text: p, size: 12 })], spacing: { after: 160 } })));
  }

  // Closing
  children.push(new Paragraph({ children: [new TextRun({ text: 'Sincerely,', size: 12 })], spacing: { after: 60 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: cover.name || resume?.name || '', bold: true, size: 14 })], spacing: { after: 20 } }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${(cover.name || resume?.name || 'coverletter').replace(/[^a-z0-9]/gi, '_')}_cover_template2.docx`;
  saveAs(blob, filename);
};
