import { StyleSheet, View } from "react-native";
import React from "react";
import Profile from "../screen/profile";
import { SafeAreaView } from "react-native-safe-area-context";


export default function profile() {
  return (
    <View style={{ flex: 1 }}>
      <Profile />
    </View>
  );
}
