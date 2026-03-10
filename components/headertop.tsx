import { Image, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Header({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const getHeaderInfo = () => {
    switch (route.name) {
      case "index":
      case "home":
        return { title: "SmartMove", showLogo: true, showBack: false };
      case "history":
        return { title: "History", showLogo: false, showBack: true };
      case "chat":
        return { title: "Chat", showLogo: false, showBack: true };
      case "profile":
        return { title: "Profile", showLogo: false, showBack: true };
      case "tracking":
        return { title: "Tracking", showLogo: false, showBack: false };
      case "search":
        return { title: "Search", showLogo: false, showBack: false };
      default:
        return { title: route.name, showLogo: false, showBack: true };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: "#FF6347" }}>
      <View className="h-[70px] w-full flex-row items-center justify-between px-4 shadow-md">
        <View className="flex-row items-center">
          {headerInfo.showLogo && (
            <Image
              source={require("../assets/images/headertop/logoAppdelivery2.png")}
              className="h-11 w-11 mr-2"
              resizeMode="contain"
            />
          )}

          <Text className="text-white text-[20px] font-bold tracking-wide">
            {headerInfo.title}
          </Text>
        </View>

        {/* Notification bell on home only */}
        {(route.name === "index" || route.name === "home") && (
          <TouchableOpacity className="bg-white p-2 rounded-full">
            <Ionicons name="notifications-outline" size={22} color="#FF6347" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
