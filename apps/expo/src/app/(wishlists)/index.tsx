import { Link, Stack, router } from "expo-router"
import { Plus } from "lucide-react-native"
import { Button, Pressable, ScrollView, Text, View } from "react-native"
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"

import { api } from "~/utils/api"
import { useCallback, useMemo, useRef } from "react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import ControlledTextField from "~/forms/ControlledTextField"
import { orderBy } from "lodash"

const newListSchema = z.object({
  name: z.string().min(1).max(191),
})

type FormValues = z.infer<typeof newListSchema>

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ["25%", "100%"], [])

  const utils = api.useUtils()
  const { data: wishlists, isLoading } = api.listWishlists.useQuery()
  const { mutate: createWishList } = api.createWishlist.useMutation({
    onSuccess(data) {
      utils.listWishlists.setData(undefined, (prev) =>
        orderBy([...(prev ?? []), data], ["created"], ["asc"]),
      )
      bottomSheetRef.current?.close()
    },
  })

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

  const newListForm = useForm({
    resolver: zodResolver(newListSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    createWishList(values)
  }

  const onErrors: SubmitErrorHandler<FormValues> = (errors) => {}

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Pressable
              onPress={() => bottomSheetRef.current?.snapToIndex(0)}
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
              <Plus color="#000" size={16} style={{ marginRight: 6 }} />
              <Text>Add List</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView>
        {isLoading && <Text>Loading...</Text>}
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 20,
          }}
        >
          {wishlists?.map((wishlist) => (
            <Pressable
              key={wishlist.id}
              onPress={() => router.push(`/${wishlist.id}`)}
              style={{
                height: 200,
                width: "40%",
                borderWidth: 1,
                borderColor: "#000",
                marginBottom: 20,
              }}
            >
              <Text>{wishlist.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onClose={() => newListForm.reset()}
        enableHandlePanningGesture={false}
      >
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>New List</Text>
          <ControlledTextField
            control={newListForm.control}
            name="name"
            style={{ width: "100%" }}
            onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
            onBlur={() => bottomSheetRef.current?.snapToIndex(0)}
          />
          <Button
            onPress={newListForm.handleSubmit(onSubmit, onErrors)}
            title="Create List"
          />
        </View>
      </BottomSheet>
    </View>
  )
}
