# Backend Implementation Checklist

Complete this checklist to get the profile section fully functional.

## Database Setup

### 1. Create Tables
- [ ] `users` table with columns: id, name, email, password, profile_photo, bio, created_at, updated_at
- [ ] `artists` table with columns: id, name, photo, bio, created_at
- [ ] `songs` table with columns: id, name, artist_id (FK), url, duration, cover_photo, created_at
- [ ] `likes` table with columns: id, user_id (FK), song_id (FK), created_at, UNIQUE(user_id, song_id)
- [ ] `playlists` table with columns: id, user_id (FK), name, description, cover_photo, created_at, updated_at, UNIQUE(user_id, name)
- [ ] `playlist_songs` table with columns: id, playlist_id (FK), song_id (FK), position, created_at, UNIQUE(playlist_id, song_id)

### 2. Create Indexes
- [ ] ON `likes` (user_id, created_at DESC)
- [ ] ON `playlists` (user_id, created_at DESC)
- [ ] ON `playlist_songs` (playlist_id, position)
- [ ] ON `songs` (artist_id)

## API Implementation

### Authentication
- [ ] Implement Bearer token validation
- [ ] Extract user_id from token in all protected endpoints
- [ ] Return 401 for missing/invalid tokens

### User Endpoints
- [ ] `GET /users/profile.php` - Return current user profile
- [ ] `POST /users/profile.php` - Update name, bio, profile_photo
- [ ] `GET /users/get.php?id={id}` - Return user profile (name, photo only)

### Likes Endpoints
- [ ] `GET /likes/get.php` - Return all songs liked by current user with artist names
- [ ] `GET /likes/get.php?user_id={id}` - Return songs liked by specific user
- [ ] `GET /likes/check.php?song_id={id}` - Return {is_liked: true/false}
- [ ] `POST /likes/add.php` - Add song to current user's likes (handle duplicates)
- [ ] `POST /likes/remove.php` - Remove song from current user's likes

### Playlist Endpoints
- [ ] `GET /playlists/get.php` - Return all playlists of current user with song count
- [ ] `GET /playlists/get.php?user_id={id}` - Return playlists of specific user
- [ ] `GET /playlists/songs.php?playlist_id={id}` - Return all songs in playlist with artist names
- [ ] `POST /playlists/create.php` - Create new playlist (validate unique name per user)
- [ ] `POST /playlists/update.php` - Update playlist name/description
- [ ] `POST /playlists/add-song.php` - Add song to playlist (prevent duplicates)
- [ ] `POST /playlists/remove-song.php` - Remove song from playlist
- [ ] `POST /playlists/delete.php` - Delete playlist

### Artist Endpoints
- [ ] `GET /artists/top.php?limit={limit}` - Return top artists by song/plays count
- [ ] `GET /artists/get.php?id={id}` - Return artist details
- [ ] `GET /artists/songs.php?id={id}` - Return all songs by artist

### Song Endpoints
- [ ] `GET /songs/get.php` - Return all songs (with pagination recommended)
- [ ] `GET /songs/get.php?id={id}` - Return specific song
- [ ] `GET /songs/search.php?q={query}` - Search songs by name or artist

## Response Format

All successful responses should follow:
```json
{
  "status": "success",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Validation Rules

### Playlist
- Name is required and max 255 characters
- Unique per user (cannot have duplicate names)
- Description is optional

### Likes
- One like per user per song
- Cannot like non-existent songs

### Songs
- Must have a valid artist_id
- URL is required

## Security Requirements

- [ ] All user data writes require authentication
- [ ] Users can only modify their own playlists/likes
- [ ] Validate all input data
- [ ] Use prepared statements to prevent SQL injection
- [ ] Rate limit API endpoints
- [ ] Log important actions

## Test API Endpoints

Once implemented, test with:

```bash
# Get profile
curl -H "Authorization: Bearer TOKEN" \
  https://kishorbhagwat.in/Sunoji/api/users/profile.php

# Get liked songs
curl -H "Authorization: Bearer TOKEN" \
  https://kishorbhagwat.in/Sunoji/api/likes/get.php

# Get user's playlists
curl -H "Authorization: Bearer TOKEN" \
  https://kishorbhagwat.in/Sunoji/api/playlists/get.php

# Get songs in playlist
curl -H "Authorization: Bearer TOKEN" \
  https://kishorbhagwat.in/Sunoji/api/playlists/songs.php?playlist_id=1

# Get top 10 artists
curl https://kishorbhagwat.in/Sunoji/api/artists/top.php?limit=10
```

## Sample Data

To test the app, you need:
- At least 5-10 artists with photos
- At least 20-30 songs with:
  - Valid artist associations
  - Working MP3 URLs
  - Cover photos
- Test user with:
  - Profile photo
  - Some liked songs
  - At least one playlist with songs

## Deployment Checklist

- [ ] All endpoints return correct HTTP status codes
- [ ] CORS headers configured for mobile app domain
- [ ] Database backups automated
- [ ] Error logging implemented
- [ ] Performance monitoring in place
- [ ] API documentation updated
- [ ] Staging environment tested
- [ ] Production database prepared

## Support Resources

- See `API_ENDPOINTS.md` for detailed endpoint specs
- See `DATABASE_SCHEMA.md` for SQL schemas
- See `PROFILE_IMPLEMENTATION.md` for frontend integration details
