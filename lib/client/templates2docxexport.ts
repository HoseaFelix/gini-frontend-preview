import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeType } from '@/lib/schemes/resumeSchema';

// Template2 variant: slightly different order and emphasis (projects before experience, compact header)
export const exportToDocx = async (resume: ResumeType | null) => {
  if (!resume) return;

  const children: any[] = [];

  // Compact Header: Name on left, contact on right (approximation: two paragraphs)
  children.push(new Paragraph({ children: [new TextRun({ text: resume.name || 'Your Name', bold: true, size: 44 })], spacing: { after: 120 } }));
  if (resume.headline) children.push(new Paragraph({ children: [new TextRun({ text: resume.headline, italics: true, size: 20, color: '666666' })], spacing: { after: 200 } }));

  // Contact inline
  const contactParts: string[] = [];
  if (resume.contactInfo?.email) contactParts.push(resume.contactInfo.email);
  if (resume.contactInfo?.phone) contactParts.push(resume.contactInfo.phone);
  if (resume.contactInfo?.linkedIn) contactParts.push(resume.contactInfo.linkedIn);
  if (contactParts.length) children.push(new Paragraph({ children: [new TextRun({ text: contactParts.join(' | '), size: 18, color: '666666' })], spacing: { after: 240 }, alignment: AlignmentType.RIGHT }));

  // Projects first for Template2
  // Summary (career objective) — keep as a paragraph (not bullets)
  if (resume.careerObjective) {
    children.push(sectionTitle('SUMMARY'));
    children.push(new Paragraph({ children: [new TextRun({ text: resume.careerObjective, size: 20 })], spacing: { after: 120 } }));
  }

  // Projects
  if (resume.projects && resume.projects.length) {
    children.push(sectionTitle('PROJECT HIGHLIGHTS'));
    resume.projects.forEach((p) => {
      children.push(new Paragraph({ children: [new TextRun({ text: p.name, bold: true, size: 22 }), new TextRun({ text: `  |  ${p.duration}`, italics: true, size: 18, color: '666666' })], spacing: { after: 60 } }));
      const ach = splitSentences(p.achievements || '');
      ach.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 60 } })));
    });
  }

  // Experience
  if (resume.experience && resume.experience.length) {
    children.push(sectionTitle('PROFESSIONAL EXPERIENCE'));
    resume.experience.forEach((exp) => {
      children.push(new Paragraph({ children: [new TextRun({ text: exp.heading, bold: true, size: 22 }), new TextRun({ text: ` — ${exp.duration}`, italics: true, size: 18, color: '666666' })], spacing: { after: 60 } }));
      const ach = splitSentences(exp.achievements || '');
      ach.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 60 } })));
    });
  }

  // Skills as inline bold labels
  if (resume.skills) {
    children.push(sectionTitle('SKILLS'));
    if (resume.skills.technical) {
      if (resume.skills.technical.languages) children.push(kvLine('Languages', resume.skills.technical.languages.join(', ')));
      if (resume.skills.technical.frameworksAndLibraries) children.push(kvLine('Frameworks & Libraries', resume.skills.technical.frameworksAndLibraries.join(', ')));
    }
    if (resume.skills.soft && resume.skills.soft.length) children.push(kvLine('Soft Skills', resume.skills.soft.join(', ')));
    if (resume.skills.certifications && resume.skills.certifications.length) children.push(kvLine('Certifications', resume.skills.certifications.join(', ')));
  }

  // Education
  if (resume.education && resume.education.length) {
    children.push(sectionTitle('EDUCATION'));
    resume.education.forEach((edu) => {
      const years = [edu.startYear, edu.endYear].filter(Boolean).join(' - ');
      children.push(new Paragraph({ children: [new TextRun({ text: edu.institution || '', bold: true, size: 20 }), new TextRun({ text: `  ${years}`, italics: true, size: 18, color: '666666' })], spacing: { after: 40 } }));
      if (edu.degree) children.push(new Paragraph({ children: [new TextRun({ text: `Qualification: ${edu.degree}`, size: 18 })], spacing: { after: 30 } }));
    });
  }

  // Awards
  if (resume.awards && resume.awards.length) {
    children.push(sectionTitle('AWARDS'));
    resume.awards.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 60 } })));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${(resume.name || 'resume').replace(/[^a-z0-9]/gi, '_')}_template2.docx`;
  saveAs(blob, filename);
};

const sectionTitle = (text: string) => new Paragraph({ children: [new TextRun({ text, bold: true, size: 24 })], spacing: { before: 240, after: 120 } });
const kvLine = (key: string, value: string) => new Paragraph({ children: [new TextRun({ text: `${key}: `, bold: true, size: 20 }), new TextRun({ text: value, size: 20 })], spacing: { after: 60 } });
const splitSentences = (text: string) => (text?.match(/[^.!?]+(?:[.!?](?=\s|$))?/g) || []).map((s) => s.trim()).filter(Boolean);
