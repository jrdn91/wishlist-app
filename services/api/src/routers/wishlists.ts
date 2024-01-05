import { prisma } from '../prisma'
import { createRouter, publicProcedure } from '../trpc'
import * as z from 'zod'

export const wishlists = createRouter({
  createWishlist: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(191),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const newWishlist = await prisma.wishlist.create({
        data: {
          name: input.name,
          creatorUserId: ctx.user.id,
          users: {
            create: {
              user: {
                connect: {
                  id: ctx.user.id,
                },
              },
            },
          },
        },
      })
      return newWishlist
    }),
  listWishlists: publicProcedure.query(async ({ ctx }) => {
    const wishlistsForUser = (
      await prisma.usersToWishlists.findMany({
        include: {
          wishlist: true,
        },
        where: {
          userId: ctx.user.id,
        },
      })
    ).map(({ wishlist }) => wishlist)
    return wishlistsForUser
  }),
})
