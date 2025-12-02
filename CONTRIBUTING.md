# 🚀 AiGeni Developer Onboarding Guide

Welcome to the AiGeni project! This guide will help you get up to speed quickly.

## ⚡ Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_GOOGLE_API_KEY to .env.local

# 3. Start dev server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 📚 Essential Files to Review

### For New Contributors
1. **`README.md`** - Comprehensive project documentation
2. **`store/resumeStore.ts`** - Resume state management (well-commented)
3. **`store/store.ts`** - Auth & navigation state (well-commented)
4. **`lib/actions/general.actions.ts`** - AI integration examples (well-commented)
5. **`app/(root)/resumemanager/templates1/page.tsx`** - Template structure example

### Useful Paths
```
lib/
  ├── actions/         ← Server-side AI functions
  ├── constants/       ← Shared helpers & constants
  ├── schemes/         ← Zod validation schemas
  └── client/          ← Client-only utilities (browser code)

store/                 ← Zustand state stores (Zustand pattern explained in comments)

components/           ← Reusable React components
  ├── generalComponents/   ← Buttons, modals, etc.
  ├── homepageComponents/  ← Landing page sections
  └── ui/                  ← shadcn/ui components

app/(root)/            ← Main app routes
  ├── resumemanager/       ← Resume CRUD & templates
  └── coverlettergenerator/← Cover letter CRUD & templates
```

---

## 💡 Key Architecture Decisions

### 1. **State Management (Zustand)**
- Two resume stores: `useResumeStore` (original) and `useOptimizedStore` (AI-optimized)
- Why? Allows users to compare original vs. optimized versions
- Always use `getState()` for server-side access

```typescript
// Client-side (component)
const { parsedResume } = useResumeStore()

// Server-side
const resume = useResumeStore.getState().parsedResume
```

### 2. **Data Persistence**
- Primary: Cloud backend (via API endpoints)
- Secondary: localStorage (for draft/temporary data)
- Session: sessionStorage (for auth tokens)

### 3. **Server vs. Client Code**
- `'use server'` functions in `lib/actions/` run server-side (AI calls, file processing)
- `'use client'` components run client-side (UI, event handlers)
- Dynamic imports for browser-only libs (e.g., `html-to-docx`)

### 4. **Content Editing Pattern**
Template pages use `contentEditable` divs with blur handlers:

```typescript
const handleFieldBlur = (path: string[]) => (e: FocusEvent) => {
  const text = (e.currentTarget as HTMLElement).innerText ?? ''
  // Update nested state using path (e.g., ['experience', 0, 'company'])
  updateAndPersist(path, text)
}
```

---

## 🔧 Common Tasks

### Add a New Resume Section
1. **Update schema** in `lib/schemes/resumeSchema.ts`
2. **Add fields** to template in `app/(root)/resumemanager/templates1/page.tsx`
3. **Add blur handler** for each field
4. **Test** with `npm run dev`

### Add a New Feature
1. Create folder under relevant section (e.g., `components/newFeature/`)
2. Add JSDoc comments explaining purpose
3. Import into parent component
4. Add type hints (avoid `any`)
5. Test thoroughly before submitting PR

### Debug AI Issues
- Check browser console (client errors)
- Check terminal (server action errors)
- Verify `NEXT_PUBLIC_GOOGLE_API_KEY` is set
- Test API key in [Google AI Studio](https://aistudio.google.com/)
- Check timeout settings in `lib/actions/resumeAction.ts`

### Test Export Functionality
```typescript
// In component event handler:
const mod = await import('@/lib/client/docxExport')
const exportFn = mod.default
await exportFn(elementRef, 'filename')
```

---

## 📋 Code Quality Guidelines

### Comments You'll See

**JSDoc block comments** (at function level):
```typescript
/**
 * Brief description
 * @param {Type} name - Description
 * @returns {Type} Description
 * @example
 * functionName(arg) // returns...
 */
function functionName(arg) { ... }
```

**Inline comments** (for complex logic):
```typescript
// Why: Explains non-obvious reasoning
const result = complexOperation()
```

**Section comments** (group related code):
```typescript
// --- Data Loading ---
const [data, setData] = useState()
// --- Event Handlers ---
const handleClick = () => { ... }
```

### Do's & Don'ts

✅ **DO:**
- Use TypeScript types (avoid `any`)
- Add comments to complex logic
- Test before committing
- Follow existing patterns
- Use semantic HTML elements

❌ **DON'T:**
- Commit unused imports (noted in file comments for future cleanup)
- Use `console.log()` in production code (use logging service)
- Call AI functions from client without `'use server'`
- Import browser libs in server files
- Modify types without updating all usages

---

## 🚨 Common Gotchas

### 1. "Module not found" Errors
- **Cause**: Importing browser-only libs in server code
- **Fix**: Use dynamic imports or `'use client'` directive

### 2. "localStorage is not defined"
- **Cause**: Accessing localStorage on server
- **Fix**: Add `if (typeof window !== 'undefined')` guard

### 3. Stale UI After State Update
- **Cause**: Not re-rendering after state change
- **Fix**: Ensure state setter is called (not just store)

### 4. AI Response Takes Too Long
- **Cause**: Large files or network latency
- **Fix**: Add timeout handling (see `resumeAction.ts`)

---

## 📞 Need Help?

1. **Check existing comments** in the file (see JSDoc blocks)
2. **Search codebase** for similar patterns
3. **Check README.md** for architecture overview
4. **Review commented examples** in this guide
5. **Ask team lead** if still stuck

---

## 📝 Before Submitting a PR

Checklist:
- [ ] Code passes `npm run lint`
- [ ] No console errors in browser
- [ ] No console errors in terminal
- [ ] Added JSDoc comments for new functions
- [ ] Updated README.md if needed
- [ ] Tested the feature manually
- [ ] No unused imports (or documented them)
- [ ] No `any` types without justification

---

## 🎯 Next Steps

1. ✅ Run `npm run dev` and explore the app
2. ✅ Read through the files marked as "well-commented" above
3. ✅ Try editing a resume in a template (test persistence)
4. ✅ Try the export feature (DOCX/PDF)
5. ✅ Check `lib/actions/general.actions.ts` to understand AI integration
6. ✅ Pick a small task and start coding!

---

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy coding! 🚀 Welcome to the team!**
