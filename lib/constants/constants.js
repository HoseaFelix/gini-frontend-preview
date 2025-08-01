import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";

// Set the worker source only in the browser
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"; // Local worker in public folder
}

export async function extractTextFromFile(file) {
  try {
    const fileType = file.type;

    // Handle PDF files
    if (fileType === "application/pdf") {
      // const arrayBuffer = await file.arrayBuffer();
      // const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // let text = "";
      // for (let i = 0; i < pdf.numPages; i++) {
      //   const page = await pdf.getPage(i + 1);
      //   const content = await page.getTextContent();
      //   const pageText = content.items.map((item) => item.str).join(" ");
      //   text += pageText + "\n";
      // }

      // return text.trim();
      toast('we cant process pdf for now, please bear with us as we get it fixed')
      throw new Error("Unsupported file type: " + fileType);
      
    }

    // Handle DOCX files
    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    }

    // Handle unsupported file types
    throw new Error("Unsupported file type: " + fileType);
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
}