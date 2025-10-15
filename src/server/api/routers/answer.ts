import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/lib/trpc"
import { Persona } from "@prisma/client"

export const answerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        question_id: z.string(),
        summary: z.string().min(1),
        citations: z.array(
          z.object({
            source_id: z.string(),
            snippet: z.string(),
            authority_level: z.enum(['OFFICIAL', 'SCHOLARLY', 'PRESS', 'COMMUNITY', 'CLAIM']),
            status: z.enum(['VERIFIED', 'UNVERIFIED', 'CONTESTED']),
            score: z.number().min(0).max(1),
          })
        ),
        confidence: z.number().min(0).max(100),
        controversy: z.number().min(0).max(100),
        persona: z.nativeEnum(Persona).default(Persona.NEUTRAL),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: {
          question_id: input.question_id,
          summary: input.summary,
          citations: input.citations,
          confidence: input.confidence,
          controversy: input.controversy,
          persona: input.persona,
        },
      })
    }),

  getByQuestionId: publicProcedure
    .input(z.object({ question_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.answer.findMany({
        where: { question_id: input.question_id },
        orderBy: { created_at: 'desc' },
        include: {
          community_notes: {
            where: { status: 'APPROVED' },
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
      })
    }),

  updatePersona: protectedProcedure
    .input(
      z.object({
        answer_id: z.string(),
        persona: z.nativeEnum(Persona),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.answer.update({
        where: { id: input.answer_id },
        data: { persona: input.persona },
      })
    }),
})
