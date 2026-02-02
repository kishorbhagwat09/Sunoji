import { artistsAPI } from "@/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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

export default function ArtistsRow({ artists }: { artists: Artist[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        <Image source={{ uri: item.photo }} style={styles.artistImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      <Text style={styles.artistName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={artists}
      renderItem={renderArtist}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.artistList}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    paddingTop: 20,
  },

  /* 🔍 SEARCH (MINIMAL – DOES NOT BREAK DESIGN) */
  search: {
    backgroundColor: "#161A2D",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 20,
  },

  loader: {
    paddingVertical: 20,
    alignItems: "center",
  },

  artistList: {
    paddingHorizontal: 12,
  },

  artistItem: {
    alignItems: "center",
    marginRight: 58,
    width: 100,
  },

  artistImage: {
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: "#091029",
    marginBottom: 8,
  },

  placeholderImage: {
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: "#091029",
    marginBottom: 8,
  },

  artistName: {
    color: "#ccc",
    fontSize: 13,
    textAlign: "center",
  },
});
