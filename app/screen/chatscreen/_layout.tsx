import { Stack } from "expo-router";

export default function ChatScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="massage" />
    </Stack>
  );
}
