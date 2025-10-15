'use client'

import React from 'react'
import { Language } from '@prisma/client'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  value: Language
  onChange: (lang: Language) => void
  disabled?: boolean
}

export function LanguageToggle({ value, onChange, disabled = false }: LanguageToggleProps) {
  const languages = [
    { code: Language.EN, label: 'EN', dir: 'ltr' },
    { code: Language.AR, label: 'عربي', dir: 'rtl' },
    { code: Language.FR, label: 'FR', dir: 'ltr' },
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-ink">Language:</span>
      <div className="flex rounded-qadim bg-card border border-accentSoft overflow-hidden">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            disabled={disabled}
            className={cn(
              'px-3 py-1.5 text-sm font-medium transition-all duration-qadim',
              value === lang.code
                ? 'bg-accent text-bg'
                : 'text-ink hover:bg-accentSoft hover:text-bg',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            dir={lang.dir}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
