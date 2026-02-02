import { playlistAPI } from "@/services/api";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "https://kishorbhagwat.in/Sunoji";

export default function AddSongs() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playlistId = Number(id);

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSongs("");
  }, []);

  const loadSongs = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/songs/get.php?q=${encodeURIComponent(q)}`
      );
      const json = await res.json();
      if (json.status === "success") setSongs(json.data);
    } catch {
      Alert.alert("Error", "Failed to load songs");
    }
    setLoading(false);
  };

  const addSong = async (songId: number) => {
    const res = await playlistAPI.addSongToPlaylist(playlistId, songId);
    if (res.status === "success") {
      Alert.alert("Added", "Song added to playlist");
    } else {
      Alert.alert("Info", res.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        placeholder="Search by song or artist"
        placeholderTextColor="#777"
        style={styles.search}
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          loadSongs(t);
        }}
      />

      {loading ? (
        <ActivityIndicator color="#1DB954" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.songRow}>
              <Image
                source={{ uri: item.cover_url }}
                style={styles.cover}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </View>
              <TouchableOpacity onPress={() => addSong(item.id)}>
                <AntDesign name="pluscircleo" size={22} color="#1DB954" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", padding: 15 },
  search: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  cover: { width: 45, height: 45, borderRadius: 6, marginRight: 10 },
  title: { color: "#fff", fontSize: 14 },
  artist: { color: "#888", fontSize: 12 },
});
