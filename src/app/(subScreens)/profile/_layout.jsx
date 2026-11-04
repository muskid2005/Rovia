import { Stack } from 'expo-router';

export default function SubScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profileUpdateFile" />
        <Stack.Screen name="fullProfile" />
      {/*<Stack.Screen name="recommendations" /> */}
      {/*<Stack.Screen name="opportunityDetail" /> */}
    </Stack>
  );
}