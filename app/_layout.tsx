import { Slot, usePathname } from "expo-router";
import { PlayerProvider } from "./_context/PlayerContext";
import MiniPlayer from "./components/MiniPlayer";
import { View } from "react-native";

export default function RootLayout() {
  const pathname = usePathname();

  // ❌ Player screen वर MiniPlayer नको
  const hideMiniPlayer = pathname === "/player";

  return (
    <PlayerProvider>
      <View style={{ flex: 1 }}>
        <Slot />

        {!hideMiniPlayer && <MiniPlayer />}
      </View>
    </PlayerProvider>
  );
}
