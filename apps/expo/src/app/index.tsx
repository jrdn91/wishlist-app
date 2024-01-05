import { Button, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

import { api } from '~/utils/api'

export default function Index() {
  const utils = api.useUtils()
  const { data: wishlists, isLoading } = api.listWishlists.useQuery()
  const { mutate } = api.createWishlist.useMutation({
    onSuccess(data) {
      utils.listWishlists.setData(undefined, (prev) => [...(prev ?? []), data])
    },
  })

  const handleCreateWishlist = () => {
    mutate({
      name: `New Wishlist ${Math.random()}`,
    })
  }

  return (
    <SafeAreaView className="">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: 'Home Page' }} />
      <View className="">
        <Text className="">
          Create <Text className="text-pink-400">T3</Text> Turbo 2
        </Text>
        <Button title="Create Wishlist" onPress={handleCreateWishlist} />
        {isLoading && <Text>Loading...</Text>}
        {wishlists?.map((wishlist) => (
          <Text key={wishlist.id}>{wishlist.name}</Text>
        ))}
      </View>
    </SafeAreaView>
  )
}
