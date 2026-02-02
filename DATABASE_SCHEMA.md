# Sunoji Database Schema

## Tables Required

### 1. users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_photo VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. songs
```sql
CREATE TABLE songs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  duration INT,
  cover_photo VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);
```

### 3. artists
```sql
CREATE TABLE artists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  photo VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. likes
```sql
CREATE TABLE likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  song_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (user_id, song_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);
```

### 5. playlists
```sql
CREATE TABLE playlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_photo VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_playlist_name (user_id, name)
);
```

### 6. playlist_songs
```sql
CREATE TABLE playlist_songs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  playlist_id INT NOT NULL,
  song_id INT NOT NULL,
  position INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_playlist_song (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);
```

## API Endpoints Required

### Users
- `GET users/profile.php` - Get current user profile
- `POST users/profile.php` - Update user profile
- `GET users/get.php?id={userId}` - Get user by ID

### Likes
- `GET likes/get.php` - Get current user's liked songs
- `GET likes/get.php?user_id={userId}` - Get user's liked songs
- `POST likes/add.php` - Add song to likes (body: {song_id})
- `POST likes/remove.php` - Remove song from likes (body: {song_id})
- `GET likes/check.php?song_id={songId}` - Check if song is liked

### Playlists
- `GET playlists/get.php` - Get current user's playlists
- `GET playlists/get.php?user_id={userId}` - Get user's playlists
- `GET playlists/songs.php?playlist_id={playlistId}` - Get songs in playlist
- `POST playlists/create.php` - Create playlist (body: {name, description})
- `POST playlists/update.php` - Update playlist (body: {id, name, description})
- `POST playlists/add-song.php` - Add song to playlist (body: {playlist_id, song_id})
- `POST playlists/remove-song.php` - Remove song from playlist (body: {playlist_id, song_id})
- `POST playlists/delete.php` - Delete playlist (body: {id})

### Artists
- `GET artists/top.php?limit={limit}` - Get top artists
- `GET artists/get.php?id={artistId}` - Get artist by ID
- `GET artists/songs.php?id={artistId}` - Get artist's songs

### Songs
- `GET songs/get.php` - Get all songs
- `GET songs/get.php?id={songId}` - Get song by ID
- `GET songs/search.php?q={query}` - Search songs
