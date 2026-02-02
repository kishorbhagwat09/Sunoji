import { usePlayer } from "@/app/context/PlayerContext";
import { playlistAPI } from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* 🔹 Song interface (songs table JOIN output) */
interface Song {
  id: number;
  title: string;
  artist: string;
  cover_url: string;
  song_url: string;
}

export default function PlaylistDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const player = usePlayer();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const res = await playlistAPI.getPlaylistSongs(Number(id));
      if (res?.status === "success") {
        setSongs(res.data || []);
      } else {
        setSongs([]);
      }
    } catch (err) {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ▶️ PLAY SONG */
const playSong = (song: Song) => {
  player.playSong(
    {
      ...song,
      url: song.song_url,
      cover: song.cover_url,
    },
    songs.map(s => ({
      ...s,
      url: s.song_url,
      cover: s.cover_url,
    }))
  );
};


  /* 🔹 Song Row */
  const renderSong = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.songRow}
      onPress={() => playSong(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.cover_url }}
        style={styles.cover}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>

      <MaterialIcons name="play-arrow" size={26} color="#1DB954" />
    </TouchableOpacity>
  );

  /* 🔄 LOADING */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ➕ ADD SONGS BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          router.push(`/profile/playlist/add-songs?id=${id}`)
        }
      >
        <Text style={styles.addText}>+ Add Songs</Text>
      </TouchableOpacity>

      {/* 🎵 SONG LIST */}
      {songs.length === 0 ? (
        <Text style={styles.empty}>No songs in this playlist</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSong}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  addBtn: {
    borderColor: "#1DB954",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  addText: {
    color: "#1DB954",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#222",
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  artist: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
});
