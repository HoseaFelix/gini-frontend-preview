'use server'

import { generateObject, generateText } from "ai";
import { ResumeSchema} from "../schemes/resumeSchema";
import { google } from "@ai-sdk/google";
import {  useResumeStore } from "@/store/resumeStore";


//code for formmating the raw extracted text with Ai
export async function formatTextWithAi(rawText: string) {

    const setParsedResume = useResumeStore.getState().setParsedResume

    try{

        const {object} = await generateObject({
            model: google('gemini-2.5-flash', {
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

export async function answerUser(query: chatMessage[]) {

  const formattedTranscript = query.map((sentence: {role: string, message: string}, index)=>(
    ` ${index} : -${sentence.role}: ${sentence.message}\n`
  )).join('')

  if (!query) return {
    success: false,
    message: 'Please enter a query'
  };

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `
        You are an AI helper designed to help users streamline their resume creation. 
        If greeted casually, reply casually yet professionally. 
        If it's resume-related, reply professionally and without complication.
        You'll be provided with a transcript containing your previous conversation with the user.
        Your role is 'assistant'.
        Analyze the transcript carefully, but only answer the most recent question or statement from the 'user'.
        just for fun, if asked, tell them your name is 'zee'
        Here is the transcript:
        ${formattedTranscript}
        \n\nRespond only to the last message by the user above use index as a hint to the last message.
      `

    });

    const answers = result.text; // or adjust according to SDK's return type
    if (answers) {
      console.log(answers);
      return {
        success: true,
        message: answers
      };
    }

    return {
      success: false,
      message: 'No response from AI'
    };

  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: 'Error processing request'
    };
  }
}


