'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface CommunityNote {
  id: string
  note: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
  answer: {
    id: string
    summary: string
    question: {
      id: string
      text: string
    }
  }
}

export default function NotesPage() {
  const { data: session } = useSession()
  const [notes, setNotes] = useState<CommunityNote[]>([])
  const [loading, setLoading] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)

  // Mock data for demo
  const mockNotes: CommunityNote[] = [
    {
      id: '1',
      note: 'This answer could benefit from mentioning the specific Phoenician cities where the alphabet was developed, such as Byblos, Tyre, and Sidon.',
      status: 'APPROVED',
      created_at: new Date().toISOString(),
      answer: {
        id: '1',
        summary: 'The Phoenician alphabet was one of the first alphabetic writing systems...',
        question: {
          id: '1',
          text: 'What was the Phoenician alphabet and how did it influence other writing systems?'
        }
      }
    },
    {
      id: '2',
      note: 'The information about the Lebanese Civil War start date needs verification. Some sources suggest it began in February 1975, not April.',
      status: 'PENDING',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      answer: {
        id: '2',
        summary: 'The Lebanese Civil War began on April 13, 1975...',
        question: {
          id: '2',
          text: 'When did the Lebanese Civil War start?'
        }
      }
    }
  ]

  const handleSubmitNote = async () => {
    if (!newNote.trim() || !selectedAnswerId) return

    setLoading(true)
    try {
      // Mock submission - in production this would call the API
      setTimeout(() => {
        const note: CommunityNote = {
          id: Date.now().toString(),
          note: newNote,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          answer: {
            id: selectedAnswerId,
            summary: 'Mock answer summary...',
            question: {
              id: '1',
              text: 'Mock question...'
            }
          }
        }
        setNotes(prev => [note, ...prev])
        setNewNote('')
        setSelectedAnswerId(null)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error submitting note:', error)
      setLoading(false)
    }
  }

  const handleModerateNote = async (noteId: string, status: 'APPROVED' | 'REJECTED') => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, status } : note
    ))
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-display font-bold text-ink">Community Notes</h1>
            <p className="text-lg text-muted">Please sign in to view and submit community notes</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold text-ink">Community Notes</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Help improve Qadim's accuracy by submitting corrections, additional sources, or clarifications
            </p>
          </div>

          {/* Submit New Note */}
          <div className="bg-card rounded-qadim border border-accentSoft p-6">
            <h2 className="text-xl font-semibold text-ink mb-4">Submit a Note</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Answer ID (for testing)
                </label>
                <Input
                  value={selectedAnswerId || ''}
                  onChange={(e) => setSelectedAnswerId(e.target.value)}
                  placeholder="Enter answer ID..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Your Note
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Provide additional context, corrections, or sources..."
                  className="w-full h-32 p-3 bg-bg border border-accentSoft rounded-qadim text-ink placeholder:text-muted focus:border-accent focus:outline-none resize-none"
                />
              </div>
              <Button
                onClick={handleSubmitNote}
                disabled={!newNote.trim() || !selectedAnswerId || loading}
                loading={loading}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Submit Note</span>
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-ink">Recent Notes</h2>
            
            {mockNotes.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-muted mx-auto mb-4" />
                <p className="text-muted">No community notes yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockNotes.map((note) => (
                  <div key={note.id} className="bg-card rounded-qadim border border-accentSoft p-6">
                    <div className="space-y-4">
                      {/* Note Content */}
                      <div>
                        <p className="text-ink leading-relaxed">{note.note}</p>
                      </div>

                      {/* Related Answer */}
                      <div className="p-4 bg-bg rounded-lg border border-accentSoft">
                        <h4 className="font-medium text-ink mb-2">Related Answer:</h4>
                        <p className="text-sm text-ink/80 mb-2 line-clamp-2">
                          {note.answer.question.text}
                        </p>
                        <p className="text-sm text-ink/60 line-clamp-3">
                          {note.answer.summary}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-accentSoft">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {note.status === 'APPROVED' && (
                              <>
                                <CheckCircle className="w-4 h-4 text-official" />
                                <span className="text-sm text-official font-medium">Approved</span>
                              </>
                            )}
                            {note.status === 'REJECTED' && (
                              <>
                                <XCircle className="w-4 h-4 text-claim" />
                                <span className="text-sm text-claim font-medium">Rejected</span>
                              </>
                            )}
                            {note.status === 'PENDING' && (
                              <>
                                <Clock className="w-4 h-4 text-muted" />
                                <span className="text-sm text-muted font-medium">Pending Review</span>
                              </>
                            )}
                          </div>
                          <span className="text-sm text-muted">
                            {formatRelativeTime(new Date(note.created_at))}
                          </span>
                        </div>

                        {/* Moderation Actions (for moderators) */}
                        {session.user?.role === 'MODERATOR' && note.status === 'PENDING' && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleModerateNote(note.id, 'APPROVED')}
                              className="flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleModerateNote(note.id, 'REJECTED')}
                              className="flex items-center space-x-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
