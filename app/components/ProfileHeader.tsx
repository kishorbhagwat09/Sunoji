import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { userAPI } from "@/services/api";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.errorContainer}
      >
        <Feather name="alert-circle" size={60} color="#F87171" />
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadUserProfile}
        >
          <Feather name="refresh-cw" size={18} color="#fff" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#0F172A']}
      style={styles.headerContainer}
    >
      {/* Background decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      
      {/* Profile Photo with gradient border */}
      <View style={styles.photoContainer}>
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6', '#10B981']}
          style={styles.gradientBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.photoWrapper}>
            {user.profile_photo ? (
              <Image
                source={{ uri: user.profile_photo }}
                style={styles.profilePhoto}
              />
            ) : (
              <LinearGradient
                colors={['#475569', '#334155']}
                style={styles.placeholderPhoto}
              >
                <AntDesign name="user" size={50} color="#CBD5E1" />
              </LinearGradient>
            )}
          </View>
        </LinearGradient>
        
        {/* Online status indicator */}
        <View style={styles.onlineIndicator}>
          <LinearGradient
            colors={['#10B981', '#34D399']}
            style={styles.onlineDot}
          />
        </View>
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        {user.bio && (
          <View style={styles.bioContainer}>
            <Feather name="quote" size={16} color="#8B5CF6" style={styles.quoteIcon} />
            <Text style={styles.userBio}>{user.bio}</Text>
          </View>
        )}
        
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>356</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/edit-profile")}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => console.log('Share profile')}
        >
          <Feather name="share-2" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
  },
  loadingContent: {
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  errorContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    gap: 16,
  },
  errorText: {
    color: "#F87171",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'System',
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  retryButtonText: {
    color: "#FECACA",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: 'System',
  },
  headerContainer: {
    padding: 24,
    alignItems: "center",
    borderRadius: 24,
    margin: 16,
    marginTop: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    top: -50,
    left: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    bottom: -30,
    right: -30,
  },
  photoContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  gradientBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 68,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 68,
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 68,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#0F172A',
    padding: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F8FAFC",
    fontFamily: 'System',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: "#94A3B8",
    fontFamily: 'System',
    marginBottom: 8,
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    maxWidth: '90%',
  },
  quoteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  userBio: {
    fontSize: 14,
    color: "#CBD5E1",
    fontFamily: 'System',
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B5CF6",
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: 'System',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  editButton: {
    flex: 1,
    maxWidth: 200,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  shareButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
});