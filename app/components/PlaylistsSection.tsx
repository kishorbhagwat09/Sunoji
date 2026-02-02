import { playlistAPI } from "@/services/api";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Playlist {
  id: number;
  name: string;
  song_count?: number;
}

export default function PlaylistsSection() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 reload every time profile screen opens
  useFocusEffect(
    useCallback(() => {
      loadPlaylists();
    }, [])
  );

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading playlists...");

      const response = await playlistAPI.getUserPlaylists();
      console.log("📦 PLAYLIST API RESPONSE =>", response);

      if (response?.status === "success" && Array.isArray(response.data)) {
        setPlaylists(response.data);
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      console.error("❌ Error loading playlists:", error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const renderPlaylistItem = (item: Playlist) => (
    <TouchableOpacity
      key={item.id.toString()}
      style={styles.playlistItem}
      onPress={() =>
        router.push({
          pathname: "/profile/playlist/[id]",
          params: { id: item.id, name: item.name },
        })
      }
    >
      <MaterialIcons name="playlist-play" size={28} color="#1DB954" />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistCount}>
          {item.song_count ?? 0} songs
        </Text>
      </View>

      <MaterialIcons name="chevron-right" size={22} color="#666" />
    </TouchableOpacity>
  );

  // 🔄 loading state
  if (loading && playlists.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Playlists</Text>
        <TouchableOpacity
          onPress={() => router.push("/profile/playlist/create-playlist")}
        >
          <AntDesign name="plus" size={22} color="#1DB954" />
        </TouchableOpacity>
      </View>

    

      {/* EMPTY STATE */}
      {playlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="playlist-play" size={48} color="#444" />
          <Text style={styles.emptyText}>No playlists yet</Text>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() =>
              router.push("/profile/playlist/create-playlist")
            }
          >
            <Text style={styles.createText}>Create Playlist</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // ✅ MAP instead of FlatList (NO render bug)
        playlists.map((item) => renderPlaylistItem(item))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  playlistName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  playlistCount: {
    color: "#777",
    fontSize: 12,
  },

  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyText: {
    color: "#666",
    marginVertical: 15,
  },

  createBtn: {
    borderColor: "#1DB954",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  createText: {
    color: "#1DB954",
    fontWeight: "600",
  },
});
