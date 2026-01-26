import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { usePlayer } from "../_context/PlayerContext";

type Song = {
  title: string;
  artist: string;
  url: string;
  cover: string;
};

export default function ExploreScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    fetch("https://kishorbhagwat.in/Sunoji/api/songs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setSongs(data.songs);
        }
      })
      .catch((err) => console.log("Fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#aaa" }}>Loading songs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Playlist 🎧</Text>

      <FlatList
        data={songs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => playSong(item, songs)} // 🔥 VERY IMPORTANT
          >
            <Image source={{ uri: item.cover }} style={styles.cover} />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>

            <Text style={styles.play}>▶</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    padding: 16,
  },
  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141A2E",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cover: {
    width: 55,
    height: 55,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  artist: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 2,
  },
  play: {
    color: "#6C8CFF",
    fontSize: 22,
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0F1A",
  },
});
