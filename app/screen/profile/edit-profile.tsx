import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [phone, setPhone] = useState(user?.phone_number || "");

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Edit Profile" }} />

      <View className="p-6 items-center">
        {/* Avatar with Camera Icon */}
        <View className="relative">
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              className="w-24 h-24 rounded-full border border-gray-200"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
              <Ionicons name="person" size={40} color="#9ca3af" />
            </View>
          )}
          <TouchableOpacity className="absolute bottom-0 right-0 bg-[#FF6347] w-8 h-8 rounded-full items-center justify-center border-2 border-white">
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View className="w-full mt-8">
          <Text className="text-sm text-gray-500 mb-2 font-medium">Full Name</Text>
          <TextInput
            value={fullname}
            onChangeText={setFullname}
            className="w-full bg-gray-50 p-4 rounded-xl text-black border border-gray-200 mb-4"
            placeholder="Enter full name"
          />

          <Text className="text-sm text-gray-500 mb-2 font-medium">Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            className="w-full bg-gray-50 p-4 rounded-xl text-black border border-gray-200 mb-8"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          {/* Save Button */}
          <TouchableOpacity className="w-full bg-[#FF6347] p-4 rounded-xl items-center shadow-sm">
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
