import { useAuthStore } from '@/store/store'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import { toast } from 'sonner'
import { PDFDocument } from 'pdf-lib'

// If you need docx creation server-side, keep docx imports here; but the
// DOM-dependent exporters (html-to-docx, file-saver, html2canvas, jspdf)
// must only be used in browser code. generateDocx has been moved to a
// client-only helper at '@/lib/client/docxExport'.

// Set PDF worker in browser only
if (typeof window !== 'undefined') {
  try {
    ;(pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
  } catch {
    // ignore in non-browser contexts
  }
}

export async function extractTextFromFile(file: File, token?: string) {
  try {
    const fileType = file.type


    const formData = new FormData()
    formData.append('file', file)
    // Handle PDF files
    if (fileType === 'application/pdf') {
      try {
        const res = await fetch('https://aidgeny.onrender.com/api/documents/process', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        })

        const data = await res.json()
        if (data.success) return data.data
        return data.error
      } catch (err) {
        console.error(err)
      }
    }

    // Handle DOCX files
    if (
      fileType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value.trim()
    }

    throw new Error('Unsupported file type: ' + fileType)
  } catch (error) {
    console.error('Error extracting text from file:', error)
    throw error
  }
}

export async function getSavedResume() {
  const token = useAuthStore.getState().token
  try {
    const res = await fetch('https://aidgeny.onrender.com/api/documents/', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem('savedResume', JSON.stringify(data.data))
    }
  } catch (err) {
    console.error(err)
  }
}

export async function getSavedCoverLetter() {
  const token = useAuthStore.getState().token
  try {
    const res = await fetch('https://aidgeny.onrender.com/api/coverletters/', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem('savedCoverLetters', JSON.stringify(data.data))
    }
  } catch (err) {
    console.error(err)
  }
}

export const handleDeleteResume = async (id: string) => {
  const token = useAuthStore.getState().token
  try {
    const res = await fetch(`https://aidgeny.onrender.com/api/documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.success) {
      toast.success(data.data)
      await getSavedResume()
      return data
    }
  } catch (err) {
    console.error(err)
  }
}

export const handleDeleteCoverLetter = async (id: string) => {
  const token = useAuthStore.getState().token
  try {
    const res = await fetch(`https://aidgeny.onrender.com/api/coverletters/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.success) {
      toast.success(data.data)
      return data
    }
  } catch (e) {
    console.error(e)
  }
}

export const handleSaveCoverletter = async (payload: any) => {
  const token = useAuthStore.getState().token
  try {
    toast('started uploading')
    const res = await fetch('https://aidgeny.onrender.com/api/coverletters/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('coverletter saved successfully!')
      return { success: true }
    } else {
      toast.error(data.error)
      return { success: false }
    }
  } catch (err: any) {
    console.error(err)
    toast.error(err?.message)
    return { success: false }
  }
}

export async function generatePDF(elementId: string) {
  if (typeof document === 'undefined') throw new Error('generatePDF must run in browser')
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Element not found: ' + elementId)
  // Dynamically import html-to-image in the browser only so bundlers don't
  // include it in server-side bundles. Importing at module scope caused
  // html-to-image (and its DOM-only deps) to be pulled into server chunks
  // which led to runtime/module resolution errors in dev.
  let toPng: any
  try {
    const mod = await import('html-to-image')
    toPng = (mod && (mod.toPng || mod.default && mod.default.toPng)) || mod.toPng
  } catch (err) {
    console.error('Failed to load html-to-image dynamically', err)
    throw err
  }

  const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 })
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const pngImage = await pdfDoc.embedPng(dataUrl)
  const imgWidth = pngImage.width
  const imgHeight = pngImage.height
  page.setSize(imgWidth, imgHeight)
  page.drawImage(pngImage, { x: 0, y: 0, width: imgWidth, height: imgHeight })
  return await pdfDoc.save()
}

// generateDocx intentionally throws to avoid accidental server-side usage.
export const generateDocx = async () => {
  throw new Error("generateDocx was moved to a client-only module. Dynamically import '@/lib/client/docxExport' on the client and call its default export instead.")
}