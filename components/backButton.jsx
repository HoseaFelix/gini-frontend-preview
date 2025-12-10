'use client'

import React from 'react'

export default function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="print:hidden absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-md px-3 py-2 rounded-md shadow border hover:bg-gray-100 text-sm flex items-center gap-2"
      aria-label="Go back"
    >
      <span className="text-lg">←</span>
      <span>Back</span>
    </button>
  )
}
