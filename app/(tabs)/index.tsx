import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import ArtistsRow from "../components/ArtistsRow";

interface User {
  name: string;
  photo?: string;
}

export default function HomeScreen() {
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]); // ✅ artists state
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // 👤 USER
    fetch("https://kishorbhagwat.in/Sunoji/api/user/profile.php")
      .then((r) => r.json())
      .then((j) => j.status === "success" && setUser(j.data))
      .finally(() => setLoadingUser(false));

    // 🎵 SONGS
    fetch("https://kishorbhagwat.in/Sunoji/api/songs.php?limit=6")
      .then((r) => r.json())
      .then((j) => j.status === "success" && setSongs(j.songs));

    // 🎤 ARTISTS (same API as ArtistsRow)
    fetch("https://kishorbhagwat.in/Sunoji/artists.php")
      .then((r) => r.json())
      .then((j) => j.status === "success" && setArtists(j.artists));
  }, []);

  const openPlayer = (song: any) => {
    router.push({
      pathname: "/player",
      params: { song: JSON.stringify(song) },
    });
  };

  /* 🔍 TOP SEARCH FILTER */
  const filteredSongs =
    search.trim() === ""
      ? songs
      : songs.filter(
          (s) =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.artist?.toLowerCase().includes(search.toLowerCase())
        );

  const filteredArtists =
    search.trim() === ""
      ? artists
      : artists.filter((a) =>
          a.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 👤 USER ROW */}
      <View style={styles.userRow}>
        {loadingUser ? (
          <ActivityIndicator color="#1DB954" />
        ) : (
          <>
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.userImage} />
            ) : (
              <View style={styles.userPlaceholder} />
            )}
            <Text style={styles.userName}>
              {user ? `Hi, ${user.name}` : "Welcome"}
            </Text>
          </>
        )}
      </View>

      {/* 🔍 TOP SEARCH (ONLY ONE) */}
      <TextInput
        placeholder="Search songs or artists"
        placeholderTextColor="#9CA3AF"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* 🎵 SONGS */}
      <Text style={styles.heading}>Trending Songs</Text>

      <FlatList
        data={filteredSongs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songCard}
            onPress={() => openPlayer(item)}
          >
            <Image source={{ uri: item.cover }} style={styles.songCover} />
            <Text style={styles.songTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 🎤 ARTISTS */}
      <Text style={[styles.heading, { marginTop: 30 }]}>
        Popular Artists
      </Text>

      {/* ✅ filteredArtists pass केले */}
      <ArtistsRow artists={filteredArtists} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    paddingTop: 46,
  },

  /* USER ROW */
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#222",
  },
  userPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#222",
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  /* SEARCH */
  search: {
    backgroundColor: "#161A2D",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 20,
  },

  /* HEADINGS */
  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 12,
  },

  /* SONGS */
  songCard: {
    width: 150,
    marginLeft: 16,
  },
  songCover: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#222",
  },
  songTitle: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
  },
});
