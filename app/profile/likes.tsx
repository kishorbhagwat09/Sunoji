import { PlayerContext } from "@/app/context/PlayerContext";
import { likesAPI } from "@/services/api";
import { MaterialIcons, AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  RefreshControl,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface LikedSong {
  id: number;
  title: string;
  artist: string;
  cover_url: string;
  song_url: string;
  duration?: number;
  album?: string;
}

export default function LikesPage() {
  const [songs, setSongs] = useState<LikedSong[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const player = useContext(PlayerContext);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      setLoading(true);
      const res = await likesAPI.getUserLikes();
      if (res.status === "success") {
        setSongs(res.data);
      }
    } catch (error) {
      console.error("Error loading likes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLikes();
  };

  const playSong = (song: LikedSong) => {
    player.playSong(song, songs);
    setPlayingSongId(song.id);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const removeLike = async (songId: number) => {
    try {
      await likesAPI.unlikeSong(songId);
      setSongs(prev => prev.filter(song => song.id !== songId));
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#8B5CF6', '#6366F1']}
        style={styles.emptyIconContainer}
      >
        <AntDesign name="heart" size={60} color="#fff" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Liked Songs Yet</Text>
      <Text style={styles.emptySubtitle}>
        Songs you like will appear here
      </Text>
      <TouchableOpacity style={styles.discoverButton}>
        <Text style={styles.discoverButtonText}>Discover Music</Text>
        <Feather name="music" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderSongItem = ({ item, index }: { item: LikedSong; index: number }) => (
    <Animated.View style={styles.songContainer}>
      <TouchableOpacity
        style={[
          styles.songRow,
          playingSongId === item.id && styles.playingRow,
        ]}
        onPress={() => playSong(item)}
        activeOpacity={0.7}
      >
        {/* Index Number */}
        <View style={styles.indexContainer}>
          {playingSongId === item.id ? (
            <View style={styles.equalizerContainer}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.equalizerBar,
                    {
                      height: playingSongId === item.id 
                        ? Math.random() * 20 + 8 
                        : 8,
                      backgroundColor: playingSongId === item.id 
                        ? '#8B5CF6' 
                        : '#CBD5E1',
                    }
                  ]}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.indexText}>{String(index + 1).padStart(2, '0')}</Text>
          )}
        </View>

        {/* Album Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: item.cover_url }}
            style={styles.cover}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.coverOverlay}
          />
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text 
            style={[
              styles.title,
              playingSongId === item.id && styles.playingTitle
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View style={styles.artistContainer}>
            <Feather name="user" size={12} color="#94A3B8" />
            <Text style={styles.artist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
          {item.album && (
            <View style={styles.albumContainer}>
              <MaterialIcons name="album" size={12} color="#64748B" />
              <Text style={styles.album} numberOfLines={1}>
                {item.album}
              </Text>
            </View>
          )}
        </View>

        {/* Duration */}
        <Text style={styles.duration}>
          {formatDuration(item.duration)}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => removeLike(item.id)}
          >
            <AntDesign name="heart" size={20} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Progress Bar for currently playing song */}
      {playingSongId === item.id && (
        <LinearGradient
          colors={['#8B5CF6', '#6366F1']}
          style={styles.progressBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      )}
    </Animated.View>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={['#0F172A', '#1E293B']}
      style={styles.headerContainer}
    >
      <BlurView intensity={80} style={styles.headerBlur} tint="dark">
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.headerIcon}
            >
              <AntDesign name="heart" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Liked Songs</Text>
            <Text style={styles.headerSubtitle}>
              {songs.length} {songs.length === 1 ? 'song' : 'songs'} • Your personal collection
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.playAllButton}
            onPress={() => songs.length > 0 && playSong(songs[0])}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.playAllGradient}
            >
              <Feather name="play" size={20} color="#fff" />
              <Text style={styles.playAllText}>Play All</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </LinearGradient>
  );

  if (loading && songs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContent}>
          <View style={styles.loadingPulse}>
            <AntDesign name="heart" size={40} color="#8B5CF6" />
          </View>
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={StyleSheet.absoluteFill}
      />
      
      {songs.length > 0 ? (
        <>
          {renderHeader()}
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSongItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#8B5CF6"
                colors={['#8B5CF6']}
              />
            }
            ListFooterComponent={<View style={styles.footer} />}
          />
          
          {/* Mini Player Bar */}
          {playingSongId && (
            <BlurView intensity={90} style={styles.miniPlayer} tint="dark">
              <Image
                source={{ uri: songs.find(s => s.id === playingSongId)?.cover_url }}
                style={styles.miniPlayerCover}
              />
              <View style={styles.miniPlayerInfo}>
                <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                  {songs.find(s => s.id === playingSongId)?.title}
                </Text>
                <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                  {songs.find(s => s.id === playingSongId)?.artist}
                </Text>
              </View>
              <TouchableOpacity style={styles.miniPlayerButton}>
                <Feather name="pause" size={24} color="#fff" />
              </TouchableOpacity>
            </BlurView>
          )}
        </>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 20,
  },
  loadingPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContainer: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  headerBlur: {
    padding: 24,
    paddingTop: 48,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconContainer: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'System',
  },
  playAllButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  playAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  playAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  songContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
  },
  playingRow: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  indexContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 20,
  },
  equalizerBar: {
    width: 3,
    borderRadius: 1.5,
  },
  coverContainer: {
    position: 'relative',
    marginRight: 12,
  },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  playingTitle: {
    color: '#8B5CF6',
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  artist: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: 'System',
  },
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  album: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'System',
  },
  duration: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'System',
    marginRight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 3,
    width: '40%',
    alignSelf: 'center',
    borderBottomLeftRadius: 1.5,
    borderBottomRightRadius: 1.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
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
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'System',
  },
  footer: {
    height: 100,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  miniPlayerCover: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
  },
  miniPlayerTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  miniPlayerArtist: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'System',
  },
  miniPlayerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
});