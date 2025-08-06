'use server'

import { generateObject } from "ai";
import { ResumeSchema} from "../schemes/resumeSchema";
import { google } from "@ai-sdk/google";
import {  useResumeStore } from "@/store/resumeStore";


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
              headline: string,
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
            software Engineer
            Software Engineer at ABC Corp (Jan 2021 - Present)
            - Led the redesign of the main platform, improving performance by 30%
            - Introduced CI/CD pipelines
            """

            JSON:
            {
              name: "John Doe",
              headline: "Software Engineer"
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
