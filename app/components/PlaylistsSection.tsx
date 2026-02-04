import { playlistAPI } from "@/services/api";
import { AntDesign, MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  FlatList,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Playlist {
  id: number;
  name: string;
  song_count?: number;
  is_public?: boolean;
  created_at?: string;
  color?: string;
}

export default function PlaylistsSection() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const generateGradient = (index: number) => {
    const gradients = [
      ['#8B5CF6', '#6366F1'], // Purple to Indigo
      ['#10B981', '#34D399'], // Emerald to Green
      ['#F59E0B', '#FBBF24'], // Amber to Yellow
      ['#EF4444', '#F87171'], // Red to Coral
      ['#3B82F6', '#60A5FA'], // Blue to Light Blue
      ['#EC4899', '#F472B6'], // Pink to Light Pink
      ['#06B6D4', '#22D3EE'], // Cyan to Light Cyan
    ];
    return gradients[index % gradients.length];
  };

  // 🔥 reload every time profile screen opens
  useFocusEffect(
    useCallback(() => {
      loadPlaylists();
    }, [])
  );

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading playlists...");

      const response = await playlistAPI.getUserPlaylists();
      console.log("📦 PLAYLIST API RESPONSE =>", response);

      if (response?.status === "success" && Array.isArray(response.data)) {
        const enhancedPlaylists = response.data.map((playlist, index) => ({
          ...playlist,
          color: playlist.color || generateGradient(index)[0],
        }));
        setPlaylists(enhancedPlaylists);
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      console.error("❌ Error loading playlists:", error);
      setPlaylists([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPlaylists();
  };

  const renderPlaylistItem = ({ item, index }: { item: Playlist; index: number }) => (
    <TouchableOpacity
      key={item.id.toString()}
      style={styles.playlistCard}
      onPress={() =>
        router.push({
          pathname: "/profile/playlist/[id]",
          params: { 
            id: item.id, 
            name: item.name,
            color: item.color
          },
        })
      }
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={generateGradient(index)}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.playlistContent}>
          {/* Icon and Privacy Badge */}
          <View style={styles.playlistHeader}>
            <View style={styles.playlistIconContainer}>
              <MaterialIcons name="playlist-play" size={28} color="#fff" />
            </View>
            {item.is_public && (
              <View style={styles.publicBadge}>
                <Feather name="globe" size={10} color="#fff" />
                <Text style={styles.publicText}>Public</Text>
              </View>
            )}
          </View>

          {/* Playlist Info */}
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.playlistCount}>
              {item.song_count ?? 0} {item.song_count === 1 ? 'song' : 'songs'}
            </Text>
          </View>

          {/* Action Button */}
          <View style={styles.playlistActions}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={(e) => {
                e.stopPropagation();
                // Handle play playlist
              }}
            >
              <Ionicons name="play" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Decorative Pattern */}
        <View style={styles.decorativePattern}>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.patternLine} />
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.1)', 'rgba(99, 102, 241, 0.1)']}
        style={styles.emptyGradient}
      >
        <View style={styles.emptyIconContainer}>
          <MaterialIcons name="playlist-play" size={60} color="#8B5CF6" />
        </View>
        <Text style={styles.emptyTitle}>No Playlists Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first playlist to organize your favorite songs
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/profile/playlist/create-playlist")}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            style={styles.createButtonGradient}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Playlist</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.sectionHeader}>
      <View style={styles.headerTitleContainer}>
        <LinearGradient
          colors={['#8B5CF6', '#6366F1']}
          style={styles.headerIcon}
        >
          <MaterialIcons name="playlist-play" size={20} color="#fff" />
        </LinearGradient>
        <Text style={styles.sectionTitle}>Your Playlists</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/profile/playlist/create-playlist")}
      >
        <LinearGradient
          colors={['#8B5CF6', '#6366F1']}
          style={styles.addButtonGradient}
        >
          <AntDesign name="plus" size={18} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // 🔄 loading state
  if (loading && playlists.length === 0) {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <View style={styles.loadingAnimation}>
            {[...Array(3)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.loadingBar,
                  {
                    height: 40,
                    backgroundColor: ['#8B5CF6', '#6366F1', '#10B981'][i],
                  }
                ]}
              />
            ))}
          </View>
          <Text style={styles.loadingText}>Loading playlists...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      {playlists.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={<View style={styles.footer} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistCard: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    height: 180,
  },
  gradientBackground: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  playlistContent: {
    flex: 1,
    zIndex: 2,
  },
  playlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playlistIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    backdropFilter: 'blur(10px)',
  },
  publicText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'System',
  },
  playlistInfo: {
    marginTop: 'auto',
    marginBottom: 16,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playlistCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
  },
  playlistActions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  decorativePattern: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '60%',
    height: '60%',
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
  },
  patternLine: {
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  listContainer: {
    paddingBottom: 100,
  },
  footer: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 20,
  },
  loadingAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 60,
  },
  loadingBar: {
    width: 12,
    borderRadius: 6,
  },
  loadingText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  emptyGradient: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    fontFamily: 'System',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'System',
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});