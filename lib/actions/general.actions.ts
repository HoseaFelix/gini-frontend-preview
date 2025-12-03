'use server'

/**
 * @file Server actions for AI-powered resume processing and user assistance
 * These actions run on the server and use Google Gemini AI for NLP tasks
 * 
 * Important: These are server-side functions that should NOT be called directly from client-side
 * Use them via Next.js Server Actions pattern
 */

import { generateObject, generateText } from "ai";
import { ResumeSchema } from "../schemes/resumeSchema";
import { google } from "@ai-sdk/google";
import { useResumeStore } from "@/store/resumeStore";

/**
 * formatTextWithAi - Parses raw resume text into structured JSON using Google Gemini
 * 
 * This function:
 * 1. Takes raw resume text (from PDF/DOCX extraction)
 * 2. Sends it to Google Gemini 2.5 Flash model
 * 3. Validates the response against ResumeSchema (Zod)
 * 4. Stores the parsed resume in Zustand store
 * 5. Returns success/error response
 * 
 * @param {string} rawText - Raw resume text extracted from uploaded file
 * @returns {Promise<{success: boolean, parsedResume?: ResumeType, error?: any}>}
 * 
 * @example
 * const result = await formatTextWithAi(extractedText);
 * if (result.success) {
 *   console.log(result.parsedResume); // Use the structured resume data
 * }
 */
export async function formatTextWithAi(rawText: string) {
  const setParsedResume = useResumeStore.getState().setParsedResume;

  try {
    // Call Gemini AI with resume schema to enforce structured output
    const { object } = await generateObject({
      model: google('gemini-2.5-flash', {
        structuredOutputs: false,
      }),
      schema: ResumeSchema,
      prompt: `
        You are a resume parsing assistant. Convert the following raw resume text into a structured JSON.
        
        Some fields may be missing in the original text — that's okay. Just include what you can detect.
        Fields like education, name, contact and experience are very important. Make sure you return any field that you can detect.

        Now convert this:
        
        Text:
        """${rawText}"""
      `,
    });

    // Validate parsed object against schema
    const parsed = ResumeSchema.safeParse(object);
    if (parsed.success) {
      setParsedResume(parsed.data);
      console.log("Resume parsed successfully:", parsed.data);
      return {
        success: true,
        parsedResume: parsed.data,
      };
    }
  } catch (err) {
    console.error("Error parsing resume text:", err);
    return {
      success: false,
      error: err,
    };
  }
}

/**
 * Type for chat message in conversation
 */
type chatMessage = {
  role: 'user' | 'assistant';
  message: string;
};

/**
 * answerUser - AI-powered conversational assistant for resume-related queries
 * 
 * This function:
 * 1. Takes a conversation history (transcript)
 * 2. Sends it to Gemini for analysis
 * 3. Responds to the user's most recent message
 * 4. Returns a professional, helpful response
 * 
 * @param {chatMessage[]} query - Array of previous messages in conversation
 * @returns {Promise<{success: boolean, message: string}>}
 * 
 * @example
 * const response = await answerUser([
 *   { role: 'user', message: 'How should I format my experience?' },
 *   { role: 'assistant', message: '...' },
 *   { role: 'user', message: 'Any tips for writing achievements?' }
 * ]);
 */
export async function answerUser(query: chatMessage[]) {
  // Format conversation history for AI context
  const formattedTranscript = query.map((sentence: { role: string; message: string }, index) => (
    `${index}: ${sentence.role}: ${sentence.message}\n`
  )).join('');

  if (!query) {
    return {
      success: false,
      message: 'Please enter a query',
    };
  }

  try {
    // Send conversation to AI for response generation
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `
        You are an AI helper designed to help users streamline their resume creation. 
        If greeted casually, reply casually yet professionally. 
        If it's resume-related, reply professionally and without unnecessary complication.
        
        You'll be provided with a transcript of the conversation history.
        Your role is 'assistant'.
        
        Analyze the transcript carefully, but ONLY answer the most recent question or statement from the 'user'.
        Fun fact: if asked, you can say your name is 'Zee'.
        
        Conversation history:
        ${formattedTranscript}
        
        Respond only to the last user message above.
      `,
    });

    const answers = result.text;
    if (answers) {
      console.log("AI response:", answers);
      return {
        success: true,
        message: answers,
      };
    }

    return {
      success: false,
      message: 'No response from AI',
    };

  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: 'Error processing request'
    };
  }
}


