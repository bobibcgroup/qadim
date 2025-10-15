'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { TimelineModal } from '@/components/modals/TimelineModal'

export default function TimelinePage() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      {/* Main content when modal is closed */}
      {!isModalOpen && (
        <main className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-display font-bold text-ink">Historical Timeline</h1>
            <p className="text-lg text-muted max-w-2xl">
              Explore Lebanese and Phoenician history through an interactive timeline
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-accent text-bg rounded-qadim hover:bg-accentSoft transition-colors duration-qadim"
            >
              Open Timeline
            </button>
          </div>
        </main>
      )}

      <TimelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
