import { Stack } from 'expo-router';

export default function SubScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="opportunityApplication" />
       <Stack.Screen name="readiness" />
      {/*<Stack.Screen name="apply3" />
      <Stack.Screen name="opportunityDetail" /> */}
    </Stack>
  );
}