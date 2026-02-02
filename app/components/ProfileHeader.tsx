import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { userAPI } from "@/services/api";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_photo: string;
  bio?: string;
}

export default function ProfileHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      if (response.status === "success") {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.headerContainer}>
      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        {user.profile_photo ? (
          <Image
            source={{ uri: user.profile_photo }}
            style={styles.profilePhoto}
          />
        ) : (
          <View style={styles.placeholderPhoto}>
            <AntDesign name="user" size={50} color="#999" />
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
        <Ionicons name="pencil" size={18} color="#fff" />
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  photoContainer: {
    marginBottom: 15,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#111",
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userBio: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(29, 185, 84, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(29, 185, 84, 0.5)",
  },
  editButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
