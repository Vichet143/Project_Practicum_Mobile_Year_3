import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Change Password" }} />

      <View className="p-6">
        <Text className="text-sm text-gray-500 mb-2 font-medium">Current Password</Text>
        <View className="w-full bg-gray-50 flex-row items-center rounded-xl border border-gray-200 mb-4 pr-4">
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            className="flex-1 p-4"
            secureTextEntry={!showCurrent}
            placeholder="Enter current password"
          />
          <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
            <Ionicons name={showCurrent ? "eye-off" : "eye"} size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-gray-500 mb-2 font-medium mt-2">New Password</Text>
        <View className="w-full bg-gray-50 flex-row items-center rounded-xl border border-gray-200 mb-4 pr-4">
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            className="flex-1 p-4"
            secureTextEntry={!showNew}
            placeholder="Enter new password"
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Ionicons name={showNew ? "eye-off" : "eye"} size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-gray-500 mb-2 font-medium mt-2">Confirm New Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className="w-full bg-gray-50 p-4 rounded-xl text-black border border-gray-200 mb-8"
          secureTextEntry={!showNew}
          placeholder="Repeat new password"
        />

        <TouchableOpacity className="w-full bg-[#FF6347] p-4 rounded-xl items-center shadow-sm">
          <Text className="text-white font-bold text-lg">Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
