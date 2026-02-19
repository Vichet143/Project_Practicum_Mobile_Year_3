import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Tracking from "./Tracking";
import Header from "@/components/headertop";
import { Stack } from "expo-router";

export default function Createdelivery() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Tracking" }} />
      <View>
        <Text>Createdelivery</Text>
      </View>
      <Tracking />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
