import { Stack } from 'expo-router';

export default function SubScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="opportunityApplication" />
       <Stack.Screen name="readiness" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="savedOpportunities" />
      <Stack.Screen name="setting" />
      <Stack.Screen name="filter" />
      <Stack.Screen name="career" />
      <Stack.Screen name="education" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="certification" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="notificationsSettings" />
    </Stack>
  );
}