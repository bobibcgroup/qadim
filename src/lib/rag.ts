import OpenAI from 'openai'
import { prisma } from './prisma'
import { Persona, Language, AuthorityLevel, SourceStatus } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface RAGRequest {
  question: string
  lang: Language
  persona: Persona
  userId: string
}

export interface Citation {
  source_id: string
  snippet: string
  authority_level: AuthorityLevel
  status: SourceStatus
  score: number
}

export interface RAGResult {
  summary: string
  citations: Citation[]
  confidence: number
  controversy: number
}

// Embedding dimensions for OpenAI text-embedding-3-small
const EMBEDDING_DIMENSIONS = 1536

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  
  return response.data[0].embedding
}

export async function retrieveRelevantDocs(
  query: string,
  limit: number = 10
): Promise<any[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)
  
  // For now, return mock documents since we're not using pgvector yet
  // In production, you'd implement proper vector similarity search
  const docs = await prisma.doc.findMany({
    take: limit,
    where: {
      source: {
        status: 'VERIFIED'
      }
    },
    include: {
      source: true
    },
    orderBy: {
      created_at: 'desc'
    }
  })
  
  // Add mock similarity scores for demo
  const docsWithScores = docs.map(doc => ({
    ...doc,
    source_id: doc.source.id,
    source_title: doc.source.title,
    authority_level: doc.source.authority_level,
    status: doc.source.status,
    publisher: doc.source.publisher,
    year: doc.source.year,
    credibility: doc.source.credibility,
    similarity_score: Math.random() * 0.3 + 0.7 // Mock similarity score
  }))
  
  return docsWithScores
}

export async function generateAnswer(request: RAGRequest): Promise<RAGResult> {
  const { question, lang, persona, userId } = request
  
  try {
    // Retrieve relevant documents
    const relevantDocs = await retrieveRelevantDocs(question, 10)
    
    if (relevantDocs.length === 0) {
      return {
        summary: "I couldn't find relevant information to answer your question. Please try rephrasing or check back later as we continue to expand our knowledge base.",
        citations: [],
        confidence: 0,
        controversy: 0,
      }
    }
    
    // Group documents by authority level
    const groupedDocs = relevantDocs.reduce((acc, doc) => {
      const level = doc.authority_level
      if (!acc[level]) acc[level] = []
      acc[level].push(doc)
      return acc
    }, {} as Record<string, any[]>)
    
    // Calculate confidence based on source quality
    const confidence = calculateConfidence(relevantDocs)
    
    // Calculate controversy based on conflicting sources
    const controversy = calculateControversy(relevantDocs)
    
    // Prepare context for OpenAI
    const context = relevantDocs
      .map((doc, index) => 
        `[${index + 1}] ${doc.source_title} (${doc.authority_level}, ${doc.year || 'Unknown year'})
Publisher: ${doc.publisher || 'Unknown'}
Credibility: ${doc.credibility}/100
Content: ${doc.content.substring(0, 500)}...`
      )
      .join('\n\n')
    
    // Generate answer with persona-specific prompting
    const systemPrompt = getSystemPrompt(persona, lang)
    const userPrompt = `Question: ${question}\n\nContext:\n${context}\n\nPlease provide a comprehensive answer based on the provided sources. Include specific citations using [1], [2], etc. format.`
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })
    
    const summary = completion.choices[0]?.message?.content || 'Unable to generate answer'
    
    // Extract citations from the response
    const citations = extractCitations(summary, relevantDocs)
    
    return {
      summary,
      citations,
      confidence,
      controversy,
    }
  } catch (error) {
    console.error('RAG generation error:', error)
    throw new Error('Failed to generate answer')
  }
}

function getSystemPrompt(persona: Persona, lang: Language): string {
  const basePrompt = `You are Qadim, an AI assistant specialized in Lebanese and Phoenician history, politics, and culture. You provide accurate, well-sourced answers based on historical documents and scholarly research.

Guidelines:
- Always cite sources using [1], [2], etc. format
- Be precise and factual
- Acknowledge uncertainty when sources conflict
- Group information by authority level (Official, Scholarly, Press, Community, Claims)
- Maintain academic rigor while being accessible`

  if (persona === 'ZAATAR') {
    return basePrompt + `

Persona: You're in "Zaatar Mode" - maintain Lebanese cultural warmth and context:
- Use Lebanese expressions and cultural references where appropriate
- Show pride in Lebanese heritage while remaining factual
- Include cultural context that helps explain historical significance
- Use a slightly more conversational tone while maintaining accuracy`
  }
  
  return basePrompt + `

Persona: You're in "Neutral Mode" - maintain academic objectivity:
- Use formal, scholarly language
- Present information without cultural bias
- Focus on facts and verifiable information
- Maintain professional academic tone`
}

function calculateConfidence(docs: any[]): number {
  if (docs.length === 0) return 0
  
  const avgCredibility = docs.reduce((sum, doc) => sum + doc.credibility, 0) / docs.length
  
  // Boost confidence for official sources
  const officialCount = docs.filter(doc => doc.authority_level === 'OFFICIAL').length
  const officialBoost = (officialCount / docs.length) * 20
  
  // Boost confidence for recent sources
  const currentYear = new Date().getFullYear()
  const recentDocs = docs.filter(doc => doc.year && (currentYear - doc.year) < 20)
  const recencyBoost = (recentDocs.length / docs.length) * 10
  
  return Math.min(100, Math.round(avgCredibility + officialBoost + recencyBoost))
}

function calculateControversy(docs: any[]): number {
  if (docs.length <= 1) return 0
  
  // Check for conflicting information by comparing authority levels
  const authorityCounts = docs.reduce((acc, doc) => {
    acc[doc.authority_level] = (acc[doc.authority_level] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // High controversy if many different authority levels
  const uniqueAuthorities = Object.keys(authorityCounts).length
  const maxAuthorityCount = Math.max(...Object.values(authorityCounts))
  const controversy = Math.round(((uniqueAuthorities - 1) / (docs.length - 1)) * 100)
  
  // Boost controversy if there are many unverified claims
  const claimCount = authorityCounts['CLAIM'] || 0
  const claimBoost = (claimCount / docs.length) * 30
  
  return Math.min(100, controversy + claimBoost)
}

function extractCitations(summary: string, docs: any[]): Citation[] {
  const citations: Citation[] = []
  const citationRegex = /\[(\d+)\]/g
  const matches = summary.match(citationRegex)
  
  if (!matches) return citations
  
  matches.forEach(match => {
    const index = parseInt(match.slice(1, -1)) - 1
    if (index >= 0 && index < docs.length) {
      const doc = docs[index]
      citations.push({
        source_id: doc.source_id,
        snippet: doc.content.substring(0, 200) + '...',
        authority_level: doc.authority_level,
        status: doc.status,
        score: doc.similarity_score || 0,
      })
    }
  })
  
  return citations
}

// Batch processing for document ingestion
export async function processDocumentBatch(sourceId: string, documents: any[]) {
  try {
    for (const doc of documents) {
      // Generate embedding for the document
      const embedding = await generateEmbedding(doc.content)
      
      // Store in database
      await prisma.doc.create({
        data: {
          source_id: sourceId,
          title: doc.title,
          content: doc.content,
          embedding: JSON.stringify(embedding), // Store as JSON string
          lang: doc.language || 'EN',
          published_at: doc.publishedAt ? new Date(doc.publishedAt) : null,
        },
      })
    }
    
    console.log(`Processed ${documents.length} documents for source ${sourceId}`)
  } catch (error) {
    console.error('Document batch processing error:', error)
    throw error
  }
}
