import ChatList from "../../screen/chatscreen";
import React from "react";
import { View } from "react-native";

export default function chat() {
  return (
    <View style={{ flex: 1 }}>
      <ChatList />
    </View>
  );
}
