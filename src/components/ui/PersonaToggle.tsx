'use client'

import React from 'react'
import { Persona } from '@prisma/client'
import { cn } from '@/lib/utils'

interface PersonaToggleProps {
  value: Persona
  onChange: (persona: Persona) => void
  disabled?: boolean
}

export function PersonaToggle({ value, onChange, disabled = false }: PersonaToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-ink">Mode:</span>
      <div className="flex rounded-qadim bg-card border border-accentSoft overflow-hidden">
        <button
          onClick={() => onChange(Persona.NEUTRAL)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 text-sm font-medium transition-all duration-qadim',
            value === Persona.NEUTRAL
              ? 'bg-accent text-bg'
              : 'text-ink hover:bg-accentSoft hover:text-bg',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          Neutral
        </button>
        <button
          onClick={() => onChange(Persona.ZAATAR)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 text-sm font-medium transition-all duration-qadim',
            value === Persona.ZAATAR
              ? 'bg-accent text-bg'
              : 'text-ink hover:bg-accentSoft hover:text-bg',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          Zaatar
        </button>
      </div>
    </div>
  )
}
