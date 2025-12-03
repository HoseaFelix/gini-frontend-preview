import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeType } from '@/lib/schemes/resumeSchema';

export const exportToDocx = async (resume: ResumeType | null) => {
  if (!resume) return;

  const children: any[] = [];

  // Header: Name + Headline
  children.push(
    new Paragraph({
      children: [new TextRun({ text: resume.name || 'Your Name', bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );

  if (resume.headline) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resume.headline, italics: true, size: 24, color: '666666' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      })
    );
  }

  // Contact
  const contactParts: string[] = [];
  if (resume.contactInfo?.phone) contactParts.push(resume.contactInfo.phone);
  if (resume.contactInfo?.email) contactParts.push(resume.contactInfo.email);
  if (resume.contactInfo?.address) contactParts.push(resume.contactInfo.address);
  if (resume.contactInfo?.linkedIn) contactParts.push(resume.contactInfo.linkedIn);

  if (contactParts.length) {
    children.push(
      new Paragraph({ children: [new TextRun({ text: contactParts.join('  ·  '), size: 20, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 360 } })
    );
  }

  // Objective
  if (resume.careerObjective) {
    children.push(sectionTitle('CAREER OBJECTIVE'));
    children.push(new Paragraph({ children: [new TextRun({ text: resume.careerObjective, size: 22 })], spacing: { after: 240 } }));
  }

  // Experience
  if (resume.experience && resume.experience.length) {
    children.push(sectionTitle('EXPERIENCE'));
    resume.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.heading, bold: true, size: 22 }),
            new TextRun({ text: `  |  ${exp.duration}`, italics: true, size: 20, color: '666666' }),
          ],
          spacing: { after: 80 },
        })
      );
      const ach = splitSentences(exp.achievements || '');
      ach.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 80 } })));
    });
  }

  // Projects
  if (resume.projects && resume.projects.length) {
    children.push(sectionTitle('PROJECTS'));
    resume.projects.forEach((p) => {
      children.push(new Paragraph({ children: [new TextRun({ text: p.name, bold: true, size: 22 }), new TextRun({ text: `  |  ${p.duration}`, italics: true, size: 20, color: '666666' })], spacing: { after: 80 } }));
      const ach = splitSentences(p.achievements || '');
      ach.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 80 } })));
    });
  }

  // Skills
  if (resume.skills) {
    children.push(sectionTitle('SKILLS'));
    if (resume.skills.technical) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Technical Skills', bold: true, size: 22 })], spacing: { after: 80 } }));
      const tech = resume.skills.technical;
      if (tech.languages && tech.languages.length) children.push(kvLine('Languages', tech.languages.join(', ')));
      if (tech.frameworksAndLibraries && tech.frameworksAndLibraries.length) children.push(kvLine('Frameworks & Libraries', tech.frameworksAndLibraries.join(', ')));
      if (tech.toolsAndBuildSystems && tech.toolsAndBuildSystems.length) children.push(kvLine('Tools', tech.toolsAndBuildSystems.join(', ')));
      if (tech.testing && tech.testing.length) children.push(kvLine('Testing', tech.testing.join(', ')));
      if (tech.practices && tech.practices.length) children.push(kvLine('Practices', tech.practices.join(', ')));
    }
    if (resume.skills.soft && resume.skills.soft.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Soft Skills', bold: true, size: 22 })], spacing: { after: 80 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: resume.skills.soft.join(', '), size: 20 })], spacing: { after: 80 } }));
    }
    if (resume.skills.certifications && resume.skills.certifications.length) {
      children.push(new Paragraph({ children: [new TextRun({ text: 'Certifications', bold: true, size: 22 })], spacing: { after: 80 } }));
      resume.skills.certifications.forEach((c) => children.push(new Paragraph({ children: [new TextRun({ text: c, size: 20 })], bullet: { level: 0 }, spacing: { after: 80 } })));
    }
  }

  // Education
  if (resume.education && resume.education.length) {
    children.push(sectionTitle('EDUCATION'));
    resume.education.forEach((edu) => {
      const years = [edu.startYear, edu.endYear].filter(Boolean).join(' - ');
      children.push(new Paragraph({ children: [new TextRun({ text: edu.institution || '', bold: true, size: 22 }), new TextRun({ text: `  ${years}`, italics: true, size: 20, color: '666666' })], spacing: { after: 80 } }));
      if (edu.degree) children.push(new Paragraph({ children: [new TextRun({ text: edu.degree, size: 20 })], spacing: { after: 80 } }));
    });
  }

  // Awards
  if (resume.awards && resume.awards.length) {
    children.push(sectionTitle('AWARDS'));
    resume.awards.forEach((a) => children.push(new Paragraph({ children: [new TextRun({ text: a, size: 20 })], bullet: { level: 0 }, spacing: { after: 80 } })));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${(resume.name || 'resume').replace(/[^a-z0-9]/gi, '_')}.docx`;
  saveAs(blob, filename);
};

// Helpers
const sectionTitle = (text: string) => new Paragraph({ children: [new TextRun({ text, bold: true, size: 26 })], spacing: { before: 300, after: 160 } });
const kvLine = (key: string, value: string) => new Paragraph({ children: [new TextRun({ text: `${key}: `, bold: true, size: 20 }), new TextRun({ text: value, size: 20 })], spacing: { after: 80 } });
const splitSentences = (text: string) => (text?.match(/[^.!?]+(?:[.!?](?=\s|$))?/g) || []).map((s) => s.trim()).filter(Boolean);
