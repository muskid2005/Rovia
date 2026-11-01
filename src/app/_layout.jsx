import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();

  const [loaded, error] = useFonts({
    bold: require("../../assets/fonts/static/Inter_18pt-Bold.ttf"),
    semiBold: require("../../assets/fonts/static/Inter_18pt-SemiBold.ttf"),
    regular: require("../../assets/fonts/static/Inter_18pt-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
