import { usePlayer } from "@/app/context/PlayerContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Remix = {
  id: string | number;
  title: string;
  artist: string;
  cover: string;
  song_url: string;
};

export default function SunojiRemixSection() {
  const player = usePlayer();
  const [remixes, setRemixes] = useState<Remix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://kishorbhagwat.in/Sunoji/api/remix/get.php")
      .then((r) => r.json())
      .then((j) => {
        if (j.status === "success") {
          setRemixes(j.remix || []);
        }
      })
      .catch(() => setRemixes([]))
      .finally(() => setLoading(false));
  }, []);

  const playRemix = (remix: Remix) => {
    player.playSong(
      {
        id: remix.id,
        title: remix.title,
        artist: remix.artist,
        cover: remix.cover,
        url: remix.song_url, // 🔥 IMPORTANT
      },
      remixes.map((r) => ({
        id: r.id,
        title: r.title,
        artist: r.artist,
        cover: r.cover,
        url: r.song_url,
      }))
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Sunoji Remix 🔥</Text>
        <Text style={styles.subtitle}>Special curated mixes</Text>
      </View>

      {/* LOADING */}
      {loading && (
        <ActivityIndicator color="#1DB954" style={{ marginTop: 10 }} />
      )}

      {/* NO REMIX */}
      {!loading && remixes.length === 0 && (
        <Text style={{ color: "#888", marginTop: 10 }}>
          No remix songs available
        </Text>
      )}

      {/* REMIX CARDS */}
      {remixes.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => playRemix(item)}
          activeOpacity={0.85}
        >
          <Image source={{ uri: item.cover }} style={styles.cover} />

          <View style={{ flex: 1 }}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>

          <MaterialIcons
            name="play-circle-fill"
            size={34}
            color="#1DB954"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  header: {
    marginBottom: 12,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  cover: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#222",
  },

  songTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  artist: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 3,
  },
});
