import { Stack } from 'expo-router';

export default function SubScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="apply1" />
      <Stack.Screen name="apply2" />
      <Stack.Screen name="apply3" />
      <Stack.Screen name="opportunityDetail" />
    </Stack>
  );
}