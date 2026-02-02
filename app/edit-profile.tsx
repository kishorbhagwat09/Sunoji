import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { userAPI } from "@/services/api";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// TODO: Install expo-image-picker if needed for image selection feature
// import * as ImagePicker from "expo-image-picker";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_photo: string;
  bio?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      if (response.status === "success") {
        const userData = response.data;
        setUser(userData);
        setName(userData.name);
        setBio(userData.bio || "");
        setProfilePhoto(userData.profile_photo);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    // TODO: Implement image picker when expo-image-picker is installed
    Alert.alert("Info", "Image picker feature coming soon. Install expo-image-picker to enable.");
    /*
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
    */
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    try {
      setSaving(true);
      const response = await userAPI.updateProfile({
        name,
        bio,
        profile_photo: profilePhoto,
      });

      if (response.status === "success") {
        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } else {
        Alert.alert("Error", response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSaveProfile} disabled={saving}>
          <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={handlePickImage}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.placeholderPhoto}>
                <AntDesign name="user" size={50} color="#999" />
              </View>
            )}
            <View style={styles.photoEditBadge}>
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>

        {/* Name Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            editable={!saving}
          />
        </View>

        {/* Bio Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#666"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            editable={!saving}
          />
          <Text style={styles.charCount}>
            {bio.length}/150
          </Text>
        </View>

        {/* Email Display (Read-only) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.input, styles.readOnlyInput]}>
            <Text style={styles.readOnlyText}>{user?.email}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  saveButton: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#222",
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  photoEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1DB954",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#0a0a0a",
  },
  photoHint: {
    fontSize: 12,
    color: "#888",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    textAlign: "right",
  },
  readOnlyInput: {
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
  },
  readOnlyText: {
    color: "#aaa",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.4)",
  },
  logoutButtonText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
  },
});
