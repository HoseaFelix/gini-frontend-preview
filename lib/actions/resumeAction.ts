'use server'

import { generateObject } from "ai";
import { ResumeSchema} from "../schemes/resumeSchema";
import { google } from "@ai-sdk/google";
import { useOptimizedStore, useResumeStore } from "@/store/resumeStore";

export async function optimizeResumeWithAi({description, }: {description: string, }) {


    console.log('started optimizing')
    const setParsedResume = useOptimizedStore.getState().setParsedResume
    const rawText = JSON.stringify(useResumeStore.getState().parsedResume)
    console.log(rawText)

    try{

        const {object} = await generateObject({
            model: google('gemini-2.5-flash', {
                structuredOutputs: false,
            }),
            schema: ResumeSchema,
            
            prompt: `
            You are a professional resume optimizer. Your job is to take a parsed resume object and improve it to be professional, attractive, and tailored for recruiters — while strictly keeping the same structure and all original fields.

            You will receive:
            1. A raw parsed resume text.
            2. A job description (optional).

            Your task:
            - Edit and enhance each section to sound more polished and impactful.
            - Remove filler or redundant details.
            - Expand vague points with stronger wording or clearer accomplishments.
            - If a job description is provided, adjust the resume content to match relevant keywords, skills, and tone — **without fabricating experience**.
            - Do NOT remove any top-level keys. Always return:
              - name
              -headline(eg: software engineer)
              - contactInfo (with phone, email, address, linkedIn)
              - education (array)
              - skills (array)
              - awards (array)
              - careerObjective (string)
              - experience (array)
              - projects (array)
            - If any section is missing in the input, return it as an empty array or string.

            Keep the final output in this exact JSON format:

            {
              name: string,
              headline: "Software Engineer",
              contactInfo: {
                phone: string,
                email: string,
                address: string,
                linkedIn: string
              },
              education: [
                {
                  institution: string,
                  degree?: string,
                  startYear?: string,
                  endYear?: string
                }
              ],
              skills: [string],
              awards: [string],
              careerObjective: string,
              experience: [
                {
                  heading: string,
                  duration: string,
                  achievements: [string]
                }
              ],
              projects: [
                {
                  name: string,
                  duration: string,
                  achievements: [string]
                }
              ]
            }

            Do not include any commentary or explanations. Only return a valid JSON object matching the schema.

            Description (if any):
            """${description}"""

            Raw Resume Text:
            """${rawText}"""
            `
            
        
        })

        console.log("Raw AI response:", object);
        const parsed = ResumeSchema.safeParse(object);
        if (parsed.success) {
            setParsedResume(parsed.data)
            console.log(parsed.data)
            return {
              success: true,
              parsedResume: parsed.data
            }
        }
    } catch(err){
        return{
          success:false,
          error: err
        }
    }

    
}