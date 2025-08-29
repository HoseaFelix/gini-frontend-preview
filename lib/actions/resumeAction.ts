'use server'

import { generateObject } from "ai";
import { ResumeSchema } from "../schemes/resumeSchema";
import { google } from "@ai-sdk/google";
import { useOptimizedStore } from "@/store/resumeStore";
import { z } from "zod";


const KeywordSchema = z.object({
  hard_skills: z.array(z.string()),
  soft_skills: z.array(z.string()),
  tools: z.array(z.string()),
  certifications: z.array(z.string()),
  industry_terms: z.array(z.string()),
});

/**
 * Step 1: Extract keywords from job description
 */
async function extractKeywords(description: string) {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: KeywordSchema,
    prompt: `
      Extract all essential ATS keywords from the job description exactly as written, 
      preserving their original casing and spelling.
      
      Also include:
      - Synonyms and common variations (e.g., "JavaScript (ES6+)" and "JavaScript" and "ES6").
      - Related industry terms that recruiters may use for the same concept.
      
      Categorize into:
        - hard_skills (technical abilities)
        - soft_skills (communication, teamwork, etc.)
        - tools (frameworks, libraries, platforms, build tools)
        - certifications (degrees, certifications, or training)
        - industry_terms (role-specific jargon and methodologies)
      
      Important rules:
      - Return ONLY JSON matching the schema.
      - Do not add explanations or notes.
      - No duplicates in any array.

      JOB DESCRIPTION:
      """${description}"""
    `
  });

  return object;
}

/**
 * Step 2: Rewrite resume to integrate keywords
 */
async function rewriteResume(rawResume: unknown, description: string, keywords: unknown, language:string) {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash', {
      structuredOutputs: false,
    }),
    schema: ResumeSchema,
    prompt: `
        You are a professional ATS resume optimizer.

        TASK:
        - the heading is actually the role(e.g frontend developer, don't confuse it for the career objective, return only the role there, career objective is highly important dont skip)
        - Rewrite the given resume to integrate ALL provided keywords naturally and strategically.
        - Use exact keyword matches wherever possible to improve ATS score.
        - Place keywords in:
            1. Skills section (grouped logically).
            2. Career Objective / Summary (to hit early ATS parsing).
            3. Relevant Experience bullet points (using action verbs + metrics).
        - Maintain professional tone and human readability.
        - Do NOT fabricate experience(unless its not provided) — only adjust phrasing to match job description language you can also add more to ensure its ATS compatible to the maximum degree.
        - you can fabricate projects to boost the ATS, but make it revolve around the experience
        - Keep bullet points concise, use measurable results where possible.
        - Preserve and highlight existing metrics (e.g., percentages, time savings).
        - Format for ATS parsing:
            * No text boxes, columns, or graphics.
            * Use simple headings.
        - Maintain JSON format as per ResumeSchema exactly — no extra text.
        - Prioritize keyword coverage without keyword stuffing.
        - push for the highest ATS score possible aggressively, but proffessionally
        please dont add asterics or any formatting, formatting will be done manually.
        -return in the selected language, if no language is selected, return in english 

      KEYWORDS TO MATCH:
      ${JSON.stringify(keywords)}

      JOB DESCRIPTION:
      """${description}"""

      CURRENT RESUME:
      """${JSON.stringify(rawResume)}"""

        Language:
      """${language}"""
      
      Return only a JSON object in the ResumeSchema format.

      Thank you
    `
  });

  return object;
}

/**
 * Main function combining both steps
 */
export async function optimizeResumeWithAi({ description, rawResume, language }: { description: string, rawResume: unknown, language:string }) {
  console.log('Started optimization process');

  const setParsedResume = useOptimizedStore.getState().setParsedResume;
 

  try {
    // Step 1: Extract keywords
    console.log('Extracting keywords...');
    const keywords = await extractKeywords(description);
    console.log('Keywords extracted:', keywords);

    // Step 2: Rewrite resume with keywords
    console.log('Rewriting resume...');
    const optimizedResume = await rewriteResume(rawResume, description, keywords, language);
    console.log('Optimized Resume:', optimizedResume);

    const parsed = ResumeSchema.safeParse(optimizedResume);
    if (parsed.success) {
      setParsedResume(parsed.data);
      return { success: true, parsedResume: parsed.data };
    } else {
      return { success: false, error: 'Schema validation failed' };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
}
