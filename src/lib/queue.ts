import { Queue, Worker } from 'bullmq'
import { redis } from './redis'
import { generateAnswer } from './rag'
import { prisma } from './prisma'

// Queue names
export const QUEUE_NAMES = {
  RAG_PROCESSING: 'rag-processing',
  DOCUMENT_INGESTION: 'document-ingestion',
  EMAIL_NOTIFICATIONS: 'email-notifications',
} as const

// RAG Processing Queue
export const ragQueue = new Queue(QUEUE_NAMES.RAG_PROCESSING, {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

// Document Ingestion Queue
export const documentQueue = new Queue(QUEUE_NAMES.DOCUMENT_INGESTION, {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 25,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
})

// Email Notifications Queue
export const emailQueue = new Queue(QUEUE_NAMES.EMAIL_NOTIFICATIONS, {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

// Job types
export interface RAGJobData {
  questionId: string
  question: string
  lang: 'AR' | 'EN' | 'FR'
  persona: 'NEUTRAL' | 'ZAATAR'
  userId: string
}

export interface DocumentIngestionJobData {
  sourceId: string
  documentUrl: string
  metadata: {
    title: string
    author?: string
    publishedAt?: string
    language: 'AR' | 'EN' | 'FR'
  }
}

export interface EmailNotificationJobData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

// Workers
export const createWorkers = () => {
  // RAG Processing Worker
  const ragWorker = new Worker(
    QUEUE_NAMES.RAG_PROCESSING,
    async (job) => {
      const { questionId, question, lang, persona, userId } = job.data as RAGJobData
      
      try {
        console.log(`Processing RAG job for question: ${questionId}`)
        
        const result = await generateAnswer({
          question,
          lang,
          persona,
          userId,
        })

        // Update the question with the answer
        await prisma.answer.create({
          data: {
            question_id: questionId,
            summary: result.summary,
            citations: result.citations,
            confidence: result.confidence,
            controversy: result.controversy,
            persona: persona as any,
          },
        })

        console.log(`RAG processing completed for question: ${questionId}`)
        return { success: true, questionId }
      } catch (error) {
        console.error(`RAG processing failed for question ${questionId}:`, error)
        throw error
      }
    },
    { connection: redis }
  )

  // Document Ingestion Worker
  const documentWorker = new Worker(
    QUEUE_NAMES.DOCUMENT_INGESTION,
    async (job) => {
      const { sourceId, documentUrl, metadata } = job.data as DocumentIngestionJobData
      
      try {
        console.log(`Processing document ingestion for source: ${sourceId}`)
        
        // Here you would implement document processing logic:
        // 1. Download document from URL
        // 2. Extract text content
        // 3. Split into chunks
        // 4. Generate embeddings
        // 5. Store in database
        
        // For now, just mark as processed
        await prisma.source.update({
          where: { id: sourceId },
          data: { status: 'VERIFIED' },
        })

        console.log(`Document ingestion completed for source: ${sourceId}`)
        return { success: true, sourceId }
      } catch (error) {
        console.error(`Document ingestion failed for source ${sourceId}:`, error)
        throw error
      }
    },
    { connection: redis }
  )

  // Email Notifications Worker
  const emailWorker = new Worker(
    QUEUE_NAMES.EMAIL_NOTIFICATIONS,
    async (job) => {
      const { to, subject, template, data } = job.data as EmailNotificationJobData
      
      try {
        console.log(`Sending email notification to: ${to}`)
        
        // Here you would implement email sending logic:
        // 1. Render email template
        // 2. Send via email service (SendGrid, AWS SES, etc.)
        
        console.log(`Email notification sent to: ${to}`)
        return { success: true, to }
      } catch (error) {
        console.error(`Email notification failed for ${to}:`, error)
        throw error
      }
    },
    { connection: redis }
  )

  return {
    ragWorker,
    documentWorker,
    emailWorker,
  }
}

// Helper functions
export const addRAGJob = async (data: RAGJobData) => {
  return ragQueue.add('process-rag', data, {
    priority: 1,
  })
}

export const addDocumentIngestionJob = async (data: DocumentIngestionJobData) => {
  return documentQueue.add('ingest-document', data, {
    priority: 2,
  })
}

export const addEmailNotificationJob = async (data: EmailNotificationJobData) => {
  return emailQueue.add('send-email', data, {
    priority: 3,
  })
}

// Graceful shutdown
export const closeQueues = async () => {
  await Promise.all([
    ragQueue.close(),
    documentQueue.close(),
    emailQueue.close(),
  ])
}
