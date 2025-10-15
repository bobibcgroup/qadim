'use client'

import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from './ui/Button'
import { User, LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-qadim bg-accent flex items-center justify-center group-hover:qadim-glow transition-all duration-qadim">
            <span className="text-bg font-display font-bold text-xl">ق</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-ink text-xl">Qadim</h1>
            <p className="text-xs text-muted">The Memory of Lebanon</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/debate"
            className="text-ink hover:text-accent transition-colors duration-qadim"
          >
            Debate
          </Link>
          <Link
            href="/timeline"
            className="text-ink hover:text-accent transition-colors duration-qadim"
          >
            Timeline
          </Link>
          {session && (
            <Link
              href="/notes"
              className="text-ink hover:text-accent transition-colors duration-qadim"
            >
              Notes
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center space-x-3">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-card animate-pulse" />
          ) : session ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <User className="w-4 h-4 text-bg" />
                  </div>
                )}
                <span className="hidden sm:block text-sm text-ink font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signIn('google')}
              className="flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
