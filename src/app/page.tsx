'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/Header'
import { AskBox } from '@/components/AskBox'
import { AnswerCard } from '@/components/AnswerCard'
import { AdSlot } from '@/components/ads/AdSlot'
import { Persona, Language } from '@prisma/client'

interface Answer {
  id: string
  summary: string
  citations: any[]
  confidence: number
  controversy: number
  persona: Persona
  created_at: string
}

export default function Home() {
  const { data: session } = useSession()
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAsk = async (question: string, persona: Persona, lang: Language) => {
    if (!session) {
      // Redirect to sign in or show message
      return
    }

    setLoading(true)
    try {
      // This would call the tRPC mutation
      // For now, show a mock answer
      setTimeout(() => {
        setCurrentAnswer({
          id: '1',
          summary: `Based on the available sources, here's what I found about "${question}":

The question you've asked touches on several important aspects of Lebanese history and culture. While I don't have specific sources loaded yet, I can provide some general context.

**Key Points:**
- This topic has been documented in various official and scholarly sources
- There are multiple perspectives that should be considered
- The historical context is important for understanding the full picture

*Note: This is a demo response. In production, this would be generated using our RAG pipeline with real historical documents.*`,
          citations: [
            {
              source_id: '1',
              snippet: 'Sample official document excerpt...',
              authority_level: 'OFFICIAL',
              status: 'VERIFIED',
              score: 0.95
            },
            {
              source_id: '2', 
              snippet: 'Academic research findings...',
              authority_level: 'SCHOLARLY',
              status: 'VERIFIED',
              score: 0.88
            }
          ],
          confidence: 85,
          controversy: 25,
          persona,
          created_at: new Date().toISOString()
        })
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Error asking question:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accentSoft/5" />
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-5xl md:text-7xl font-bold text-ink">
                Qadim
              </h1>
              <p className="text-xl md:text-2xl text-muted font-light max-w-2xl mx-auto">
                The Memory of Lebanon
              </p>
              <p className="text-lg text-ink/80 max-w-3xl mx-auto leading-relaxed">
                Verify any Lebanese or Phoenician historical, political, or cultural claim 
                across thousands of years with AI-powered research and verified sources.
              </p>
            </div>
          </div>

          {/* Top Banner Ad */}
          <AdSlot slot="top-banner" className="mb-8" />

          {/* Ask Box */}
          <div className="flex justify-center">
            <AskBox 
              onAsk={handleAsk}
              loading={loading}
              disabled={!session}
            />
          </div>

          {/* Sign In Prompt */}
          {!session && (
            <div className="text-center">
              <p className="text-muted">
                Sign in with Google to ask questions and access our knowledge base
              </p>
            </div>
          )}

          {/* Answer Display */}
          {currentAnswer && (
            <div className="space-y-6">
              <div className="animate-slide-up">
                <AnswerCard
                  summary={currentAnswer.summary}
                  citations={currentAnswer.citations}
                  confidence={currentAnswer.confidence}
                  controversy={currentAnswer.controversy}
                  persona={currentAnswer.persona}
                  createdAt={new Date(currentAnswer.created_at)}
                  onAddNote={() => {
                    // Handle adding community note
                    console.log('Add note clicked')
                  }}
                />
              </div>
              
              {/* After Answer Ad */}
              <AdSlot slot="after-answer" />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center">
              <div className="bg-card rounded-qadim border border-accentSoft p-8 max-w-2xl w-full">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent" />
                  <span className="text-ink">Qadim is thinking...</span>
                </div>
                <p className="text-center text-muted mt-4">
                  Searching through thousands of historical documents and sources
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <p className="text-sm text-muted">
          Built with ❤️ for preserving Lebanese heritage and history
        </p>
      </footer>
    </div>
  )
}