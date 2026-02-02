import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0B0F1A",
          borderTopColor: "#0B0F1A",
        },
        tabBarActiveTintColor: "#6C8CFF",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      {/* 🔥 SUNOJI REMIX */}
      <Tabs.Screen
        name="Sunoji Remix"
        options={{
          title: "Sunoji Remix",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />

      {/* 📚 LIBRARY */}
      <Tabs.Screen
        name="Library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
