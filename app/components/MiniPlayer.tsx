import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePlayer } from "../context/PlayerContext";
import { useEffect, useRef } from "react";

export default function MiniPlayer() {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    toggleLike,
    likedSongs,
  } = usePlayer();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  if (!currentSong) return null;

  const isLiked = likedSongs.has(String(currentSong.id));

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("/player")}
      activeOpacity={0.95}
    >
      {/* Gradient Background */}
      <LinearGradient
        colors={["rgba(20, 26, 46, 0.95)", "rgba(30, 40, 70, 0.95)"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animated Visualizer Line */}
      {isPlaying && (
        <View style={styles.visualizerContainer}>
          {[...Array(8)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.visualizerBar,
                {
                  height: isPlaying ? Math.random() * 12 + 4 : 4,
                  backgroundColor: i % 2 === 0 ? "#6C8CFF" : "#4C6FFF",
                }
              ]}
            />
          ))}
        </View>
      )}

      <View style={styles.content}>
        {/* Album Cover with Rotation Animation */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Image
  source={{ uri: currentSong.cover }}
  style={styles.cover}
/>

          {/* Playing Indicator Dot */}
          {isPlaying && <View style={styles.playingIndicator} />}
        </Animated.View>

        {/* Song Info */}
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {currentSong.title}
          </Text>
          <View style={styles.artistContainer}>
            <FontAwesome5 name="user-alt" size={10} color="#9CA3AF" />
            <Text numberOfLines={1} style={styles.artist}>
              {currentSong.artist}
            </Text>
          </View>
        </View>

        {/* Controls Container */}
        <View style={styles.controlsContainer}>
          {/* Like Button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleLike(String(currentSong.id));
            }}
            style={[styles.iconButton, styles.likeButton]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isLiked ? "favorite" : "favorite-outline"}
              size={22}
              color={isLiked ? "#FF3B5C" : "#8B9CB6"}
            />
            {isLiked && <View style={styles.likedPulse} />}
          </TouchableOpacity>

          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={styles.playButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isPlaying ? ["#FF6B6B", "#FF8E53"] : ["#6C8CFF", "#4C6FFF"]}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons
                name={isPlaying ? "pause" : "play-arrow"}
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              playNext();
            }}
            style={[styles.iconButton, styles.nextButton]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="skip-next" size={24} color="#6C8CFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={["#6C8CFF", "#4C6FFF"]}
            style={[styles.progressFill, { width: "30%" }]} // Replace with actual progress
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    left: 16,
    right: 16,
    backgroundColor: "transparent",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(108, 140, 255, 0.1)",
  },
  visualizerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 20,
    paddingHorizontal: 20,
    gap: 3,
  },
  visualizerBar: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  playingIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
    borderWidth: 2,
    borderColor: "#141A2E",
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "System", // Consider using a custom font like "Inter-Bold"
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  artist: {
    color: "#8B9CB6",
    fontSize: 13,
    fontWeight: "500",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  likeButton: {
    backgroundColor: "rgba(255, 59, 92, 0.1)",
  },
  likedPulse: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 59, 92, 0.3)",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    shadowColor: "#6C8CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "rgba(108, 140, 255, 0.1)",
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});