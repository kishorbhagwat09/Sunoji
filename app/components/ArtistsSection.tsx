import { artistsAPI } from "@/services/api";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

interface Artist {
  id: string | number;
  name: string;
  photo?: string;
}

export default function ArtistsSection() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);

      const response = await artistsAPI.getTopArtists(10);

      console.log("🎤 ARTISTS RESPONSE:", response);

      if (response && response.status === "success") {
        setArtists(response.artists || []);
      } else {
        setArtists([]);
      }
    } catch (err) {
      console.error("❌ Error loading artists:", err);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1DB954" />
      </View>
    );
  }

  if (artists.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No artists found</Text>
      </View>
    );
  }

  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() =>
        router.push({
          pathname: "/artist/[id]",
          params: { id: item.id },
        })
      }
    >
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.artistPhoto} />
      ) : (
        <View style={styles.placeholderPhoto}>
          <AntDesign name="user" size={22} color="#999" />
        </View>
      )}

      <Text style={styles.artistName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Artists</Text>

      <FlatList
        data={artists}
        renderItem={renderArtist}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },

  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  artistItem: {
    width: "19%",
    alignItems: "center",
  },

  artistPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#222",
    marginBottom: 6,
  },

  placeholderPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  artistName: {
    fontSize: 11,
    color: "#ccc",
    textAlign: "center",
  },
});
