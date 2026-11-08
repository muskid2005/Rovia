import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useStore } from "../../src/store/useStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    bold: require("../../assets/fonts/static/Inter_18pt-Bold.ttf"),
    semiBold: require("../../assets/fonts/static/Inter_18pt-SemiBold.ttf"),
    regular: require("../../assets/fonts/static/Inter_18pt-Regular.ttf"),
  });

  const hasAuthHydrated = useAuthStore((state) => state._hasHydrated);
  const hasAppHydrated = useStore((state) => state._hasHydrated);

  const isReady = (loaded || error) && hasAuthHydrated && hasAppHydrated;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
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