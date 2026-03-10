import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const displayName =
    user?.fullname || "No name";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login"); // 👈 change to your login route
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      {/* Profile Card */}
      <View className="bg-white mx-4 mt-6 rounded-2xl p-6 shadow-sm items-center">
        {/* Avatar */}
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className="w-20 h-20 rounded-full mb-3"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-[#FF6347] items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">
              {displayName?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>
        )}

        <Text className="text-xl font-bold text-gray-800">{displayName}</Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.email}</Text>
        <Text className="text-gray-400 text-sm">{user?.phone_number}</Text>
      </View>

      {/* Menu Items */}
      <View className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
        <MenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => {}}
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => {}}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => {}}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => {}}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-white mx-4 mt-4 rounded-2xl p-4 flex-row items-center shadow-sm"
      >
        <Ionicons name="log-out-outline" size={22} color="#FF6347" />
        <Text className="text-[#FF6347] font-bold text-base ml-3">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---- Reusable Menu Item ---- */
function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4 border-b border-gray-100"
    >
      <Ionicons name={icon} size={20} color="#FF6347" />
      <Text className="flex-1 ml-3 text-gray-700 text-base">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );
}
