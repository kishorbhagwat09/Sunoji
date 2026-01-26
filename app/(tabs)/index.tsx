import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

export default function HomeScreen() {
  const [songs, setSongs] = useState<any[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    fetch("https://kishorbhagwat.in/Sunoji/api/songs.php")
      .then(res => res.json())
      .then(json => {
        if (json.status === "success") {
          setSongs(json.songs);
        }
      });
  }, []);

  const playSong = async (url: string) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recently Played</Text>

      <FlatList
        data={songs}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => playSong(item.url)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F1A", padding: 16 },
  heading: { color: "#fff", fontSize: 22, marginBottom: 20 },
  card: {
    backgroundColor: "#161A2D",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },
  title: { color: "#fff", fontSize: 16 },
  artist: { color: "#9CA3AF", fontSize: 13 }
});
