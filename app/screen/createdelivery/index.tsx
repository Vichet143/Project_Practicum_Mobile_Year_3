import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Create from "./Create";
import Header from "@/components/headertop";
import { Stack } from "expo-router";

export default function Createdelivery() {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: "Create Delivery" }} />
      <View className="mt-[2rem] px-[1rem] flex-1">
        <Create />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
