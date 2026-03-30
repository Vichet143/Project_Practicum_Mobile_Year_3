import React from "react";
import { View } from "react-native";
import ChatList from "../../screen/chatscreen";

export default function TransporterChat() {
  return (
    <View style={{ flex: 1 }}>
      <ChatList isTransporter={true} />
    </View>
  );
}
