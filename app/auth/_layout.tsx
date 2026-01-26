import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const time = await AsyncStorage.getItem("login_time");

        if (token && time) {
          const diff = Date.now() - Number(time);
          const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

          if (diff < THIRTY_DAYS) {
            // ✅ User already logged in
            router.replace("/(tabs)");
            return;
          } else {
            // ❌ Session expired
            await AsyncStorage.clear();
          }
        }
      } catch (e) {
        await AsyncStorage.clear();
      }

      if (mounted) setChecking(false);
    };

    checkLogin();

    return () => {
      mounted = false;
    };
  }, []);

  // ⏳ While checking login status
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C8CFF" />
      </View>
    );
  }

  // 👉 Show login / register screens
  return <Slot />;
}
