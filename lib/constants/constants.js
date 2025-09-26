import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source only in the browser
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"; // Local worker in public folder
}

export async function extractTextFromFile(file, token) {
  try {
    const fileType = file.type;


    const formData = new FormData();
    formData.append("file", file);
    // Handle PDF files
    if (fileType === "application/pdf") {
    
        try{

          console.log('started upload')

          const res = await fetch("https://aidgeny.onrender.com/api/documents/process", {
            method: "POST",
            headers:{"Authorization": `Bearer ${token}`},
            
            body:formData
          })


          const data = await res.json()
          console.log(data)


        } catch (e) {
          console.log(e)
        }


      // throw new Error("Unsupported file type: " + fileType);
      
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