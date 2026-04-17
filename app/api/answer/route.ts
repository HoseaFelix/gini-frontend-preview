import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Missing request body. Send { text: string }." },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = `
You are an exam assistant AI. The visible text below may include one or more questions from a web page.
Your job is to answer the questions clearly and concisely.
Respond with numbered answers, separated by commas, so the user can read them easily.
For example: 1. Answer one, 2. Answer two, 3. Answer three
Do not include extra paragraphs or unrelated commentary.
If a question cannot be answered, respond with "Unable to answer" for that item.

Visible screen text:
"""${text}"""
`;

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      temperature: 0.2,
    });

    const answerText = result.text?.trim() ?? "";

    return NextResponse.json({ success: true, answer: answerText }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("/api/answer error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
