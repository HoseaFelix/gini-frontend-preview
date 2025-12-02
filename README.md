# AiGeni - Resume & Cover Letter Management Suite

A modern, AI-powered web application for creating, editing, and managing professional resumes and cover letters. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and powered by **Google Gemini AI**.

## 🎯 Project Overview

AiGeni helps job seekers streamline their application process by providing:

- **Resume Manager**: Upload, parse, edit, and manage multiple resumes with AI-powered optimization
- **Cover Letter Generator**: Automatically generate tailored cover letters based on your resume and job description
- **AI Formatting & Enhancement**: Leverage Google Gemini AI to optimize resume content and generate professional cover letters
- **Multiple Templates**: Choose from 3 professional resume and 3 cover letter templates
- **Document Export**: Download your documents as DOCX or PDF with formatting preserved
- **Cloud Storage**: Save your documents to the cloud for later access
- **PDF to DOCX Conversion**: Convert PDF documents to editable Word format

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Key Features & Architecture](#key-features--architecture)
- [Component Guide](#component-guide)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Contributing Guidelines](#contributing-guidelines)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand (resumeStore, authStore)
- **HTTP Client**: Fetch API
- **Bundler**: Turbopack (dev), Webpack (build)

### Backend & Services
- **API Calls**: Next.js Server Actions + REST endpoints
- **AI Integration**: Google Gemini Flash 2.5 (via AI SDK)
- **Backend Server**: https://aidgeny.onrender.com (for document storage)
- **PDF Processing**: pdfjs-dist, pdf-lib, mammoth
- **File Handling**: file-saver, html-to-docx, html2canvas

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm / pnpm
- **Task Runner**: npm scripts

---

## 📂 Project Structure

```
aidegini-frontend/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Authentication pages (sign-in, sign-up, reset-password)
│   ├── (root)/                       # Main application routes
│   │   ├── coverlettergenerator/     # Cover letter creation flow
│   │   │   ├── covertemplate1-3/     # 3 template pages
│   │   │   └── components/           # SavedLetters, Overlay, etc.
│   │   ├── resumemanager/            # Resume management
│   │   │   ├── templates1-3/         # 3 resume template pages
│   │   │   └── components/           # UploadSequence, ManualInput, etc.
│   │   ├── dashboard/                # User dashboard
│   │   └── pdf2docxconverter/        # PDF to DOCX conversion tool
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── components/                       # Reusable components
│   ├── authForm.tsx                  # Login/signup form
│   ├── webviewer.tsx                 # PDF viewer
│   ├── TitleOverlay.tsx              # Save dialog overlay
│   ├── generalComponents/            # Button, Modal, Loading, etc.
│   ├── homepageComponents/           # Homepage sections
│   ├── userDashboardComponents/      # Dashboard UI
│   └── ui/                           # shadcn/ui components
├── lib/                              # Utilities & services
│   ├── actions/                      # Server actions
│   │   ├── general.actions.ts        # Text formatting, file extraction
│   │   └── resumeAction.ts           # Resume optimization with AI
│   ├── client/                       # Client-only utilities
│   │   └── docxExport.ts             # DOCX export helper (browser-only)
│   ├── constants/                    # Constants & server helpers
│   │   ├── constants.ts              # Helpers for saving/loading data
│   │   └── constants.js              # Frontend constants
│   ├── schemes/                      # Zod schemas
│   │   └── resumeSchema.ts           # Resume & CoverLetter types
│   └── utils.ts                      # Utility functions
├── store/                            # Zustand state stores
│   ├── resumeStore.ts                # Resume data store
│   └── store.ts                      # Auth & navigation store
├── types/                            # TypeScript types
│   └── index.d.ts                    # Global type definitions
├── public/                           # Static assets
│   ├── img/                          # Images
│   ├── icons/                        # SVG icons
│   └── lib/                          # External libraries (PDF.js)
├── constants/                        # App-wide constants
├── utils/                            # General utilities
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── postcss.config.mjs                # PostCSS config
└── README.md                         # This file
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/HoseaFelix/gini-frontend-preview.git
   cd aidegini-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) section)
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at **http://localhost:3000** (or next available port).

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with:

```env
# Google AI API (Gemini)
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here

# Backend API
NEXT_PUBLIC_API_URL=https://aidgeny.onrender.com

# (Optional) Other services
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**How to get API keys:**
- **Google Gemini API**: Visit [Google AI Studio](https://aistudio.google.com/apikey), create a free account, and generate an API key.
- **Backend**: Provided by project maintainers or self-hosted.

---

## 🚀 Running the Application

### Development Server
```bash
npm run dev
```
Runs Next.js with Turbopack for fast rebuilds. Open http://localhost:3000.

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

---

## 🎨 Key Features & Architecture

### 1. Resume Manager
- **Upload & Parse**: Users can upload PDF/DOCX resumes; text is extracted and parsed into structured JSON using AI.
- **AI Optimization**: Resume content can be rewritten and optimized for specific job descriptions.
- **Template Selection**: Choose from 3 professional layouts.
- **Inline Editing**: Edit resume sections directly in the template with real-time save to localStorage.
- **Cloud Storage**: Save to backend API for persistent storage and retrieval.

**Flow:**
1. User uploads a resume file → `uploadSequence.tsx`
2. Backend extracts text using Mammoth (DOCX) or PDF.js (PDF)
3. Text is formatted/parsed using AI → `formatTextWithAi()` (server action)
4. Parsed resume displayed in template for editing
5. User can optimize with job description → `optimizeResumeWithAi()` (server action)
6. Final resume can be saved to cloud or downloaded

### 2. Cover Letter Generator
- **Auto-Generation**: Creates a cover letter based on resume content and job description.
- **Template Styling**: 3 professional templates with consistent branding.
- **Editable Content**: All text fields are editable with auto-save to localStorage.
- **Cloud Integration**: Save generated letters to backend.

**Flow:**
1. User selects a resume and enters job description
2. AI generates cover letter → `writeCoverLetter()` (server action)
3. Cover letter displayed in chosen template
4. User can edit inline; changes auto-saved
5. Can be saved to cloud or downloaded

### 3. AI Integration
- **Gemini Flash 2.5**: Used for:
  - Parsing raw resume text into structured JSON
  - Optimizing resume content for specific jobs
  - Generating professional cover letters
- **Error Handling**: Timeouts and fallbacks implemented for reliability.

### 4. State Management

**Zustand Stores:**

- **`resumeStore.ts`**
  - `parsedResume`: Stores the parsed resume object
  - `optimizedResume`: Stores AI-optimized resume
  - `setParsedResume()`, `setOptimizedResume()`: Update state

- **`store.ts`**
  - `token`: Auth token for API calls
  - `currentNav`: Current page navigation
  - User authentication state

**localStorage:**
- `resume`: Currently edited resume
- `coverLetter`: Currently edited cover letter
- `savedResume`: List of saved resumes
- `savedCoverLetters`: List of saved cover letters
- `type`: Enum flag (e.g., 'new' or 'old' resume)

### 5. Document Export
- **DOCX Export**: Uses `html-to-docx` + `file-saver` (browser-only, dynamically imported)
- **PDF Export**: Uses browser print-to-PDF or jsPDF
- **Formatting**: CSS computed styles are inlined before export for consistent layout

---

## 🧩 Component Guide

### Key Template Pages

#### `app/(root)/resumemanager/templates1/page.tsx`
- Displays resume in a clean, professional layout
- Features:
  - Editable sections (name, headline, experience, education, skills, awards, projects)
  - Real-time save to localStorage via blur handlers
  - Export buttons (DOCX, PDF)
  - Save to cloud with title overlay

#### `app/(root)/coverlettergenerator/covertemplate1/page.tsx`
- Cover letter in professional format
- Features:
  - Editable name, email, headline fields
  - Editable hiring manager name and letter body
  - Paragraph management (add/remove paragraphs)
  - Export and save options

### Helper Components

- **`TitleOverlay.tsx`**: Modal for entering a title before saving
- **`UploadSequence.tsx`**: Multi-step resume upload and AI processing wizard
- **`ManualInput.tsx`**: Form for manually entering resume details
- **`SavedLetters.tsx`**: List and management of saved cover letters
- **`FormatButtons.tsx`**: Print formatting toggle buttons

### UI Components (shadcn/ui)
- `Button.tsx`: Styled button component
- `Dialog.tsx`: Modal dialogs
- `Popover.tsx`: Popover menus
- `Command.tsx`: Command palette / searchable lists

---

## 🎭 State Management Flow

### Resume Creation Flow
```
Upload File
  ↓
Extract Text (Mammoth/PDF.js)
  ↓
Format with AI (formatTextWithAi)
  ↓
Parse to ResumeType (Zod validation)
  ↓
Store in resumeStore + localStorage
  ↓
Display in Template (editable)
  ↓
User can optimize or save
```

### Cover Letter Flow
```
Select Resume + Job Description
  ↓
Call writeCoverLetter (AI generates)
  ↓
Parse to CoverLetter type
  ↓
Store in localStorage
  ↓
Display in Template (editable)
  ↓
Save to cloud or download
```

---

## 🔌 API Integration

### Backend Endpoints (https://aidgeny.onrender.com)

1. **Save Resume**
   ```
   POST /api/documents/json
   Headers: { Authorization: Bearer <token>, Content-Type: application/json }
   Body: { file_name: string, data: ResumeType }
   ```

2. **Save Cover Letter**
   ```
   POST /api/coverletter/save
   Headers: { Authorization: Bearer <token>, Content-Type: application/json }
   Body: { title: string, content: CoverLetter }
   ```

3. **Get Saved Resumes**
   ```
   GET /api/documents/list
   Headers: { Authorization: Bearer <token> }
   ```

### Server Actions (Next.js)

Located in `lib/actions/`:

- **`formatTextWithAi(rawText)`**: Parse resume text with AI
- **`optimizeResumeWithAi({description, rawResume, language})`**: Optimize resume for job
- **`writeCoverLetter({description, rawResume, language})`**: Generate cover letter with AI
- **`extractTextFromFile(file, token)`**: Extract text from PDF/DOCX

---

## 📝 Contributing Guidelines

### Code Style
- **TypeScript**: Use strict mode, avoid `any` except where necessary
- **Components**: Prefer functional components with React hooks
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Comments**: Add JSDoc comments for complex functions and unclear logic
- **Formatting**: Follow existing indentation and spacing

### Before Submitting a PR
1. Run linting: `npm run lint`
2. Test locally: `npm run dev`
3. Check for console errors and warnings
4. Update README if you add new features
5. Add comments to complex logic

### Common Patterns

**Setting up State with Persistence:**
```typescript
const [resume, setResume] = useState<ResumeType | null>(null);

const persistResume = (next: ResumeType | null) => {
  setResume(next);
  try {
    if (next) localStorage.setItem('resume', JSON.stringify(next));
    else localStorage.removeItem('resume');
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
};
```

**Handling Contenteditable Fields:**
```typescript
const handleFieldBlur = (path: Array<string | number>) => (e: React.FocusEvent<HTMLElement>) => {
  const text = (e.currentTarget as HTMLElement).innerText ?? '';
  const trimmed = text.trim();
  // Update state with nested path
  const next = setByPath(resume, path, trimmed);
  persistResume(next);
};
```

**Dynamic Imports (Client-Only Code):**
```typescript
// In a client event handler
const mod = await import('@/lib/client/docxExport');
const exportFn = mod.default;
await exportFn(elementRef, 'filename');
```

---

## 🐛 Troubleshooting

### "Port 3000 is in use"
The dev server will automatically use the next available port (e.g., 3001). You can also manually kill the process:
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### AI API errors
- Check that `NEXT_PUBLIC_GOOGLE_API_KEY` is valid
- Verify network connectivity
- Check browser console for detailed error messages
- Test the API key in [Google AI Studio](https://aistudio.google.com/)

### Document export returns blank
- Ensure the element you're exporting has content
- Check browser console for errors during export
- Try exporting a smaller section first to isolate the issue

### localStorage warnings
- These are benign in some browsers; data is still saved
- Clear browser cache if localStorage seems corrupted

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Store Documentation](https://github.com/pmndrs/zustand)
- [Google Gemini API](https://ai.google.dev/)
- [Zod Validation](https://zod.dev/)

---

## 📄 License

This project is part of the AiGeni suite. All rights reserved unless otherwise specified.

---

## 👥 Support & Contact

For issues, feature requests, or questions:
- **GitHub Issues**: Open an issue in the repository
- **Email**: [Contact maintainer]
- **Documentation**: See inline comments and this README

---

**Happy documenting! 🚀**