#!/usr/bin/env node

import { createWorkers } from './lib/queue'

// Start the workers
const { ragWorker, documentWorker, emailWorker } = createWorkers()

console.log('🚀 Starting Qadim workers...')

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n📡 Received ${signal}, shutting down gracefully...`)
  
  try {
    await Promise.all([
      ragWorker.close(),
      documentWorker.close(),
      emailWorker.close(),
    ])
    
    console.log('✅ All workers closed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

console.log('✅ Workers started successfully')
console.log('📊 Listening for jobs on queues:')
console.log('  - RAG Processing')
console.log('  - Document Ingestion') 
console.log('  - Email Notifications')
