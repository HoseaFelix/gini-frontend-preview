// lib/schema/resumeSchema.ts
import { z } from "zod";

export const ResumeSchema = z.object({
  name: z.string().optional(),
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

  skills: z.array(z.string()).optional(),

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
