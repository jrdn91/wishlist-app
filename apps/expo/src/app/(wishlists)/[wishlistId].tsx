import { Stack, useLocalSearchParams } from "expo-router"
import React from "react"
import { Text, View } from "react-native"
import { api } from "~/utils/api"

const Wishlist = () => {
  const utils = api.useUtils()
  const { wishlistId } = useLocalSearchParams()

  const { data: wishlist } = api.getWishlistById.useQuery(
    wishlistId as string,
    {
      initialData: utils.listWishlists
        .getData()
        ?.find((w) => w.id === wishlistId),
    },
  )

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: wishlist?.name ?? "",
        }}
      />
      <Text>{wishlistId}</Text>
    </View>
  )
}

export default Wishlist
