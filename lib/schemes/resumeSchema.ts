// lib/schema/resumeSchema.ts
import { z } from "zod";

export const ResumeSchema = z.object({
  name: z.string().optional(),
  headline:z.string().optional(), //e.g frontend developer
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    linkedIn: z.string().optional(),
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string().optional(),
    startYear: z.string().optional(),
    endYear: z.string().optional(), // can be 'Ongoing'
  })).optional(),

  skills: z.object({
    technical: z.object({
      languages: z.array(z.string()).optional(),
      frameworksAndLibraries: z.array(z.string()).optional(),
      toolsAndBuildSystems: z.array(z.string()).optional(),
      testing: z.array(z.string()).optional(),
      practices: z.array(z.string()).optional(),
    }).optional(),
    soft: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional()
  }).optional(),
  

  awards: z.array(z.string()).optional(),

  careerObjective: z.string().optional(),

  experience: z.array(z.object({
    heading: z.string(),
    duration: z.string(), // e.g. "Jan 2022 - Present"
    achievements: z.string()
  })).optional(),

  projects: z.array(z.object({
    name: z.string(),
    duration: z.string(),
    achievements: z.string()
  })).optional()
});

export type ResumeType = z.infer<typeof ResumeSchema>;

export const CoverLetterSchema = z.object({
  hiringManagerName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  headline: z.string().optional(),

  // Array of paragraphs
  letter: z.array(z.string().min(1, "Paragraph cannot be empty")),
});

export type CoverLetter = z.infer<typeof CoverLetterSchema>;