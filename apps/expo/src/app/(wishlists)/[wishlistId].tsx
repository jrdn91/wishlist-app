import { Stack, useLocalSearchParams } from "expo-router"
import React, { useCallback, useMemo, useRef } from "react"
import {
  Button,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native"
import { api } from "~/utils/api"
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { getStringAsync } from "expo-clipboard"
import * as z from "zod"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ControlledTextField from "~/forms/ControlledTextField"
import { orderBy } from "lodash"

const newItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

type FieldValues = z.infer<typeof newItemSchema>

const Wishlist = () => {
  const utils = api.useUtils()
  const { wishlistId } = useLocalSearchParams()

  const newItemForm = useForm<FieldValues>({
    defaultValues: {
      name: "",
      url: "",
    },
    resolver: zodResolver(newItemSchema),
  })

  const { data: wishlist } = api.getWishlistById.useQuery(
    wishlistId as string,
    {
      initialData: utils.listWishlists
        .getData()
        ?.find((w) => w.id === wishlistId),
    },
  )

  const { data: wishlistItems, isLoading: isLoadingWishlistItems } =
    api.listItemsByWishlistId.useQuery(wishlistId as string)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ["25%", "100%"], [])

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

  // const handleTextInputChange = async (text: string) => {
  //   const clipboardText = await getStringAsync()
  //   if (text === clipboardText) {
  //     // pasted
  //     console.log("pasted")
  //     bottomSheetRef.current?.snapToIndex(0)
  //     Keyboard.dismiss()
  //   }
  // }

  const { mutateAsync: createListItem } = api.createListItem.useMutation()

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const { url } = values
    const newItem = await createListItem({
      wishlistId: wishlistId as string,
      name: "test",
      url,
    })
    Keyboard.dismiss()
    bottomSheetRef.current?.close()
    newItemForm.reset()
    utils.listItemsByWishlistId.setData(wishlistId as string, (prev) =>
      orderBy([...(prev ?? []), newItem], ["created"], ["asc"]),
    )
  }

  const onErrors: SubmitErrorHandler<FieldValues> = (errors) => {
    console.log(errors)
  }

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            title: wishlist?.name ?? "",
          }}
        />
        {isLoadingWishlistItems && <Text>Loading Items...</Text>}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            paddingVertical: 20,
          }}
        >
          {!isLoadingWishlistItems && (
            <Pressable
              style={{
                height: 200,
                width: "40%",
                borderWidth: 1,
                borderColor: "#000",
                marginBottom: 20,
              }}
              onPress={() => bottomSheetRef.current?.snapToIndex(0)}
            >
              <Text>New Item</Text>
            </Pressable>
          )}
          {wishlistItems?.map((item) => (
            <View
              key={item.id}
              style={{
                height: 200,
                width: "40%",
                borderWidth: 1,
                borderColor: "#000",
                marginBottom: 20,
              }}
            >
              <Text>{item.name}</Text>
            </View>
          ))}
          {/* spacer element to make sure the new item is always pushed to the left */}
          {!isLoadingWishlistItems && (
            <View
              style={{
                width: "40%",
              }}
            />
          )}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // onClose={() => newListForm.reset()}
        enableHandlePanningGesture={false}
      >
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Add Item</Text>
          <Text>Paste link to the item</Text>
          <ControlledTextField
            control={newItemForm.control}
            name="url"
            // onChangeText={handleTextInputChange}
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: "#000",
              padding: 10,
              marginBottom: 20,
            }}
            onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
            onBlur={() => bottomSheetRef.current?.snapToIndex(0)}
          />
          <Button
            title="Submit"
            onPress={newItemForm.handleSubmit(onSubmit, onErrors)}
          />
        </View>
      </BottomSheet>
    </>
  )
}

export default Wishlist
