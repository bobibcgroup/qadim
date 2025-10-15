import { createTRPCRouter } from "@/lib/trpc"
import { questionRouter } from "./routers/question"
import { answerRouter } from "./routers/answer"
import { sourceRouter } from "./routers/source"
import { communityRouter } from "./routers/community"
import { ragRouter } from "./routers/rag"

export const appRouter = createTRPCRouter({
  question: questionRouter,
  answer: answerRouter,
  source: sourceRouter,
  community: communityRouter,
  rag: ragRouter,
})

export type AppRouter = typeof appRouter
