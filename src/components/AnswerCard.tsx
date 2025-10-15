'use client'

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Persona, AuthorityLevel, SourceStatus } from '@prisma/client'
import { 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn, getAuthorityColor, getAuthorityIcon, formatRelativeTime } from '@/lib/utils'

interface Citation {
  source_id: string
  snippet: string
  authority_level: AuthorityLevel
  status: SourceStatus
  score: number
}

interface AnswerCardProps {
  summary: string
  citations: Citation[]
  confidence: number
  controversy: number
  persona: Persona
  createdAt: Date
  onTogglePersona?: (persona: Persona) => void
  onAddNote?: () => void
  className?: string
}

export function AnswerCard({
  summary,
  citations,
  confidence,
  controversy,
  persona,
  createdAt,
  onTogglePersona,
  onAddNote,
  className
}: AnswerCardProps) {
  const [showCitations, setShowCitations] = useState(false)
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null)

  // Group citations by authority level
  const groupedCitations = citations.reduce((acc, citation) => {
    const level = citation.authority_level
    if (!acc[level]) acc[level] = []
    acc[level].push(citation)
    return acc
  }, {} as Record<AuthorityLevel, Citation[]>)

  const authorityOrder: AuthorityLevel[] = ['OFFICIAL', 'SCHOLARLY', 'PRESS', 'COMMUNITY', 'CLAIM']

  return (
    <div className={cn('bg-card rounded-qadim border border-accentSoft p-6 space-y-6', className)}>
      {/* Answer Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-ink leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        </div>
      </div>

      {/* Confidence & Controversy Indicators */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-official" />
          <span className="text-sm text-muted">Confidence:</span>
          <div className="flex items-center space-x-1">
            <div className="w-20 h-2 bg-card rounded-full overflow-hidden">
              <div 
                className="h-full bg-official transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-sm font-medium text-ink">{confidence}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-claim" />
          <span className="text-sm text-muted">Controversy:</span>
          <div className="flex items-center space-x-1">
            <div className="w-20 h-2 bg-card rounded-full overflow-hidden">
              <div 
                className="h-full bg-claim transition-all duration-500"
                style={{ width: `${controversy}%` }}
              />
            </div>
            <span className="text-sm font-medium text-ink">{controversy}%</span>
          </div>
        </div>
      </div>

      {/* Citations */}
      {citations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">Sources</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCitations(!showCitations)}
              className="flex items-center space-x-1"
            >
              <span>{showCitations ? 'Hide' : 'Show'} Citations</span>
              {showCitations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {showCitations && (
            <div className="space-y-4">
              {authorityOrder.map((authority) => {
                const authCitations = groupedCitations[authority]
                if (!authCitations || authCitations.length === 0) return null

                return (
                  <div key={authority} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getAuthorityIcon(authority)}</span>
                      <span className="font-medium text-ink capitalize">{authority}</span>
                      <span className="text-sm text-muted">({authCitations.length})</span>
                    </div>
                    
                    <div className="grid gap-3 ml-6">
                      {authCitations.map((citation, index) => (
                        <div
                          key={`${citation.source_id}-${index}`}
                          className="bg-bg rounded-lg p-3 border border-accentSoft"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-ink leading-relaxed">
                                {citation.snippet}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className={cn(
                                  'px-2 py-1 rounded-full text-xs font-medium',
                                  getAuthorityColor(citation.authority_level)
                                )}>
                                  {citation.authority_level}
                                </span>
                                <span className="text-xs text-muted">
                                  Score: {Math.round(citation.score * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-accentSoft">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(createdAt)}</span>
          </div>
          
          {onTogglePersona && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted">Mode:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                persona === 'NEUTRAL' ? 'bg-accent text-bg' : 'bg-accentSoft text-bg'
              )}>
                {persona === 'NEUTRAL' ? 'Neutral' : 'Zaatar'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onAddNote && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddNote}
              className="flex items-center space-x-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Add Note</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
