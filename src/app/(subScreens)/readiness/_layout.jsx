import { Stack } from 'expo-router';

export default function SubScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="readinessReview" />
       <Stack.Screen name="readinessResult" />
      <Stack.Screen name="recommendations" />
      {/*<Stack.Screen name="opportunityDetail" /> */}
    </Stack>
  );
}