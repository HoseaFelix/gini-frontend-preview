'use client'

import { useOptimizedStore } from '@/store/resumeStore'
import React, { useEffect, useRef, useState } from 'react'
import { ResumeType } from '@/lib/schemes/resumeSchema'
import { useCurrentNav } from '@/store/store'

const Template1Page = () => {
  const [resume, setResume] = useState<ResumeType | null>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const localResume = localStorage.getItem('resume')
    setResume(
      localResume
        ? JSON.parse(localResume)
        : useOptimizedStore.getState().parsedResume
    )
    useCurrentNav.getState().setCurrentNav('Resume Manager')
  }, [])

  if (!resume) {
    return (
      <section className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-500">No resume data found.</p>
      </section>
    )
  }

  // Export to PDF (safe for Next.js)
 // inside your handleExport
 const handleExport = async () => {
    try {
      console.log('Starting PDF export...');
      
      // Dynamically import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default;
  
      // Check if resumeRef exists
      if (!resumeRef.current) {
        console.error('Error: resumeRef is not attached to any DOM element.');
        return;
      }
  
      // Configuration for html2pdf
      const opt = {
        margin: 0.5,
        filename: `${resume.name || 'resume'}.pdf`, // Dynamic filename
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // Enable CORS for external resources
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
  
      // Export to PDF
      html2pdf().set(opt).from(resumeRef.current).save();
      console.log('PDF export completed.');
    } catch (error) {
      console.error('Error during PDF export:', error);
    }
  };
  
  

  return (
    <section className="w-full pb-10 min-h-screen bg-gray-100 px-2 sm:px-4 pt-14 flex justify-center relative">
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base"
        >
          Export as PDF
        </button>
        <button
          onClick={() => console.log('Save clicked')}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md shadow text-sm sm:text-base"
        >
          Save
        </button>
      </div>

      {/* Resume Wrapper */}
      <div
        ref={resumeRef}
        className="bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-text/70 w-full sm:max-w-[900px] print:max-w-[900px]"
        style={{
          aspectRatio: '1 / 1.414', // Keeps A4 ratio for export
        }}
      >
        {/* Top section */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 justify-between border-b pb-4">
          <div>
            <p className="font-bold text-3xl sm:text-6xl">{resume.name}</p>
            <p className="text-text/80 text-base sm:text-lg">{resume.headline}</p>
          </div>
          <div className="flex flex-col text-text/70 gap-1 text-sm sm:text-base">
            {resume.contactInfo.phone !== 'undefined' && <p>{resume.contactInfo.phone}</p>}
            {resume.contactInfo.email !== 'undefined' && <p>{resume.contactInfo.email}</p>}
            {resume.contactInfo.address !== 'undefined' && <p>{resume.contactInfo.address}</p>}
            {resume.contactInfo.linkedIn !== 'undefined' && <p>{resume.contactInfo.linkedIn}</p>}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-5 mt-6">
          {/* Left column */}
          <div 
          id='pdf-content'
          className="md:min-w-[30%] md:border-r border-black flex flex-col gap-5 pr-0 md:pr-4">
            {/* Education */}
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xl">EDUCATION</p>
              {resume.education?.map((edu, index) => (
                <div key={index} className="flex flex-col gap-1 text-sm sm:text-base">
                  <p>{`${edu.startYear} - ${edu.endYear}`}</p>
                  <p>{edu.institution}</p>
                  <p>{edu.degree}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xl">SKILLS</p>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                {resume.skills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Awards */}
            {resume.awards && resume.awards.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-bold text-xl">AWARDS</p>
                <ul className="list-disc pl-5 text-sm sm:text-base">
                  {resume.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5 flex-1">
            {/* Career Objective */}
            <div className="flex flex-col gap-3">
              <p className="font-bold text-xl">CAREER OBJECTIVE</p>
              <p className="text-sm sm:text-base">{resume.careerObjective}</p>
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-3">
              <p className="font-bold text-xl">EXPERIENCE</p>
              {resume.experience?.map((exp, index) => (
                <div key={index} className="space-y-2 text-sm sm:text-base">
                  <p className="font-bold">
                    {exp.heading} | {exp.duration}
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    {exp.achievements
                      .split('.')
                      .filter((line) => line.trim() !== '')
                      .map((ach, j) => (
                        <li key={`${index}-${j}`}>{ach.trim()}.</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-bold text-xl">PROJECTS</p>
                {resume.projects.map((proj, index) => (
                  <div key={index} className="space-y-2 text-sm sm:text-base">
                    <p className="font-medium">
                      {proj.name} | {proj.duration}
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      {proj.achievements
                        .split('.')
                        .filter((line) => line.trim() !== '')
                        .map((ach, j) => (
                          <li key={`${index}-${j}`}>{ach.trim()}.</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Template1Page
