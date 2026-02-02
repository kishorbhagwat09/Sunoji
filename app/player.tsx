import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { usePlayer } from "./context/PlayerContext";

const { width, height } = Dimensions.get("window");

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
    repeatMode,
    toggleRepeat,
    toggleLike,
    likedSongs,
    isShuffled,
    toggleShuffle,
  } = usePlayer();

  const [sliderValue, setSliderValue] = useState(position);
  const [isSliding, setIsSliding] = useState(false);
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotation.stopAnimation();
    }
  }, [isPlaying]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!currentSong) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="music-note" size={80} color="#64748B" />
        <Text style={styles.emptyText}>No song playing</Text>
        <Text style={styles.emptySubtext}>Select a song to start listening</Text>
      </View>
    );
  }

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    direction === 'next' ? playNext() : playPrev();
  };

  const handleLike = () => {
    toggleLike(currentSong.id);
  };

  const handleRepeat = () => {
    toggleRepeat();
  };

  const handleShuffle = () => {
    if (toggleShuffle) toggleShuffle();
  };

  const handleAddToPlaylist = async () => {
    Alert.prompt(
      'Add to Playlist',
      'Enter playlist name:',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Add',
          onPress: async (playlistName) => {
            if (!playlistName?.trim()) {
              Alert.alert('Error', 'Please enter playlist name');
              return;
            }
            try {
              Alert.alert('Success', `Added "${currentSong.title}" to "${playlistName}"`);
            } catch (error) {
              Alert.alert('Error', 'Failed to add song to playlist');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  const handleSlidingComplete = (value: number) => {
    setIsSliding(false);
    seekTo(value);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return "repeat-one";
      case 'all': return "repeat";
      default: return "repeat";
    }
  };

  const getRepeatColor = () => {
    switch (repeatMode) {
      case 'off': return "#94A3B8";
      case 'one': return "#6C8CFF";
      default: return "#6C8CFF";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Album Art */}
        <View style={styles.coverContainer}>
          <View style={styles.glowEffect} />
          <Animated.View
            style={[
              styles.coverWrapper,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <Image
              source={{ uri: currentSong.cover }}
              style={styles.cover}
              resizeMode="cover"
            />
          </Animated.View>
          <View style={styles.vinylRing} />
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
          {currentSong.album && (
            <Text style={styles.album} numberOfLines={1}>
              {currentSong.album}
            </Text>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={isSliding ? sliderValue : position}
            onValueChange={setSliderValue}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor="#6C8CFF"
            maximumTrackTintColor="#334155"
            thumbTintColor="#6C8CFF"
            thumbStyle={styles.sliderThumb}
          />
          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(isSliding ? sliderValue : position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Main Controls - Play/Pause, Next/Prev (UPAR WALI ROW) */}
        <View style={styles.mainControls}>
          {/* Shuffle Button */}
          <TouchableOpacity
            onPress={handleShuffle}
            style={[
              styles.shuffleButton,
              isShuffled && styles.activeShuffleButton
            ]}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="shuffle" 
              size={24} 
              color={isShuffled ? "#6C8CFF" : "#94A3B8"} 
            />
          </TouchableOpacity>

          {/* Previous Button */}
          <TouchableOpacity
            onPress={() => handleSkip('prev')}
            style={styles.prevButton}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.playButton}
            activeOpacity={0.9}
          >
            <View style={styles.playButtonInner}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={36}
                color="#FFFFFF"
                style={{ marginLeft: isPlaying ? 0 : 4 }}
              />
            </View>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => handleSkip('next')}
            style={styles.nextButton}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-forward" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Repeat Button */}
          <TouchableOpacity
            onPress={handleRepeat}
            style={[
              styles.repeatButton,
              repeatMode !== 'off' && styles.activeRepeatButton
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={getRepeatIcon()}
              size={24}
              color={getRepeatColor()}
            />
            {repeatMode === 'one' && (
              <View style={styles.repeatBadge}>
                <Text style={styles.repeatBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Extra Controls - Like, Add to Playlist, etc. (NICHE WALI ROW) */}
        <View style={styles.extraControls}>
          {/* Lyrics Button */}
          <TouchableOpacity style={styles.extraButton} activeOpacity={0.7}>
            <FontAwesome5 name="microphone-alt" size={22} color="#94A3B8" />
            <Text style={styles.extraButtonText}>Lyrics</Text>
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            onPress={handleLike}
            style={styles.extraButton}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="favorite"
              size={24}
              color={likedSongs.has(currentSong.id) ? "#FF4757" : "#94A3B8"}
            />
            <Text style={styles.extraButtonText}>
              {likedSongs.has(currentSong.id) ? "Liked" : "Like"}
            </Text>
          </TouchableOpacity>

          {/* Add to Playlist Button */}
          <TouchableOpacity
            onPress={handleAddToPlaylist}
            style={styles.extraButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="playlist-add" size={24} color="#94A3B8" />
            <Text style={styles.extraButtonText}>Add</Text>
          </TouchableOpacity>

          {/* More Options Button */}
          <TouchableOpacity style={styles.extraButton} activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#94A3B8" />
            <Text style={styles.extraButtonText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Queue Button */}
        <TouchableOpacity style={styles.queueButton} activeOpacity={0.7}>
          <MaterialIcons name="queue-music" size={20} color="#6C8CFF" />
          <Text style={styles.queueButtonText}>View Queue</Text>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: height * 0.05,
    paddingBottom: 40,
  },
  coverContainer: {
    position: "relative",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  coverWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    overflow: "hidden",
    zIndex: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  glowEffect: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(108, 140, 255, 0.15)",
  },
  vinylRing: {
    position: "absolute",
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    borderWidth: 10,
    borderColor: "rgba(255, 255, 255, 0.05)",
    zIndex: 1,
  },
  songInfo: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  artist: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  album: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "400",
  },
  progressContainer: {
    width: width * 0.9,
    marginBottom: 40,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#6C8CFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },
  // Main Controls Row (UPAR WALI)
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  shuffleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  activeShuffleButton: {
    backgroundColor: "rgba(108, 140, 255, 0.1)",
  },
  prevButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6C8CFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    shadowColor: "#6C8CFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#6C8CFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  repeatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    position: "relative",
  },
  activeRepeatButton: {
    backgroundColor: "rgba(108, 140, 255, 0.1)",
  },
  repeatBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#6C8CFF",
    borderRadius: 4,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Extra Controls Row (NICHE WALI)
  extraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.9,
    marginBottom: 30,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  extraButton: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    minWidth: 70,
  },
  extraButtonText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  // Queue Button
  queueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(108, 140, 255, 0.2)",
  },
  queueButtonText: {
    color: "#6C8CFF",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "400",
  },
});