// screen/_layout.tsx
import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#FF6347" },
        headerTintColor: "#fff",
      }}
    />
  );
}
