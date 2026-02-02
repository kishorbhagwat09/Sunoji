const BASE_URL = "https://kishorbhagwat.in/Sunoji";

/* ===================== USER ===================== */
export const userAPI = {
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/api/user/profile.php`);
    return res.json();
  },
};

/* ===================== LIKES ===================== */
export const likesAPI = {
  addLike: async (songId: number) => {
    const res = await fetch(`${BASE_URL}/api/likes/add.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId }),
    });
    return res.json();
  },

  removeLike: async (songId: number) => {
    const res = await fetch(`${BASE_URL}/api/likes/remove.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId }),
    });
    return res.json();
  },

  getUserLikes: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/likes/get.php`);
      return await res.json();
    } catch {
      return { status: "error", data: [] };
    }
  },

  checkLike: async (songId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/likes/check.php?song_id=${songId}`
      );
      return await res.json();
    } catch {
      return { status: "error", liked: false };
    }
  },
};

/* ===================== PLAYLISTS ===================== */
export const playlistAPI = {
  // 🔹 Get all playlists of user
  getUserPlaylists: async () => {
    const res = await fetch(`${BASE_URL}/api/playlists/get.php`);
    return res.json();
  },

  // 🔹 Create playlist
  createPlaylist: async (name: string) => {
    const res = await fetch(`${BASE_URL}/api/playlists/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },

  // 🔹 Playlist details
  getPlaylistDetails: async (playlistId: number) => {
    const res = await fetch(
      `${BASE_URL}/api/playlists/details.php?playlist_id=${playlistId}`
    );
    return res.json();
  },

  // 🔹 Add song to playlist
  addSongToPlaylist: async (playlistId: number, songId: number) => {
    const res = await fetch(`${BASE_URL}/api/playlists/add-song.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlist_id: playlistId,
        song_id: songId,
      }),
    });
    return res.json();
  },

  // 🔹 Get songs of playlist
  getPlaylistSongs: async (playlistId: number) => {
    const res = await fetch(
      `${BASE_URL}/api/playlists/songs.php?playlist_id=${playlistId}`
    );
    return res.json();
  },
};

//* ===================== ARTISTS ===================== */
export const artistsAPI = {
  getTopArtists: async (limit = 10) => {
    const res = await fetch(
      `${BASE_URL}/artists.php?limit=${limit}`
    );

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      console.log("❌ ARTISTS API NOT JSON");
      console.log(text);
      return { status: "error", artists: [] };
    }
  },
};
