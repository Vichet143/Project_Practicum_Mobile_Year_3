import { Stack } from "expo-router";

export default function HistoryScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Viewdetail"/>
    </Stack>
  );
}
