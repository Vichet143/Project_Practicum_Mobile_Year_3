import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { token, user, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = user?.role?.toLowerCase?.();

  if (role === "transporter") {
    return <Redirect href="/navigation/transporter" />;
  }

  return <Redirect href="/navigation/user" />;
}
