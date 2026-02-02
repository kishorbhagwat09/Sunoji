import { PlayerContext } from "@/app/context/PlayerContext";
import { likesAPI } from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LikedSong {
  id: number;
  title: string;
  artist: string;
  cover_url: string;
  song_url: string;
}

export default function LikesPage() {
  const [songs, setSongs] = useState<LikedSong[]>([]);
  const player = useContext(PlayerContext);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    const res = await likesAPI.getUserLikes();
    if (res.status === "success") {
      setSongs(res.data);
    }
  };

  const playSong = (song: LikedSong) => {
    player.playSong(song, songs); // 🔥 liked songs as playlist
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liked Songs</Text>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => playSong(item)}
          >
            <Image
              source={{ uri: item.cover_url }}
              style={styles.cover}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>

            <MaterialIcons
              name="play-arrow"
              size={26}
              color="#1DB954"
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No liked songs</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 15,
  },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  cover: {
    width: 55,
    height: 55,
    borderRadius: 6,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  artist: {
    color: "#888",
    fontSize: 12,
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
});
