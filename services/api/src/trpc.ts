import { initTRPC } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import superjson from 'superjson'

// const t = initTRPC.create({
//   transformer: superjson,
// })

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { id: 'fbbbb321-eb88-4fc6-9258-f3d71ff328c9' }
  return {
    req,
    res,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})
export const createRouter = t.router

export const mergeRouters = t.mergeRouters

export const publicProcedure = t.procedure
