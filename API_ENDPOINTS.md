# Sunoji API Endpoints Documentation

This file contains all the API endpoints required for the Sunoji music app to function properly.

## Base URL
```
https://kishorbhagwat.in/Sunoji/api
```

## Authentication
All endpoints (except login/register) require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## User Endpoints

### GET /users/profile.php
**Description:** Get current authenticated user's profile

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_photo": "https://example.com/photo.jpg",
    "bio": "Music lover"
  }
}
```

### POST /users/profile.php
**Description:** Update current user's profile

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "bio": "Updated bio",
  "profile_photo": "https://example.com/new-photo.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

### GET /users/get.php?id={userId}
**Description:** Get a specific user's profile by ID

**Query Parameters:**
- `id` (required): User ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "profile_photo": "https://example.com/jane.jpg"
  }
}
```

---

## Likes Endpoints

### GET /likes/get.php
**Description:** Get current user's liked songs

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Song Name",
      "artist_id": 5,
      "artist_name": "Artist Name",
      "url": "https://example.com/song.mp3",
      "cover_photo": "https://example.com/cover.jpg",
      "duration": 240
    }
  ]
}
```

### GET /likes/get.php?user_id={userId}
**Description:** Get a specific user's liked songs

**Query Parameters:**
- `user_id` (required): User ID

### GET /likes/check.php?song_id={songId}
**Description:** Check if current user liked a song

**Query Parameters:**
- `song_id` (required): Song ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "is_liked": true
  }
}
```

### POST /likes/add.php
**Description:** Add a song to user's likes

**Body:**
```json
{
  "song_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Song added to likes"
}
```

### POST /likes/remove.php
**Description:** Remove a song from user's likes

**Body:**
```json
{
  "song_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Song removed from likes"
}
```

---

## Playlist Endpoints

### GET /playlists/get.php
**Description:** Get current user's playlists

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Favorites",
      "description": "My favorite songs",
      "song_count": 15,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### GET /playlists/get.php?user_id={userId}
**Description:** Get a specific user's playlists

**Query Parameters:**
- `user_id` (required): User ID

### GET /playlists/songs.php?playlist_id={playlistId}
**Description:** Get all songs in a playlist

**Query Parameters:**
- `playlist_id` (required): Playlist ID

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Song Name",
      "artist_name": "Artist Name",
      "url": "https://example.com/song.mp3",
      "cover_photo": "https://example.com/cover.jpg",
      "duration": 240
    }
  ]
}
```

### POST /playlists/create.php
**Description:** Create a new playlist

**Body:**
```json
{
  "name": "My Playlist",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "My Playlist",
    "description": "Optional description"
  }
}
```

### POST /playlists/update.php
**Description:** Update a playlist

**Body:**
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Playlist updated successfully"
}
```

### POST /playlists/add-song.php
**Description:** Add a song to a playlist

**Body:**
```json
{
  "playlist_id": 1,
  "song_id": 5
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Song added to playlist"
}
```

### POST /playlists/remove-song.php
**Description:** Remove a song from a playlist

**Body:**
```json
{
  "playlist_id": 1,
  "song_id": 5
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Song removed from playlist"
}
```

### POST /playlists/delete.php
**Description:** Delete a playlist

**Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Playlist deleted successfully"
}
```

---

## Artists Endpoints

### GET /artists/top.php?limit={limit}
**Description:** Get top artists (default limit: 10)

**Query Parameters:**
- `limit` (optional): Number of artists to return (default: 10)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Artist Name",
      "photo": "https://example.com/artist.jpg",
      "bio": "Artist biography"
    }
  ]
}
```

### GET /artists/get.php?id={artistId}
**Description:** Get a specific artist by ID

**Query Parameters:**
- `id` (required): Artist ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Artist Name",
    "photo": "https://example.com/artist.jpg",
    "bio": "Artist biography"
  }
}
```

### GET /artists/songs.php?id={artistId}
**Description:** Get all songs by an artist

**Query Parameters:**
- `id` (required): Artist ID

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Song Name",
      "url": "https://example.com/song.mp3",
      "cover_photo": "https://example.com/cover.jpg",
      "duration": 240
    }
  ]
}
```

---

## Songs Endpoints

### GET /songs/get.php
**Description:** Get all songs

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Song Name",
      "artist_id": 5,
      "artist_name": "Artist Name",
      "url": "https://example.com/song.mp3",
      "cover_photo": "https://example.com/cover.jpg",
      "duration": 240
    }
  ]
}
```

### GET /songs/get.php?id={songId}
**Description:** Get a specific song by ID

**Query Parameters:**
- `id` (required): Song ID

### GET /songs/search.php?q={query}
**Description:** Search songs by name or artist

**Query Parameters:**
- `q` (required): Search query

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Song Name",
      "artist_name": "Artist Name",
      "url": "https://example.com/song.mp3",
      "cover_photo": "https://example.com/cover.jpg"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED`: Missing or invalid authentication token
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `INVALID_INPUT`: Invalid request body
- `DATABASE_ERROR`: Server-side database error

---

## Implementation Notes

1. **Unique Playlist Names**: Playlist names should be unique per user (composite unique key: user_id + name)
2. **Token-based Auth**: Use JWT tokens for authentication
3. **CORS**: Enable CORS headers for mobile app access
4. **Error Handling**: Return appropriate HTTP status codes
5. **Pagination**: Consider adding pagination for large result sets (songs, playlists)
6. **Timestamps**: Return all timestamps in ISO 8601 format
