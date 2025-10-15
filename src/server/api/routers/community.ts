import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/lib/trpc"
import { CommunityStatus } from "@prisma/client"

export const communityRouter = createTRPCRouter({
  createNote: protectedProcedure
    .input(
      z.object({
        target_answer_id: z.string(),
        note: z.string().min(1).max(2000),
        citations: z.array(
          z.object({
            source_id: z.string(),
            snippet: z.string(),
            authority_level: z.enum(['OFFICIAL', 'SCHOLARLY', 'PRESS', 'COMMUNITY', 'CLAIM']),
            status: z.enum(['VERIFIED', 'UNVERIFIED', 'CONTESTED']),
            score: z.number().min(0).max(1),
          })
        ).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.communityNote.create({
        data: {
          user_id: ctx.session.user.id,
          target_answer_id: input.target_answer_id,
          note: input.note,
          citations: input.citations || [],
          status: CommunityStatus.PENDING,
        },
      })
    }),

  getNotesForAnswer: publicProcedure
    .input(z.object({ answer_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.communityNote.findMany({
        where: { target_answer_id: input.answer_id },
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      })
    }),

  getPendingNotes: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const notes = await ctx.prisma.communityNote.findMany({
        where: { status: CommunityStatus.PENDING },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          answer: {
            include: {
              question: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (notes.length > limit) {
        const nextItem = notes.pop()
        nextCursor = nextItem!.id
      }

      return {
        notes,
        nextCursor,
      }
    }),

  moderateNote: protectedProcedure
    .input(
      z.object({
        note_id: z.string(),
        status: z.nativeEnum(CommunityStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is moderator or admin
      if (!['MODERATOR', 'ADMIN'].includes(ctx.session.user.role)) {
        throw new Error('Unauthorized: Only moderators can moderate notes')
      }

      return ctx.prisma.communityNote.update({
        where: { id: input.note_id },
        data: { status: input.status },
      })
    }),

  getUserNotes: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const notes = await ctx.prisma.communityNote.findMany({
        where: { user_id: ctx.session.user.id },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { created_at: 'desc' },
        include: {
          answer: {
            include: {
              question: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (notes.length > limit) {
        const nextItem = notes.pop()
        nextCursor = nextItem!.id
      }

      return {
        notes,
        nextCursor,
      }
    }),
})
