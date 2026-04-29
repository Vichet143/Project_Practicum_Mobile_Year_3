import { updateUserProfile, useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const currentRole = user?.role || (user as any)?.roles || "user";
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [phone_number, setPhone] = useState(user?.phone_number || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const user_id = (params.uid as string) || user?.id;
  console.log(currentRole);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission to access photos is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoURL(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user_id) {
      alert("Cannot update profile: user id is missing.");
      return;
    }

    const isLocalPhotoUri =
      photoURL.startsWith("file://") || photoURL.startsWith("content://");

    if (isLocalPhotoUri) {
      // Local-only mode: keep local image URI on this device without backend update.
      useAuthStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              id: user_id,
              fullname,
              phone_number,
              photoURL,
            }
          : state.user,
      }));
      alert("Profile photo saved locally on this device.");
      router.back();
      return;
    }

    if (currentRole === "user") {
      const result = await updateUserProfile(
        user_id,
        fullname,
        user?.email || "",
        "",
        photoURL,
        phone_number,
        currentRole,
      );
      console.log(
        user_id,
        fullname,
        user?.email,
        photoURL,
        phone_number,
        user?.role,
      );

      if (result.success) {
        useAuthStore.setState((state) => ({
          user: state.user
            ? {
                ...state.user,
                fullname,
                phone_number,
                photoURL,
                role: currentRole,
                roles: currentRole,
              }
            : state.user,
        }));
        alert("Profile updated successfully!");
        router.back();
      } else {
        alert(`Failed to update profile: ${result.message}`);
      }
    } else {
      const result = await updateUserProfile(
        user_id,
        fullname,
        user?.email || "",
        "",
        photoURL,
        phone_number,
        currentRole,
      );
      console.log(
        user_id,
        fullname,
        user?.email,
        photoURL,
        phone_number,
        user?.role,
      );

      if (result.success) {
        useAuthStore.setState((state) => ({
          user: state.user
            ? {
                ...state.user,
                fullname,
                phone_number,
                photoURL,
                role: currentRole,
                roles: currentRole,
              }
            : state.user,
        }));
        alert("Profile updated successfully!");
        router.back();
      } else {
        alert(`Failed to update profile: ${result.message}`);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Edit Profile" }} />

      <View className="p-6 items-center">
        /* Avatar with Camera Icon */
        <View className="relative">
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              className="w-24 h-24 rounded-full border border-gray-200"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
              <Ionicons name="person" size={40} color="#9ca3af" />
            </View>
          )}
          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-[#FF6347] w-8 h-8 rounded-full items-center justify-center border-2 border-white"
            onPress={handlePickImage}
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        /* Input Fields */
        <View className="w-full mt-8">
          <Text className="text-sm text-gray-500 mb-2 font-medium">
            Full Name
          </Text>
          <TextInput
            value={fullname}
            onChangeText={setFullname}
            className="w-full bg-gray-50 p-4 rounded-xl text-black border border-gray-200 mb-4"
            placeholder="Enter full name"
          />
          <Text className="text-sm text-gray-500 mb-2 font-medium">
            Phone Number
          </Text>
          <TextInput
            value={phone_number}
            onChangeText={setPhone}
            className="w-full bg-gray-50 p-4 rounded-xl text-black border border-gray-200 mb-8"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
          /* Save Button */
          <TouchableOpacity
            className="w-full bg-[#FF6347] p-4 rounded-xl items-center shadow-sm"
            onPress={handleUpdateProfile}
          >
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
