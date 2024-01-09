import { prisma } from "../prisma"
import { createRouter, publicProcedure } from "../trpc"
import * as z from "zod"

export const items = createRouter({
  listItemsByWishlistId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const items = await prisma.wishlistItem.findMany({
        where: {
          wishlistId: input,
        },
      })
      return items
    }),
  createListItem: publicProcedure
    .input(
      z.object({
        url: z.string().min(1).max(191),
        name: z.string().min(1).max(191),
        wishlistId: z.string().min(1).max(191),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const newItem = await prisma.wishlistItem.create({
        data: {
          url: input.url,
          name: input.name,
          wishlistId: input.wishlistId,
        },
      })
      return newItem
    }),
})
