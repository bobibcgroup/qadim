'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X, Scale, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DebateModalProps {
  isOpen: boolean
  onClose: () => void
  onDebate?: (claim1: string, claim2: string) => void
}

interface DebateResult {
  verdict: string
  evidence1: {
    score: number
    sources: any[]
  }
  evidence2: {
    score: number
    sources: any[]
  }
  nuance: string
}

export function DebateModal({ isOpen, onClose, onDebate }: DebateModalProps) {
  const [claim1, setClaim1] = useState('')
  const [claim2, setClaim2] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DebateResult | null>(null)

  const handleDebate = async () => {
    if (!claim1.trim() || !claim2.trim()) return

    setLoading(true)
    try {
      // Mock debate result - in production this would call the API
      setTimeout(() => {
        setResult({
          verdict: "Both claims have merit based on available evidence",
          evidence1: {
            score: 0.7,
            sources: [
              { title: "Official Government Document", authority: "OFFICIAL", credibility: 95 },
              { title: "Academic Research Paper", authority: "SCHOLARLY", credibility: 88 }
            ]
          },
          evidence2: {
            score: 0.6,
            sources: [
              { title: "Press Report", authority: "PRESS", credibility: 75 },
              { title: "Community Source", authority: "COMMUNITY", credibility: 65 }
            ]
          },
          nuance: "The evidence suggests multiple perspectives on this topic. Historical context and source reliability play important roles in evaluating these claims."
        })
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Debate error:', error)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setClaim1('')
    setClaim2('')
    setResult(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-qadim border border-accentSoft shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accentSoft">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-display font-bold text-ink">Debate Mode</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!result ? (
            <>
              {/* Input Claims */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-ink">
                    First Claim
                  </label>
                  <Input
                    value={claim1}
                    onChange={(e) => setClaim1(e.target.value)}
                    placeholder="Enter the first historical claim to evaluate..."
                    className="text-base"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div className="px-4 py-2 bg-accentSoft rounded-full text-bg font-medium">
                    vs
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-ink">
                    Second Claim
                  </label>
                  <Input
                    value={claim2}
                    onChange={(e) => setClaim2(e.target.value)}
                    placeholder="Enter the second historical claim to evaluate..."
                    className="text-base"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-center">
                <Button
                  onClick={handleDebate}
                  disabled={!claim1.trim() || !claim2.trim() || loading}
                  loading={loading}
                  size="lg"
                  className="px-8"
                >
                  {loading ? 'Analyzing Claims...' : 'Start Debate'}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-6">
                {/* Verdict */}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Verdict</h3>
                  <p className="text-lg text-ink/80 leading-relaxed">
                    {result.verdict}
                  </p>
                </div>

                {/* Evidence Comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Claim 1 Evidence */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-official" />
                      <h4 className="font-semibold text-ink">Claim 1 Evidence</h4>
                      <span className="px-2 py-1 bg-official text-white text-xs rounded-full">
                        {Math.round(result.evidence1.score * 100)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      {result.evidence1.sources.map((source, index) => (
                        <div key={index} className="p-3 bg-bg rounded-lg border border-accentSoft">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-ink font-medium">
                              {source.title}
                            </span>
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              source.authority === 'OFFICIAL' ? 'bg-official text-white' :
                              source.authority === 'SCHOLARLY' ? 'bg-muted text-white' :
                              'bg-accentSoft text-white'
                            )}>
                              {source.authority}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-card rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-official transition-all duration-500"
                                  style={{ width: `${source.credibility}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted">{source.credibility}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Claim 2 Evidence */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-claim" />
                      <h4 className="font-semibold text-ink">Claim 2 Evidence</h4>
                      <span className="px-2 py-1 bg-claim text-white text-xs rounded-full">
                        {Math.round(result.evidence2.score * 100)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      {result.evidence2.sources.map((source, index) => (
                        <div key={index} className="p-3 bg-bg rounded-lg border border-accentSoft">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-ink font-medium">
                              {source.title}
                            </span>
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              source.authority === 'OFFICIAL' ? 'bg-official text-white' :
                              source.authority === 'SCHOLARLY' ? 'bg-muted text-white' :
                              'bg-accentSoft text-white'
                            )}>
                              {source.authority}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-card rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-claim transition-all duration-500"
                                  style={{ width: `${source.credibility}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted">{source.credibility}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nuance */}
                <div className="p-4 bg-bg rounded-lg border border-accentSoft">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-ink mb-2">Important Context</h4>
                      <p className="text-sm text-ink/80 leading-relaxed">
                        {result.nuance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      setResult(null)
                      setClaim1('')
                      setClaim2('')
                    }}
                    variant="secondary"
                  >
                    New Debate
                  </Button>
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
