
import { toast } from "sonner";

export const exportAsDocx = (containerSelector: string, fileName: string) => {
  const content = document.querySelector(containerSelector) as HTMLElement | null;

  if (!content) {
    toast.error("Export container not found");
    return;
  }

  // Create a simple HTML structure with basic styling
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${fileName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            font-size: 12pt; 
            line-height: 1.4;
            margin: 1in;
            color: #000000;
          }
          .flex { display: block; }
          .flex > * { display: block; margin: 10px 0; }
          div, p { margin: 8px 0; }
          h1 { font-size: 18pt; margin: 16px 0; }
          h2 { font-size: 16pt; margin: 14px 0; }
          h3 { font-size: 14pt; margin: 12px 0; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `;

  // Method 1: Try using iframe method
  const blob = new Blob([html], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.docx`;
  link.click();
  
  toast.success("Document downloaded!");
};