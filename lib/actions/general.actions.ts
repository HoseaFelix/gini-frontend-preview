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
export async function optimizeResumeWithAi({description}: {description: string}) {

    const rawText = useResumeStore.getState().parsedResume;

    const setParsedResume = useOptimizedStore.getState().setParsedResume

    try{

        const {object} = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: ResumeSchema,
            prompt: `
            
            You are a resume optimizer, your job is to optimize the resume so that it can attract hiring companies, you'll be provided with the initial resume, find and edit it to be proffessional and eyecatching, you can reduce parts that are not neccessary, add to some, change some entirely, just edit the ones you can edit, you will also be provided with a job description, optimize the resume to fit the job description. if theres no job description, just edit the ones you can and leave the rest. return the following format:
            
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

            Description: 
            """"""""""""
            ${description}
            """""""""""""

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