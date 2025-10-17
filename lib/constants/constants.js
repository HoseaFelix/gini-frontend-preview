import { useAuthStore } from "@/store/store";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";

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

          if(data.success){
            return data.data
          } else{
            return data.error
          }


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

export async function getSavedResume () {
   const token = useAuthStore.getState().token;

  try{
    console.log('started resume retrieval')
    const res = await fetch("https://aidgeny.onrender.com/api/documents/", {
      method: "GET",
      headers:{"Authorization": `Bearer ${token}`},
    })

    const data = await res.json()

    
    if(data.success){
      console.log(data)
      localStorage.setItem( 'savedResume', JSON.stringify(data.data))
    }
  } catch (e){
    console.error(e)
  }
  
}

export async function getSavedCoverLetter () {
   const token = useAuthStore.getState().token;

  try{
    console.log('started resume retrieval')
    const res = await fetch("https://aidgeny.onrender.com/api/coverletters/", {
      method: "GET",
      headers:{"Authorization": `Bearer ${token}`},
    })

    const data = await res.json()

    
    if(data.success){
      console.log(data)
      localStorage.setItem( 'savedCoverLetters', JSON.stringify(data.data))
    }
  } catch (e){
    console.error(e)
  }
  
}

export const handleDeleteResume = async (id)=>{
  const token = useAuthStore.getState().token;
  try{
    console.log('deleting ...')

    const res = await fetch(`https://aidgeny.onrender.com/api/documents/${id}`, {
      method: "DELETE",
      headers:{"Authorization": `Bearer ${token}`},
    })

    const data = await res.json()

    
    if(data.success){
      toast.success(data.data)
      getSavedResume()
      return data
    }
  } catch (e){
    console.error(e)
  }     
}
export const handleDeleteCoverLetter = async (id)=>{
  const token = useAuthStore.getState().token;
  try{
    console.log('deleting ...')

    const res = await fetch(`https://aidgeny.onrender.com/api/coverletters/${id}`, {
      method: "DELETE",
      headers:{"Authorization": `Bearer ${token}`},
    })

    const data = await res.json()

    
    if(data.success){
      toast.success(data.data)
      console.log(data)
      return data
    }
  } catch (e){
    console.error(e)
  }     
}

export  const handleSaveCoverletter = async (payload)=>{

      const token = useAuthStore.getState().token;

    try{
      toast('started uploading')

      const res = await fetch("https://aidgeny.onrender.com/api/coverletters/", {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",

        },


        body: JSON.stringify(payload),


      })

      const data = await res.json()
      console.log(data)
      if(data.success){
        toast.success('coverletter saved successfully!')

        return{
          success:true
        }
      } else {
        toast.error(data.error)
        return{
          success:false
        }
      }

    } catch (e){
      console.error(e)
      toast.error(e.message)
      return{success:false}
    }

  }