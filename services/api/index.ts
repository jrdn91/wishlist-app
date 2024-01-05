import { mergeRouters } from './src/trpc'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { wishlists } from './src/routers/wishlists'

export const appRouter = mergeRouters(wishlists)

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>

export type AppRouter = typeof appRouter
