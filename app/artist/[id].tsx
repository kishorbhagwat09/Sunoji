import { PlayerContext } from "@/app/context/PlayerContext";
import { artistsAPI } from "@/services/api";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Artist {
  id: number;
  name: string;
  photo?: string;
  bio?: string;
}

interface ArtistSong {
  id: number;
  name: string;
  url: string;
  cover_photo?: string;
  duration?: number;
}

export default function ArtistDetailPage() {
  const router = useRouter();
  const playerContext = useContext(PlayerContext);
  const params = useLocalSearchParams();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<ArtistSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistData();
  }, [artistId]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      const [artistResponse, songsResponse] = await Promise.all([
        artistsAPI.getArtistById(artistId),
        artistsAPI.getArtistSongs(artistId),
      ]);

      if (artistResponse.status === "success") {
        setArtist(artistResponse.data);
      }

      if (songsResponse.status === "success") {
        setSongs(songsResponse.data || []);
      }
    } catch (error) {
      console.error("Error loading artist data:", error);
      Alert.alert("Error", "Failed to load artist");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song: ArtistSong) => {
    if (playerContext?.playSong) {
      playerContext.playSong(song, songs);
    }
  };

  const renderSongItem = ({ item }: { item: ArtistSong }) => (
    <View style={styles.songItem}>
      <TouchableOpacity
        style={styles.songContent}
        onPress={() => handlePlaySong(item)}
      >
        <View style={styles.albumArtContainer}>
          {item.cover_photo ? (
            <Image
              source={{ uri: item.cover_photo }}
              style={styles.albumArt}
            />
          ) : (
            <View style={styles.placeholderArt}>
              <MaterialIcons name="music-note" size={24} color="#666" />
            </View>
          )}
          <View style={styles.playOverlay}>
            <MaterialIcons name="play-arrow" size={24} color="#fff" />
          </View>
        </View>
        <View style={styles.songInfo}>
          <Text style={styles.songName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.duration && (
            <Text style={styles.duration}>
              {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Artist</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Artist</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Artist not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {artist.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {songs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="music-note" size={48} color="#444" />
          <Text style={styles.emptyText}>No songs available</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.artistHeader}>
              {artist.photo ? (
                <Image
                  source={{ uri: artist.photo }}
                  style={styles.artistPhoto}
                />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <AntDesign name="user" size={60} color="#999" />
                </View>
              )}
              <Text style={styles.artistName}>{artist.name}</Text>
              {artist.bio && <Text style={styles.artistBio}>{artist.bio}</Text>}
              <Text style={styles.songCount}>
                {songs.length} {songs.length === 1 ? "Song" : "Songs"}
              </Text>
            </View>
          }
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.songsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  artistHeader: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  artistPhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
    backgroundColor: "#222",
  },
  placeholderPhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  artistName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  artistBio: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 12,
  },
  songCount: {
    fontSize: 12,
    color: "#666",
  },
  songsList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  songContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  albumArtContainer: {
    position: "relative",
    marginRight: 12,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#222",
  },
  placeholderArt: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
});
