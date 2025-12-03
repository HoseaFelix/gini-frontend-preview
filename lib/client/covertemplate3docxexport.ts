import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { CoverLetter, ResumeType } from '@/lib/schemes/resumeSchema';

export const exportCoverTemplate3Docx = async (cover: CoverLetter | null, resume?: ResumeType | null) => {
  if (!cover) return;

  const children: any[] = [];

  // Centered header
  children.push(new Paragraph({ children: [new TextRun({ text: cover.name || resume?.name || 'Your Name', bold: true, size: 36 })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }));
  if (cover.headline || resume?.headline) children.push(new Paragraph({ children: [new TextRun({ text: cover.headline || resume?.headline || '', italics: true, size: 14, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 20 } }));

  // Contact row (email · phone · address)
  const contactParts: string[] = [];
  if (cover.email) contactParts.push(cover.email);
  if (resume?.contactInfo?.phone) contactParts.push(resume.contactInfo.phone);
  if (resume?.contactInfo?.address) contactParts.push(resume.contactInfo.address);
  if (contactParts.length) children.push(new Paragraph({ children: [new TextRun({ text: contactParts.join(' · '), size: 14, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }));

  // Date and Dear
  children.push(new Paragraph({ children: [new TextRun({ text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), size: 14 })], spacing: { after: 20 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Dear ${cover.hiringManagerName || 'Hiring Manager'},`, size: 14 })], spacing: { after: 20 } }));

  // Letter paragraphs
  if (Array.isArray(cover.letter) && cover.letter.length) {
    cover.letter.forEach((p) => children.push(new Paragraph({ children: [new TextRun({ text: p, size: 14 })], spacing: { after: 120 } })));
  }

  // Closing
  children.push(new Paragraph({ children: [new TextRun({ text: 'Sincerely,', size: 14 })], spacing: { after: 40 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: cover.name || resume?.name || '', bold: true, size: 14 })], spacing: { after: 20 } }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${(cover.name || resume?.name || 'coverletter').replace(/[^a-z0-9]/gi, '_')}_cover_template3.docx`;
  saveAs(blob, filename);
};
