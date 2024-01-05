import 'dotenv/config'

import type { FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import type { AppRouter } from '..'
import { appRouter } from '..'
import cors from '@fastify/cors'
import { createContext } from './trpc'

const server = fastify({
  maxParamLength: 5000, // needed for TRPC
})

// register TRPC as plugin with fastify
await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
})

// register CORS plugin
await server.register(cors, {
  origin: '*',
  methods: ['OPTIONS', 'GET', 'POST'],
  allowedHeaders: '*',
})

// start server
try {
  await server.listen({
    port: 5000,
  })
} catch (e) {
  server.log.error(e)
  process.exit(1)
}
