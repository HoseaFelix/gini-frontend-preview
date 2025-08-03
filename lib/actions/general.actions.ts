'use server'

import { generateObject } from "ai";
import { ResumeSchema} from "../schemes/resumeSchema";
import { google } from "@ai-sdk/google";
import { useOptimizedStore, useResumeStore } from "@/store/resumeStore";


//code for formmating the raw extracted text with Ai
export async function formatTextWithAi(rawText: string) {

    const setParsedResume = useResumeStore.getState().setParsedResume

    try{

        const {object} = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: ResumeSchema,
            prompt: `
            
            You are a resume parsing assistant. Convert the following raw resume text into a structured JSON in this format:
            
            {
              name: string,
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
            
            Some fields may be missing in the original text — that's okay. Just include what you can detect.

            Example:
            Text:
            """
            John Doe
            Software Engineer at ABC Corp (Jan 2021 - Present)
            - Led the redesign of the main platform, improving performance by 30%
            - Introduced CI/CD pipelines
            """

            JSON:
            {
              name: "John Doe",
              experience: [
                {
                  heading: "Software Engineer at ABC Corp",
                  duration: "Jan 2021 - Present",
                  achievements: [
                    "Led the redesign of the main platform, improving performance by 30%",
                    "Introduced CI/CD pipelines"
                  ]
                }
              ]
            }

            Now convert this:
            
            Text:
            """${rawText}"""
            
            """""""""""""

            `
            
        
        })

        const parsed = ResumeSchema.safeParse(object);
        if (parsed.success) {
            setParsedResume(parsed.data)
            console.log(parsed.data)
            return{
              success:true
            }
        }
    } catch(err){
        return{
          success:false,
          error: err
        }
    }

    
}
export async function optimizeResumeWithAi({description, }: {description: string, }) {


    console.log('started optimizing')
    const setParsedResume = useOptimizedStore.getState().setParsedResume
    const rawText = JSON.stringify(useResumeStore.getState().parsedResume)
    console.log(rawText)

    try{

        const {object} = await generateObject({
            model: google('gemini-2.0-flash-001', {
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
            return{
              success:true
            }
        }
    } catch(err){
        return{
          success:false,
          error: err
        }
    }

    
}