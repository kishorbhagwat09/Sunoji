import { Slot, usePathname } from "expo-router";
import { View } from "react-native";
import MiniPlayer from "./components/MiniPlayer";
import { PlayerProvider } from "./context/PlayerContext";

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
