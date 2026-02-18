import { Image, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View className="h-[70px] w-full flex-row items-center justify-between bg-[#FF6347] px-4 shadow-md">

      <View className="flex-row items-center">
        <Image
          source={require("../assets/images/headertop/logoAppdelivery2.png")}
          className="h-11 w-11 mr-2"
          resizeMode="contain"
        />

        <Text className="text-white text-[20px] font-bold tracking-wide">
          SmartMove
        </Text>
      </View>

      <TouchableOpacity className="bg-white p-2 rounded-full">
        <Ionicons name="notifications-outline" size={22} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );
}
