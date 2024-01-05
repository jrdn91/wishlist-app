import { Stack, router } from "expo-router"
import { X } from "lucide-react-native"
import React from "react"
import { Pressable, Text } from "react-native"

const AddList = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: "New List",
          headerRight() {
            return (
              <Pressable onPress={router.back}>
                <X color="#000" size={16} />
              </Pressable>
            )
          },
        }}
      />
      <Text>Add List</Text>
    </>
  )
}

export default AddList
