import { Image, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; 
 
export default function Header({route}: any) {

  // Determine header content based on route name
  const HeaderTop = () => {
    switch (route.name) {
      case "index":
        return {
          title: "SmartMove",
          showLogo: true,
        }; 
      case "history":
        return {
          title: "History",
          showLogo: false,
        };
      case "chat":
        return {
          title: "Chat",
          showLogo: false,
        };
      case "profile":
        return {
          title: "Profile",
          showLogo: false,
        };
      default:
        return {
          title: route.name,
          showLogo: false,
        };
    }
  }

  const headerInfo = HeaderTop();

  return (
   <SafeAreaView edges={['top']}>
      <View className="h-[70px] w-full bg-[#FF6347] flex-row items-center justify-between px-4 shadow-md">

        {/* Visible logo on home page */}
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

        {route.name === "index" && (
          <TouchableOpacity className="bg-white p-2 rounded-full">
            <Ionicons name="notifications-outline" size={22} color="#FF6347" />
          </TouchableOpacity>
        )}
        
      </View>
   </SafeAreaView>
  );
}
