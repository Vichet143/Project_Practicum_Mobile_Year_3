import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export default function NotificationsSettings() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [updatesEnabled, setUpdatesEnabled] = useState(true);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Notifications" }} />

      <View className="p-6">
        <Text className="text-gray-500 mb-4 px-2">Manage what alerts you receive.</Text>
        
        <View className="bg-gray-50 rounded-2xl border border-gray-100 p-2">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View>
              <Text className="text-base font-bold text-gray-800">Push Notifications</Text>
              <Text className="text-xs text-gray-500 mt-1">Receive alerts on your phone</Text>
            </View>
            <Switch 
              trackColor={{ false: "#e5e7eb", true: "#ffb4a6" }}
              thumbColor={pushEnabled ? "#FF6347" : "#f4f3f4"}
              onValueChange={setPushEnabled} 
              value={pushEnabled} 
            />
          </View>

          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View>
              <Text className="text-base font-bold text-gray-800">Email Alerts</Text>
              <Text className="text-xs text-gray-500 mt-1">Receive notifications via email</Text>
            </View>
            <Switch 
              trackColor={{ false: "#e5e7eb", true: "#ffb4a6" }}
              thumbColor={emailEnabled ? "#FF6347" : "#f4f3f4"}
              onValueChange={setEmailEnabled} 
              value={emailEnabled} 
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View>
              <Text className="text-base font-bold text-gray-800">Order Updates</Text>
              <Text className="text-xs text-gray-500 mt-1">Live status for your deliveries</Text>
            </View>
            <Switch 
              trackColor={{ false: "#e5e7eb", true: "#ffb4a6" }}
              thumbColor={updatesEnabled ? "#FF6347" : "#f4f3f4"}
              onValueChange={setUpdatesEnabled} 
              value={updatesEnabled} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}
