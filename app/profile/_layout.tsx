import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="likes" />
      <Stack.Screen name="playlist" />
    </Stack>
  );
}
