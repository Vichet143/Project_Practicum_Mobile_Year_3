import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Tracking from "./Tracking";

export default function Createdelivery() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Tracking" }} />
      <Tracking />
    </SafeAreaView>
  );
}
