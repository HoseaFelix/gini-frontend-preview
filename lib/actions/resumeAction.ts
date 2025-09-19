'use server'

import { generateObject } from "ai";
import { CoverLetterSchema, ResumeSchema, ResumeType } from "../schemes/resumeSchema";
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

// Preprocessing utilities
function cleanAndTruncateText(text: string, maxLength: number = 8000): string {
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s\-.,;:()\[\]]/g, '') // Remove special chars
    .trim()
    .substring(0, maxLength);
}

function extractEssentialJobInfo(description: string): string {
  // const sections = description.toLowerCase();
  const importantSections = [
    'requirements', 'skills', 'qualifications', 'experience',
    'responsibilities', 'duties', 'must have', 'preferred'
  ];
  
  // Extract only relevant sections if they exist
  const lines = description.split('\n');
  const relevantLines = lines.filter(line => 
    importantSections.some(section => 
      line.toLowerCase().includes(section)
    )
  );
  
  return relevantLines.length > 0 
    ? relevantLines.join('\n').substring(0, 4000)
    : cleanAndTruncateText(description, 4000);
}

/**
 * Step 1: Extract keywords with chunking and timeout
 */
async function extractKeywords(description: string) {
  const cleanedDescription = extractEssentialJobInfo(description);
  
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Keyword extraction timeout')), 30000)
  );

  const extractionPromise = generateObject({
    model: google('gemini-2.5-flash'),
    schema: KeywordSchema,
    prompt: `Extract ATS keywords from this job posting. Focus on:
    - Technical skills mentioned
    - Required tools/frameworks  
    - Soft skills listed
    - Certifications/degrees
    - Industry terminology
    
    Return concise, exact matches only.
    
    JOB POSTING:
    """${cleanedDescription}"""`,
  });

  const { object } = await Promise.race([extractionPromise, timeoutPromise]) as any;
  console.log(object)
  return object;
}

/**
 * Step 2: Chunk resume content for processing
 */
function chunkResumeContent(resume: any) {
  return {
    core: {
      heading: resume.heading || '',
      career_objective: resume.careerObjective || '',
      skills: resume.skills || []
    },
    experience: (resume.experience || []).slice(0, 3), // Limit to recent experience
    education: resume.education || [],
    projects: (resume.projects || []).slice(0, 2), // Limit projects
    awards: (resume.awards || [])
  };
}

/**
 * Step 2: Optimized resume rewriting
 */
async function rewriteResume(rawResume: ResumeType, description: string, keywords: unknown, language: string) {
  const chunkedResume = chunkResumeContent(rawResume);
  const shortDescription = cleanAndTruncateText(description, 2000);
  
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Resume rewrite timeout')), 45000)
  );

  const rewritePromise = generateObject({
    model: google('gemini-2.5-flash'),
    schema: ResumeSchema,
    prompt: `Optimize this resume for ATS using these keywords: ${JSON.stringify(keywords)}

    Rules:
    - Integrate keywords naturally in skills, experience, and objective
    - fabricate experience only when no experience was provide, if provided, rewrite the current experience so as to integrate the keywords and match the description.
    - fabricate achievments only when you have not successfully integrated all ATS keywords, if provided, rewrite experience to include keywords
    - Keep existing metrics and achievements
    - Focus on recent experience only
    - Use ${language} language
    - Return valid JSON only
    - headline is very important, dont omit it for anything, the headline is actally the job role e.g 'front end developer".

    RESUME: ${JSON.stringify(chunkedResume)}
    JOB: ${shortDescription}`,
  });

  const { object } = await Promise.race([rewritePromise, timeoutPromise]) as any;
  return object;
}

/**
 * Main optimized function with parallel processing where possible
 */
export async function optimizeResumeWithAi({ 
  description, 
  rawResume, 
  language 
}: { 
  description: string, 
  rawResume: ResumeType, 
  language: string 
}) {
  console.log('Started optimization process');
  
  const setParsedResume = useOptimizedStore.getState().setParsedResume;

  try {
    // Input validation and preprocessing
    if (!description?.trim() || !rawResume) {
      return { success: false, error: 'Invalid input data' };
    }

    // Step 1: Extract keywords with timeout
    console.log('Extracting keywords...');
    const keywordsPromise = extractKeywords(description).catch(err => {
      console.warn('Keyword extraction failed, using fallback', err);
      return { hard_skills: [], soft_skills: [], tools: [], certifications: [], industry_terms: [] };
    });

    const keywords = await keywordsPromise;
    console.log('Keywords extracted:', Object.keys(keywords));

    // Step 2: Rewrite resume (now much faster with preprocessing)
    console.log('Rewriting resume...');
    const optimizedResume = await rewriteResume(rawResume, description, keywords, language);

   
    const parsed = ResumeSchema.safeParse(optimizedResume);
    if (parsed.success) {
      setParsedResume(parsed.data);
      return { success: true, parsedResume: parsed.data };
    } else {
      console.error('Schema validation failed:', parsed.error);
      return { success: false, error: 'Invalid resume format generated' };
    }
    
  } catch (err) {
    console.error('Optimization failed:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
}

// Optional: Add caching for repeated job descriptions
const keywordCache = new Map<string, any>();

export async function getCachedKeywords(description: string) {
  const hash = description.substring(0, 100); // Simple hash
  return keywordCache.get(hash);
}

export async function setCachedKeywords(description: string, keywords: any) {
  const hash = description.substring(0, 100);
  keywordCache.set(hash, keywords);
}


export async function writeCoverLetter ({ 
  description, 
  rawResume, 
  language 
}: { 
  description: string, 
  rawResume: unknown, 
  language: string 
}){


  const chunkedResume = chunkResumeContent(rawResume);
  const shortDescription = cleanAndTruncateText(description, 2000);

   const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Resume rewrite timeout')), 45000)
  );

  const rewritePromise = generateObject({
    model: google('gemini-2.5-flash'),
    schema: CoverLetterSchema,
    prompt: `

      Generate a professional cover letter in ${language}.  
      Return valid JSON only in this structure:
      {
        "hiringManagerName": "string",
        "letter": ["paragraph1", "paragraph2", ...]
      }

      Rules:
      - hiringManagerName: if a name exists in the job description, use it; otherwise return "Hiring Manager".
      - letter: array of multiple paragraphs (300–400 words total).
        - Intro: enthusiasm for the role/company.
        - Body: highlight recent/relevant skills, experiences, and achievements; integrate job description keywords naturally.
        - Conclusion: reiterate interest, request interview, polite closing.
      - Preserve provided achievements/metrics; rewrite experience if needed to fit keywords.
      - Fabricate context/achievements only if necessary to cover all key skills.
      - Keep tone professional, confident, and concise.

      RESUME: ${JSON.stringify(chunkedResume)}  
      JOB: ${shortDescription}
      }`,
  });

  const { object } = await Promise.race([rewritePromise, timeoutPromise]) as any;
  return object;


}