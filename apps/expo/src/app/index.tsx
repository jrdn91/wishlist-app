import { Button, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

import { api } from '~/utils/api'

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ["25%"], [])

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  )

  const newListForm = useForm({})

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Pressable
              onPress={() => bottomSheetRef.current?.expand()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Plus color="#000" size={16} style={{ marginTop: -2 }} />
              <Text>Add List</Text>
            </Pressable>
          ),
        }}
      />
      <View>
        <Button title="Create Wishlist" onPress={handleCreateWishlist} />
        {isLoading && <Text>Loading...</Text>}
        {wishlists?.map((wishlist) => (
          <Text key={wishlist.id}>{wishlist.name}</Text>
        ))}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 18 }}>New List</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
