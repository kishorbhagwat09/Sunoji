import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

export const PlayerContext = createContext<any>(null);

export function PlayerProvider({ children }: any) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const isChangingTrack = useRef(false);
  const songFinishedRef = useRef(false);

  const [currentSong, setCurrentSong] = useState<any>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off'); // off, one (ek baar), all
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

  const loadLikedSongsFromDB = async () => {
    try {
      const res = await fetch(
        "https://kishorbhagwat.in/Sunoji/api/likes/get.php"
      );
      const json = await res.json();

      if (json.status === "success") {
        const ids = new Set<string>(
          json.data.map((song: any) => song.id.toString())
        );
        setLikedSongs(ids);
      }
    } catch (e) {
      console.log("Failed to load liked songs", e);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    loadLikedSongsFromDB();
  }, []);

  const playlistRef = useRef<any[]>([]);
  const indexRef = useRef(-1);

  const playSong = async (song: any, list: any[]) => {
    if (!song?.url) return;

    isChangingTrack.current = true;

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const newIndex = list.findIndex((s) => s.url === song.url);
    playlistRef.current = list;
    indexRef.current = newIndex;

    const { sound } = await Audio.Sound.createAsync(
      { uri: song.url },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
    setCurrentSong(song);
    setPlaylist(list);
    setIndex(newIndex);
    setIsPlaying(true);
    songFinishedRef.current = false;

    isChangingTrack.current = false;
  };

  const onPlaybackStatusUpdate = async (status: any) => {
    if (!status.isLoaded) return;

    setPosition(status.positionMillis || 0);
    setDuration(status.durationMillis || 1);

    if (status.didJustFinish && !isChangingTrack.current && !songFinishedRef.current) {
      songFinishedRef.current = true;
      isChangingTrack.current = true;
      await playNext();
      isChangingTrack.current = false;
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const playNext = async () => {
    if (!playlistRef.current.length || indexRef.current === -1) return;

    const nextIndex =
      indexRef.current + 1 < playlistRef.current.length ? indexRef.current + 1 : 0;

    await playSong(playlistRef.current[nextIndex], playlistRef.current);
  };

  const playPrev = async () => {
    if (!playlistRef.current.length || indexRef.current === -1) return;

    const prevIndex =
      indexRef.current - 1 >= 0 ? indexRef.current - 1 : playlistRef.current.length - 1;

    await playSong(playlistRef.current[prevIndex], playlistRef.current);
  };

  const seekTo = async (value: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  // 💚 Like/Unlike functionality
  const toggleLike = async (songId: string) => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId);
      // Database se remove karo
      try {
        await fetch('https://kishorbhagwat.in/Sunoji/api/likes/remove.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ song_id: songId }),
        });
      } catch (error) {
        console.error('Error removing like:', error);
      }
    } else {
      newLikedSongs.add(songId);
      // Database me add karo
      try {
        await fetch('https://kishorbhagwat.in/Sunoji/api/likes/add.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ song_id: songId }),
        });
      } catch (error) {
        console.error('Error adding like:', error);
      }
    }
    setLikedSongs(newLikedSongs);
  };

  // 🔁 Repeat functionality
  const toggleRepeat = () => {
    const nextMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    setRepeatMode(nextMode);
  };

  // Song repeat logic
  useEffect(() => {
    if (repeatMode === 'one' && songFinishedRef.current) {
      // Ek hi song dobara chalaao
      if (soundRef.current && currentSong) {
        soundRef.current.setPositionAsync(0);
        soundRef.current.playAsync();
        songFinishedRef.current = false;
      }
    }
  }, [repeatMode, currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        playSong,
        togglePlayPause,
        playNext,
        playPrev,
        currentSong,
        isPlaying,
        position,
        duration,
        seekTo,
        repeatMode,
        toggleRepeat,
        toggleLike,
        likedSongs,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
