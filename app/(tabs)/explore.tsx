import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayer } from "../context/PlayerContext";

const { width } = Dimensions.get('window');

type Song = {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration?: number;
  genre?: string;
};

export default function ExploreScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const { playSong, likedSongs, toggleLike } = usePlayer();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filters = [
    { key: "all", label: "All" },
    { key: "pop", label: "Pop" },
    { key: "hip hop", label: "Hip Hop" },
    { key: "rock", label: "Rock" },
    { key: "electronic", label: "Electronic" },
    { key: "liked", label: "Liked" },
  ];

  useEffect(() => {
    fetch("https://kishorbhagwat.in/Sunoji/api/songs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const songsWithId = data.songs.map((song: Song, index: number) => ({
            ...song,
            id: String(index + 1),
            duration: Math.floor(Math.random() * 300) + 120,
            genre: ["Pop", "Hip Hop", "Rock", "Electronic", "R&B", "Jazz"][Math.floor(Math.random() * 6)]
          }));
          setSongs(songsWithId);
          setFilteredSongs(songsWithId);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }
      })
      .catch((err) => console.log("Fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    
    if (text.trim() === "") {
      setFilteredSongs(songs);
      return;
    }

    const query = text.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.genre?.toLowerCase().includes(query)
    );

    setFilteredSongs(filtered);
  };

  const applyFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredSongs(songs);
    } else if (filter === "liked") {
      const liked = songs.filter(song => likedSongs.has(song.id));
      setFilteredSongs(liked);
    } else {
      const genreFiltered = songs.filter(song => 
        song.genre?.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredSongs(genreFiltered);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0B0F1A", "#1A1F3A"]}
        style={styles.loadingContainer}
      >
        <Animated.View style={styles.loadingContent}>
          <View style={styles.spinner} />
          <Text style={styles.loadingText}>Loading Songs...</Text>
          <Text style={styles.loadingSubtext}>Discover amazing music</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0B0F1A", "#1A1F3A", "#0B0F1A"]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Discover</Text>
          <Text style={styles.heading}>Explore Music</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <BlurView intensity={80} style={styles.searchBlur}>
          <Ionicons name="search" size={18} color="#6C8CFF" />
          <TextInput
            placeholder="Search songs, artists, or genres..."
            placeholderTextColor="#8B9CB6"
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={18} color="#8B9CB6" />
            </TouchableOpacity>
          )}
        </BlurView>
      </View>

      {/* Quick Filters - COMPACT FIXED */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                activeFilter === filter.key && styles.filterChipActive
              ]}
              onPress={() => applyFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.key && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Song Count */}
      <View style={styles.songCountContainer}>
        <Text style={styles.songCount}>
          {filteredSongs.length} {filteredSongs.length === 1 ? 'Song' : 'Songs'} Found
        </Text>
      </View>

      {/* Songs List */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes" size={50} color="#3A416F" />
              <Text style={styles.emptyTitle}>No songs found</Text>
              <Text style={styles.emptyText}>
                Try a different search or filter
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => {
                  setSearch("");
                  applyFilter("all");
                }}
              >
                <Text style={styles.emptyButtonText}>Show All Songs</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => {
            const isLiked = likedSongs.has(item.id);
            
            return (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0]
                    })
                  }]
                }}
              >
                <TouchableOpacity
                  style={styles.songCard}
                  onPress={() => playSong(item, filteredSongs)}
                  activeOpacity={0.9}
                >
                  {/* Album Art */}
                  <View style={styles.coverContainer}>
                    <Image 
                      source={{ uri: item.cover }} 
                      style={styles.cover}
                    />
                    <Text style={styles.songNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>

                  {/* Song Info - FIXED: Title visible now */}
                  <View style={styles.songInfo}>
                    <View style={styles.titleContainer}>
                      <Text 
                        style={styles.title} 
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>
                    </View>
                    
                    <View style={styles.artistContainer}>
                      <FontAwesome5 name="user-alt" size={10} color="#6C8CFF" />
                      <Text 
                        style={styles.artist} 
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.artist}
                      </Text>
                    </View>
                    
                    <View style={styles.bottomRow}>
                      <View style={styles.durationContainer}>
                        <Ionicons name="time-outline" size={10} color="#8B9CB6" />
                        <Text style={styles.durationText}>
                          {formatDuration(item.duration || 180)}
                        </Text>
                      </View>
                      <View style={styles.genreContainer}>
                        <Text style={styles.genreText}>{item.genre}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                    >
                      <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? "#FF3B5C" : "#8B9CB6"}
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        playSong(item, filteredSongs);
                      }}
                    >
                      <LinearGradient
                        colors={["#6C8CFF", "#4C6FFF"]}
                        style={styles.playButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="play" size={14} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#6C8CFF',
    borderTopColor: 'transparent',
    marginBottom: 16,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  loadingSubtext: {
    color: '#8B9CB6',
    fontSize: 13,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: {
    color: '#6C8CFF',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 140, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // FIXED: Compact Filters
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 34,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    height: 32,
    justifyContent: 'center',
    minWidth: 60,
  },
  filterChipActive: {
    backgroundColor: '#6C8CFF',
    borderColor: '#6C8CFF',
  },
  filterText: {
    color: '#8B9CB6',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  songCountContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  songCount: {
    color: '#8B9CB6',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  // FIXED: Song Card with proper title visibility
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    minHeight: 80,
    maxHeight: 80,
  },
  coverContainer: {
    position: 'relative',
    marginRight: 14,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  songNumber: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#6C8CFF',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    textAlign: 'center',
  },
  // FIXED: Song Info - Title visible
  songInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 8, // Added margin to prevent overlap
  },
  titleContainer: {
  marginBottom: 4,
  flex: 1,
},

title: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '700',
  flex: 1,
  minWidth: 0,
  marginTop: -7,
},

  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    gap: 5,
  },
  artist: {
    color: '#8B9CB6',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: '#8B9CB6',
    fontSize: 10,
    fontWeight: '500',
  },
  genreContainer: {
    backgroundColor: 'rgba(108, 140, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genreText: {
    color: '#6C8CFF',
    fontSize: 10,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    color: '#8B9CB6',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  emptyButton: {
    backgroundColor: '#6C8CFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});