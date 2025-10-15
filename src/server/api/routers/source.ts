import { z } from "zod"
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/lib/trpc"
import { AuthorityLevel, SourceStatus, Language } from "@prisma/client"

export const sourceRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        authority_level: z.nativeEnum(AuthorityLevel).optional(),
        status: z.nativeEnum(SourceStatus).optional(),
        lang: z.nativeEnum(Language).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, ...filters } = input

      const sources = await ctx.prisma.source.findMany({
        where: filters,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { credibility: 'desc' },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (sources.length > limit) {
        const nextItem = sources.pop()
        nextCursor = nextItem!.id
      }

      return {
        sources,
        nextCursor,
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.source.findUnique({
        where: { id: input.id },
        include: {
          docs: {
            take: 10,
            orderBy: { created_at: 'desc' },
          },
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        publisher: z.string().optional(),
        url: z.string().url().optional(),
        lang: z.nativeEnum(Language),
        year: z.number().optional(),
        authority_level: z.nativeEnum(AuthorityLevel),
        credibility: z.number().min(0).max(100).default(50),
        provenance: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.source.create({
        data: {
          ...input,
          status: SourceStatus.UNVERIFIED,
        },
      })
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(SourceStatus),
        credibility: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.source.update({
        where: { id: input.id },
        data: {
          status: input.status,
          credibility: input.credibility,
        },
      })
    }),
})
