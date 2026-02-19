import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Create from "./Create";
import Header from "@/components/headertop";
import { Stack } from "expo-router";

export default function Createdelivery() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Create Delivery" }} />
      <View>
        <Text>Createdelivery</Text>
      </View>
      <Create />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
