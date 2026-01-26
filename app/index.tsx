import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth");
    }, 3000); // 3 sec splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logoo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sunoji</Text>
      <Text style={styles.tagline}>Feel the music</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  tagline: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
  },
});
