// screen/_layout.tsx
import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#FF6347" },
        headerTitleStyle: { color: "#FFFFFF" },
        headerTintColor: "#FFFFFFFF",
      }}
    >
      <Stack.Screen
        name="chatscreen"
        options={{
          title: "",
          headerTintColor: "#FF6347",
        }}
      />
    </Stack>
  );
}
