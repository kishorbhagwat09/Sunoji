import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { likesAPI } from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";

interface LikesSection {
  count: number;
  loading: boolean;
}

export default function LikesSection() {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikesCount();
  }, []);

  const loadLikesCount = async () => {
    try {
      setLoading(true);
      const response = await likesAPI.getUserLikes();
      if (response.status === "success") {
        setLikeCount(response.data?.length || 0);
      }
    } catch (error) {
      console.error("Error loading likes:", error);
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

  return (
    <TouchableOpacity
      style={styles.likesBox}
      onPress={() => router.push("/profile/likes")}
    >
      <View style={styles.likesContent}>
        <MaterialIcons name="favorite" size={32} color="#ff6b6b" />
        <View style={styles.likesInfo}>
          <Text style={styles.likesLabel}>Liked Songs</Text>
          <Text style={styles.likesCount}>{likeCount} songs</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  likesBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },
  likesContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  likesInfo: {
    marginLeft: 15,
  },
  likesLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  likesCount: {
    fontSize: 13,
    color: "#999",
  },
});
