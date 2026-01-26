import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { usePlayer } from "../_context/PlayerContext";
import { useRouter } from "expo-router";

export default function MiniPlayer() {
  const router = useRouter();
  const { currentSong, isPlaying, togglePlayPause, playNext } = usePlayer();

  // 🔴 song नसेल तर काहीच दाखवायचं नाही
  if (!currentSong) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("/player")} // big player open
      activeOpacity={0.9}
    >
      <Image source={{ uri: currentSong.cover }} style={styles.cover} />

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.title}>
          {currentSong.title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {currentSong.artist}
        </Text>
      </View>

      <TouchableOpacity onPress={togglePlayPause}>
        <Text style={styles.control}>
          {isPlaying ? "⏸" : "▶"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={playNext}>
        <Text style={styles.control}>⏭</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: "#141A2E",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  cover: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  artist: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  control: {
    color: "#6C8CFF",
    fontSize: 22,
    marginHorizontal: 8,
  },
});
