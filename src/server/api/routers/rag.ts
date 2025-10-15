import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/lib/trpc"
import { Persona, Language } from "@prisma/client"
import { generateAnswer } from "@/lib/rag"

export const ragRouter = createTRPCRouter({
  askQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1).max(1000),
        lang: z.nativeEnum(Language).default(Language.EN),
        persona: z.nativeEnum(Persona).default(Persona.NEUTRAL),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create question record
      const question = await ctx.prisma.question.create({
        data: {
          text: input.question,
          lang: input.lang,
          user_id: ctx.session.user.id,
        },
      })

      // Generate answer using RAG
      const ragResult = await generateAnswer({
        question: input.question,
        lang: input.lang,
        persona: input.persona,
        userId: ctx.session.user.id,
      })

      // Create answer record
      const answer = await ctx.prisma.answer.create({
        data: {
          question_id: question.id,
          summary: ragResult.summary,
          citations: ragResult.citations,
          confidence: ragResult.confidence,
          controversy: ragResult.controversy,
          persona: input.persona,
        },
      })

      return {
        question,
        answer,
      }
    }),

  debateClaims: protectedProcedure
    .input(
      z.object({
        claim1: z.string().min(1),
        claim2: z.string().min(1),
        lang: z.nativeEnum(Language).default(Language.EN),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // This would implement the debate logic
      // For now, return a mock response
      return {
        verdict: "Both claims have merit based on available evidence",
        evidence1: {
          score: 0.7,
          sources: [],
        },
        evidence2: {
          score: 0.6,
          sources: [],
        },
        nuance: "The evidence suggests multiple perspectives on this topic",
      }
    }),

  getTimeline: publicProcedure
    .input(
      z.object({
        topic: z.string().min(1),
        startYear: z.number().optional(),
        endYear: z.number().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      // This would query for historical events related to the topic
      // For now, return mock data
      return {
        events: [
          {
            id: "1",
            title: "Sample Event",
            year: 1000,
            description: "A significant historical event",
            sources: [],
          },
        ],
      }
    }),
})
