import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/lib/trpc"
import { Language } from "@prisma/client"

export const questionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1).max(1000),
        lang: z.nativeEnum(Language).default(Language.EN),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          text: input.text,
          lang: input.lang,
          user_id: ctx.session.user.id,
        },
      })
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.question.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          answers: {
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
          },
        },
      })
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const questions = await ctx.prisma.question.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          answers: {
            take: 1,
            orderBy: { created_at: 'desc' },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (questions.length > limit) {
        const nextItem = questions.pop()
        nextCursor = nextItem!.id
      }

      return {
        questions,
        nextCursor,
      }
    }),
})
