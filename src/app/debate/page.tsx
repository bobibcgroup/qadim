'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { DebateModal } from '@/components/modals/DebateModal'

export default function DebatePage() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      {/* Main content when modal is closed */}
      {!isModalOpen && (
        <main className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-display font-bold text-ink">Debate Mode</h1>
            <p className="text-lg text-muted max-w-2xl">
              Compare two historical claims and see how they stack up against the evidence
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-accent text-bg rounded-qadim hover:bg-accentSoft transition-colors duration-qadim"
            >
              Start New Debate
            </button>
          </div>
        </main>
      )}

      <DebateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
