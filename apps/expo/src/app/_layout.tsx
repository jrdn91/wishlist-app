import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { TRPCProvider } from "~/utils/api"

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(wishlists)",
}

const _layout = () => {
  return (
    <TRPCProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar />
    </TRPCProvider>
  )
}

export default _layout
