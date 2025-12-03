import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeType } from '@/lib/schemes/resumeSchema';

// Template3 variant: minimalist, centered sections and condensed bullets
export const exportToDocx = async (resume: ResumeType | null) => {
  if (!resume) return;

  const children: any[] = [];

  // Minimal centered header
  children.push(new Paragraph({ children: [new TextRun({ text: resume.name || 'Your Name', bold: true, size: 40 })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }));
  if (resume.headline) children.push(new Paragraph({ children: [new TextRun({ text: resume.headline, italics: true, size: 18, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }));

  const contactParts: string[] = [];
  if (resume.contactInfo?.email) contactParts.push(resume.contactInfo.email);
  if (resume.contactInfo?.phone) contactParts.push(resume.contactInfo.phone);
  if (contactParts.length) children.push(new Paragraph({ children: [new TextRun({ text: contactParts.join(' · '), size: 18, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }));

  // Summary as short bullets
  // Qualifications Profile / Career Objective (keep as paragraph)
  if (resume.careerObjective) {
    children.push(sectionTitle('QUALIFICATIONS PROFILE'));
    children.push(new Paragraph({ children: [new TextRun({ text: resume.careerObjective, size: 20 })], spacing: { after: 120 } }));
  }

  // Experience condensed
  if (resume.experience && resume.experience.length) {
    children.push(sectionTitle('EXPERIENCE'));
    resume.experience.forEach((exp) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `${exp.heading} — ${exp.duration}`, bold: true, size: 20 })], spacing: { after: 40 } }));
      const ach = splitSentences(exp.achievements || '').slice(0, 4);
      ach.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 18 })], bullet: { level: 0 }, spacing: { after: 40 } })));
    });
  }

  // Skills as multi-line
  if (resume.skills) {
    children.push(sectionTitle('SKILLS'));
    if (resume.skills.technical?.languages) children.push(kvLine('Languages', resume.skills.technical.languages.join(', ')));
    if (resume.skills.technical?.frameworksAndLibraries) children.push(kvLine('Frameworks & Libraries', resume.skills.technical.frameworksAndLibraries.join(', ')));
    if (resume.skills.technical?.toolsAndBuildSystems) children.push(kvLine('Tools', resume.skills.technical.toolsAndBuildSystems.join(', ')));
    if (resume.skills.technical?.testing) children.push(kvLine('Testing', resume.skills.technical.testing.join(', ')));
    if (resume.skills.technical?.practices) children.push(kvLine('Practices', resume.skills.technical.practices.join(', ')));
    if (resume.skills.soft && resume.skills.soft.length) children.push(kvLine('Soft Skills', resume.skills.soft.join(', ')));
    if (resume.skills.certifications && resume.skills.certifications.length) children.push(kvLine('Certifications', resume.skills.certifications.join(', ')));
  }

  // Education
  if (resume.education && resume.education.length) {
    children.push(sectionTitle('EDUCATION'));
    resume.education.forEach((edu) => {
      const years = [edu.startYear, edu.endYear].filter(Boolean).join(' - ');
      children.push(new Paragraph({ children: [new TextRun({ text: edu.institution || '', bold: true, size: 18 }), new TextRun({ text: `  ${years}`, italics: true, size: 16, color: '666666' })], spacing: { after: 40 } }));
      if (edu.degree) children.push(new Paragraph({ children: [new TextRun({ text: `Qualification: ${edu.degree}`, size: 16 })], spacing: { after: 30 } }));
    });
  }

  // Awards
  if (resume.awards && resume.awards.length) {
    children.push(sectionTitle('AWARDS'));
    resume.awards.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 18 })], bullet: { level: 0 }, spacing: { after: 40 } })));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${(resume.name || 'resume').replace(/[^a-z0-9]/gi, '_')}_template3.docx`;
  saveAs(blob, filename);
};

const sectionTitle = (text: string) => new Paragraph({ children: [new TextRun({ text, bold: true, size: 22 })], spacing: { before: 240, after: 100 } });
const kvLine = (key: string, value: string) => new Paragraph({ children: [new TextRun({ text: `${key}: `, bold: true, size: 18 }), new TextRun({ text: value, size: 18 })], spacing: { after: 60 } });
const splitSentences = (text: string) => (text?.match(/[^.!?]+(?:[.!?](?=\s|$))?/g) || []).map((s) => s.trim()).filter(Boolean);

// Education
// Add education and awards to match the template layout
if (false) {
  // placeholder to keep linter happy if required; real code added below dynamically
}
