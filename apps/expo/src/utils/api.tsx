import { useState } from 'react'
import Constants from 'expo-constants'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'

import type { AppRouter } from '@repo/api'

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>()
export { type RouterInputs, type RouterOutputs } from '@repo/api'

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `http://localhost:5000/trpc`,
          headers() {
            const headers = new Map<string, string>()
            headers.set('x-trpc-source', 'expo-react')
            return Object.fromEntries(headers)
          },
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
          colorMode: 'ansi',
        }),
      ],
    }),
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  )
}
