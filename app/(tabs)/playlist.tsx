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
      <FlatList
        data={songs}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => playSong(item, songs)} // ✅ FIX
          >
            <Image source={{ uri: item.cover }} style={styles.cover} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 19,
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
    color: "#aaa",
    fontSize: 13,
  },
   center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0F1A",
  },
});
