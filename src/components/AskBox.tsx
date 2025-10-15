'use client'

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { PersonaToggle } from './ui/PersonaToggle'
import { LanguageToggle } from './ui/LanguageToggle'
import { Persona, Language } from '@prisma/client'
import { Send, Loader2 } from 'lucide-react'

interface AskBoxProps {
  onAsk: (question: string, persona: Persona, lang: Language) => void
  loading?: boolean
  disabled?: boolean
}

export function AskBox({ onAsk, loading = false, disabled = false }: AskBoxProps) {
  const [question, setQuestion] = useState('')
  const [persona, setPersona] = useState<Persona>(Persona.NEUTRAL)
  const [lang, setLang] = useState<Language>(Language.EN)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && !loading && !disabled) {
      onAsk(question.trim(), persona, lang)
      setQuestion('')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ask Input */}
        <div className="relative">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Qadim anything about Lebanese history, politics, or culture..."
            disabled={disabled || loading}
            className="text-lg py-4 pr-16"
            dir={lang === Language.AR ? 'rtl' : 'ltr'}
          />
          <Button
            type="submit"
            disabled={!question.trim() || disabled || loading}
            loading={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            size="sm"
          >
            {!loading && <Send className="h-4 w-4" />}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <PersonaToggle
            value={persona}
            onChange={setPersona}
            disabled={disabled || loading}
          />
          <LanguageToggle
            value={lang}
            onChange={setLang}
            disabled={disabled || loading}
          />
        </div>
      </form>

      {/* Example questions */}
      {!loading && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted mb-3">Try asking:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "What was the Phoenician alphabet's impact?",
              "How did the Lebanese Civil War begin?",
              "What are the origins of Lebanese cuisine?",
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setQuestion(example)}
                disabled={disabled || loading}
                className="text-xs px-3 py-1 rounded-full bg-card border border-accentSoft text-ink hover:bg-accentSoft hover:text-bg transition-all duration-qadim disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
