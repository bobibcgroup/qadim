'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X, Calendar, MapPin, Clock, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (topic: string, startYear?: number, endYear?: number) => void
}

interface TimelineEvent {
  id: string
  title: string
  year: number
  description: string
  sources: any[]
  category: 'political' | 'cultural' | 'economic' | 'social' | 'military'
  location?: string
}

export function TimelineModal({ isOpen, onClose, onSearch }: TimelineModalProps) {
  const [topic, setTopic] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  const handleSearch = async () => {
    if (!topic.trim()) return

    setLoading(true)
    try {
      // Mock timeline data - in production this would call the API
      setTimeout(() => {
        setEvents([
          {
            id: '1',
            title: 'Phoenician Alphabet Development',
            year: -1200,
            description: 'The Phoenicians developed one of the first alphabetic writing systems, which became the foundation for Greek, Latin, and Arabic scripts.',
            category: 'cultural',
            location: 'Tyre, Sidon',
            sources: [
              { title: 'Phoenician Inscriptions', authority: 'OFFICIAL', credibility: 95 },
              { title: 'Archaeological Evidence', authority: 'SCHOLARLY', credibility: 90 }
            ]
          },
          {
            id: '2',
            title: 'Roman Conquest of Phoenicia',
            year: -64,
            description: 'Pompey the Great incorporated Phoenician cities into the Roman Empire, ending their political independence.',
            category: 'political',
            location: 'Phoenicia',
            sources: [
              { title: 'Roman Historical Records', authority: 'OFFICIAL', credibility: 88 },
              { title: 'Archaeological Findings', authority: 'SCHOLARLY', credibility: 85 }
            ]
          },
          {
            id: '3',
            title: 'Crusader Period',
            year: 1099,
            description: 'Lebanese territories came under Crusader control, establishing the County of Tripoli and other Crusader states.',
            category: 'military',
            location: 'Tripoli, Beirut',
            sources: [
              { title: 'Crusader Chronicles', authority: 'SCHOLARLY', credibility: 82 },
              { title: 'Muslim Historical Accounts', authority: 'SCHOLARLY', credibility: 80 }
            ]
          }
        ])
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Timeline search error:', error)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTopic('')
    setStartYear('')
    setEndYear('')
    setEvents([])
    setSelectedEvent(null)
    onClose()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'political': return 'bg-blue-500'
      case 'cultural': return 'bg-purple-500'
      case 'economic': return 'bg-green-500'
      case 'social': return 'bg-orange-500'
      case 'military': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'political': return '🏛️'
      case 'cultural': return '🎭'
      case 'economic': return '💰'
      case 'social': return '👥'
      case 'military': return '⚔️'
      default: return '📅'
    }
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
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-card rounded-qadim border border-accentSoft shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accentSoft">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-display font-bold text-ink">Historical Timeline</h2>
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
        <div className="flex h-[calc(90vh-120px)]">
          {/* Search Panel */}
          <div className="w-1/3 border-r border-accentSoft p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">
                  Topic or Event
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Phoenician alphabet, Civil War..."
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-ink">
                    Start Year
                  </label>
                  <Input
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="e.g., -1000"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-ink">
                    End Year
                  </label>
                  <Input
                    type="number"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="e.g., 2000"
                    className="text-sm"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!topic.trim() || loading}
                loading={loading}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Timeline
              </Button>
            </div>

            {/* Events List */}
            {events.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-ink">Events</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-all duration-qadim',
                        selectedEvent?.id === event.id
                          ? 'border-accent bg-accent/10'
                          : 'border-accentSoft hover:border-accent hover:bg-accent/5'
                      )}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">{getCategoryIcon(event.category)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-ink">
                              {event.year > 0 ? `${event.year} AD` : `${Math.abs(event.year)} BC`}
                            </span>
                            <span className={cn(
                              'w-2 h-2 rounded-full',
                              getCategoryColor(event.category)
                            )} />
                          </div>
                          <p className="text-xs text-ink/80 mt-1 line-clamp-2">
                            {event.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline View */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!events.length && !loading ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-4">
                  <Calendar className="w-16 h-16 text-muted mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Explore Lebanese History</h3>
                    <p className="text-muted">
                      Search for historical events, periods, or topics to see them on the timeline
                    </p>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto" />
                  <p className="text-ink">Loading timeline...</p>
                </div>
              </div>
            ) : selectedEvent ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(selectedEvent.category)}</span>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-ink">
                        {selectedEvent.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-muted">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{selectedEvent.year > 0 ? `${selectedEvent.year} AD` : `${Math.abs(selectedEvent.year)} BC`}</span>
                        </span>
                        {selectedEvent.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedEvent.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-ink leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-ink">Sources</h3>
                    <div className="space-y-2">
                      {selectedEvent.sources.map((source, index) => (
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
                                  className="h-full bg-accent transition-all duration-500"
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
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ink">Timeline Overview</h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-4 p-4 bg-bg rounded-lg border border-accentSoft cursor-pointer hover:border-accent transition-colors duration-qadim"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-ink">
                            {event.year > 0 ? `${event.year} AD` : `${Math.abs(event.year)} BC`}
                          </span>
                          <span className={cn(
                            'w-2 h-2 rounded-full',
                            getCategoryColor(event.category)
                          )} />
                        </div>
                        <h4 className="font-semibold text-ink">{event.title}</h4>
                        <p className="text-sm text-ink/80 mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
