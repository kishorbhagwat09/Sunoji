import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { usePlayer } from "./_context/PlayerContext";
import { Ionicons } from "@expo/vector-icons";

export default function PlayerScreen() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    position,
    duration,
    seekTo,
  } = usePlayer();

  if (!currentSong) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: "#aaa" }}>No song playing</Text>
      </View>
    );
  }

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentSong.cover }} style={styles.cover} />

      <Text style={styles.title}>{currentSong.title}</Text>
      <Text style={styles.artist}>{currentSong.artist}</Text>

      <Slider
        style={{ width: "90%" }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seekTo}
        minimumTrackTintColor="#6C8CFF"
        maximumTrackTintColor="#333"
        thumbTintColor="#6C8CFF"
      />

      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrev}>
          <Ionicons name="play-skip-back" size={34} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={70}
            color="#6C8CFF"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={34} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    width: 260,
    height: 260,
    borderRadius: 20,
    marginBottom: 30,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    color: "#aaa",
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    marginTop: 20,
  },
  timeRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "#aaa",
    fontSize: 12,
  },
  empty: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
  },
});
