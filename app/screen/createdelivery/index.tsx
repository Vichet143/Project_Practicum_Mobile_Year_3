import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Create from "./Create";

export default function Createdelivery() {
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: "Create Delivery" }} />
      <View className="mt-[2rem] px-[1rem] flex-1">
        <Create />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
