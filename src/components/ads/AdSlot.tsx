'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FEATURES } from '@/lib/features'

interface AdSlotProps {
  slot: 'top-banner' | 'sidebar' | 'after-answer'
  className?: string
}

export function AdSlot({ slot, className }: AdSlotProps) {
  // Only show ads if feature flag is enabled
  if (!FEATURES.ADS) {
    return null
  }

  const slotConfig = {
    'top-banner': {
      width: 728,
      height: 90,
      placeholder: 'Top Banner Ad (728x90)',
    },
    'sidebar': {
      width: 300,
      height: 250,
      placeholder: 'Sidebar Ad (300x250)',
    },
    'after-answer': {
      width: 728,
      height: 90,
      placeholder: 'Answer Footer Ad (728x90)',
    },
  }

  const config = slotConfig[slot]

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className="bg-card border border-accentSoft rounded-qadim flex items-center justify-center text-muted text-sm"
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          maxWidth: '100%',
        }}
      >
        {/* In production, this would be replaced with actual ad code */}
        <div className="text-center p-4">
          <div className="text-xs text-muted/60 mb-2">Advertisement</div>
          <div className="text-muted">{config.placeholder}</div>
          <div className="text-xs text-muted/60 mt-2">
            Google AdSense / Ad Manager
          </div>
        </div>
      </div>
    </div>
  )
}
