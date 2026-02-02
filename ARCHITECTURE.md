# Architecture & Flow Diagrams

## User Journey Flow

```
┌─────────────────────────────────────────────────────────┐
│                     PROFILE TAB                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    PROFILE HEADER COMPONENT           │
        │  ┌─────────────────────────────────┐  │
        │  │   Profile Photo (120x120)       │  │
        │  │   Name: John Doe                │  │
        │  │   Bio: Music Lover              │  │
        │  │   [✏️ Edit Button] ────────┐    │  │
        │  └─────────────────────────────────┘  │
        └───────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
        ┌──────────────┐ ┌──────────┐ (Leads to)
        │ EDIT PROFILE │ │LIKES SEC.│ LIKES PAGE
        │   PAGE       │ │          │    │
        └──────────────┘ └──────────┘    ▼
                            │    ┌──────────────────┐
                            │    │ Liked Songs List │
                            │    │ - Song 1         │
                            │    │ - Song 2         │
                            │    │ - Song 3         │
                            │    └──────────────────┘
                            ▼
                    ┌──────────────────┐
                    │PLAYLISTS SEC.    │
                    │ [+ Create]       │
                    ├──────────────────┤
                    │ Playlist 1       │──┐
                    │ Playlist 2       │  │
                    │ Playlist 3       │  │
                    └──────────────────┘  │
                                         ▼
                            ┌────────────────────────┐
                            │ PLAYLIST DETAIL PAGE   │
                            │ Playlist: Favorites    │
                            │ [+ Add Songs]          │
                            ├────────────────────────┤
                            │ - Song 1               │
                            │ - Song 2               │
                            │ - Song 3               │
                            │ [Search & Add More]    │
                            └────────────────────────┘
                            ▼
                    ┌──────────────────┐
                    │ARTISTS SECTION   │
                    │ (5-Column Grid)  │
                    ├──────────────────┤
                    │ Artist 1 ─┐      │
                    │ Artist 2  │      │
                    │ Artist 3  │      │
                    │ Artist 4  │      │
                    │ Artist 5  │      │
                    └───────┬──────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ ARTIST DETAIL    │
                    │ Artist Name      │
                    │ Artist Photo     │
                    │ Artist Bio       │
                    ├──────────────────┤
                    │ - Song 1         │
                    │ - Song 2         │
                    │ - Song 3         │
                    └──────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PROFILE PAGE                           │
│                   (tabs/profile.tsx)                        │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ┌──────────┐     ┌────────────┐    ┌──────────────┐
    │ Profile  │     │    Likes   │    │  Playlists  │
    │  Header  │     │  Section   │    │   Section   │
    └──────────┘     └────────────┘    └──────────────┘
        │                   │                   │
        │ imports           │ imports           │ imports
        ▼                   ▼                   ▼
    ┌──────────────────────────────────────────────────────┐
    │              API SERVICE (services/api.ts)          │
    │                                                      │
    │  ├── userAPI.getProfile()                          │
    │  ├── userAPI.updateProfile()                       │
    │  ├── likesAPI.getUserLikes()                       │
    │  ├── likesAPI.addLike()                            │
    │  ├── playlistAPI.getUserPlaylists()                │
    │  ├── playlistAPI.createPlaylist()                  │
    │  ├── artistsAPI.getTopArtists()                    │
    │  └── ... (other endpoints)                         │
    └──────────────────────────────────────────────────────┘
            │
            ▼
    ┌──────────────────────────────────────┐
    │      BACKEND API ENDPOINTS           │
    │  (kishorbhagwat.in/Sunoji/api/...)   │
    └──────────────────────────────────────┘
            │
            ▼
    ┌──────────────────────────────────────┐
    │         DATABASE                     │
    │  ├── users table                    │
    │  ├── artists table                  │
    │  ├── songs table                    │
    │  ├── likes table                    │
    │  ├── playlists table                │
    │  └── playlist_songs table           │
    └──────────────────────────────────────┘
```

## Data Flow

```
USER INTERACTION
        │
        ▼
   COMPONENT
   (e.g., ProfileHeader)
        │
        ├─ useState(user)
        ├─ useEffect(() => loadData)
        │
        ▼
   API SERVICE
   (services/api.ts)
        │
        ├─ Adds Bearer token
        ├─ Makes HTTP request
        │
        ▼
   BACKEND API
   (/api/users/profile.php)
        │
        ├─ Validates token
        ├─ Queries database
        ├─ Returns JSON response
        │
        ▼
   API SERVICE
   (Parses response)
        │
        ▼
   COMPONENT
   (Updates state)
        │
        ▼
   UI RENDERED
   (Shows new data)
```

## File Dependencies

```
profile.tsx (Main Page)
    │
    ├─ imports ProfileHeader.tsx
    │   └─ uses userAPI.getProfile()
    │
    ├─ imports LikesSection.tsx
    │   └─ uses likesAPI.getUserLikes()
    │
    ├─ imports PlaylistsSection.tsx
    │   ├─ uses playlistAPI.getUserPlaylists()
    │   ├─ navigates to profile/playlist/[id].tsx
    │   │   └─ uses playlistAPI.getPlaylistSongs()
    │   │   └─ uses playlistAPI.addSongToPlaylist()
    │   │   └─ uses playlistAPI.removeSongFromPlaylist()
    │   │   └─ uses songsAPI.searchSongs()
    │   └─ navigates to edit-profile.tsx
    │       └─ uses userAPI.updateProfile()
    │
    └─ imports ArtistsSection.tsx
        ├─ uses artistsAPI.getTopArtists()
        └─ navigates to artist/[id].tsx
            └─ uses artistsAPI.getArtistById()
            └─ uses artistsAPI.getArtistSongs()
```

## State Management Flow

```
┌──────────────────────────────────────────────────────┐
│              PROFILE PAGE STATE                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─ ProfileHeader                                  │
│  │  └─ [user, setUser]                            │
│  │                                                 │
│  ├─ LikesSection                                  │
│  │  └─ [likeCount, setLikeCount]                 │
│  │                                                 │
│  ├─ PlaylistsSection                             │
│  │  ├─ [playlists, setPlaylists]                 │
│  │  │                                             │
│  │  └─ detail/playlist/[id].tsx                  │
│  │     ├─ [songs, setSongs]                      │
│  │     ├─ [showAddSong, setShowAddSong]          │
│  │     └─ [availableSongs, setAvailableSongs]    │
│  │                                                │
│  └─ ArtistsSection                               │
│     ├─ [artists, setArtists]                     │
│     │                                             │
│     └─ artist/[id].tsx                           │
│        ├─ [artist, setArtist]                    │
│        └─ [songs, setSongs]                      │
│                                                  │
└──────────────────────────────────────────────────────┘
```

## Navigation Stack

```
ROOT NAVIGATOR
│
├─ (tabs)
│   └─ profile
│       ├─ profile/_layout.tsx
│       │   ├─ profile/likes.tsx
│       │   └─ profile/playlist/[id].tsx
│       └─ edit-profile.tsx
│
├─ artist/_layout.tsx
│   └─ artist/[id].tsx
│
└─ auth/
```

## Database Schema Relationships

```
users
  │
  ├─ (1:M) likes
  │  └─ (M:1) songs
  │
  ├─ (1:M) playlists
  │  └─ (M:M) playlist_songs
  │     └─ (M:1) songs
  │
  └─ songs
     └─ (M:1) artists

KEY RELATIONSHIPS:
─────────────────
users.id ◄──── likes.user_id
songs.id ◄──── likes.song_id
users.id ◄──── playlists.user_id
playlists.id ◄──── playlist_songs.playlist_id
songs.id ◄──── playlist_songs.song_id
artists.id ◄──── songs.artist_id
```

## API Call Sequence

```
APP STARTUP
│
├─► profile.tsx loads
├─► Renders ProfileHeader
│   └─► useEffect() calls userAPI.getProfile()
│       └─► Backend returns user data
│           └─► setUser() updates state
│               └─► Component re-renders with user photo, name
│
├─► Renders LikesSection
│   └─► useEffect() calls likesAPI.getUserLikes()
│       └─► Backend returns likes array
│           └─► setLikeCount() updates state
│               └─► Shows count
│
├─► Renders PlaylistsSection
│   └─► useEffect() calls playlistAPI.getUserPlaylists()
│       └─► Backend returns playlists array
│           └─► setPlaylists() updates state
│               └─► Renders playlist list
│
└─► Renders ArtistsSection
    └─► useEffect() calls artistsAPI.getTopArtists(10)
        └─► Backend returns 10 artists
            └─► setArtists() updates state
                └─► Renders 5-column grid
```

## Error Handling Flow

```
TRY TO FETCH DATA
        │
        ▼
    API REQUEST
        │
        ├─ SUCCESS
        │   └─► Parse response
        │       └─► Update state
        │           └─► Render data
        │
        └─ ERROR
            └─► Catch error
                └─► setLoading(false)
                    └─► Alert.alert("Error", message)
                        └─► Show error UI
```

## Performance Optimization Flow

```
Page Load
    │
    ├─► ProfileHeader (fixed size)
    ├─► LikesSection (compact)
    ├─► PlaylistsSection
    │   └─► Uses FlatList (virtualized)
    │       └─► Only renders visible items
    │
    └─► ArtistsSection
        └─► Uses FlatList (virtualized)
            └─► Only renders visible items

Result: Smooth scrolling even with many items
```

## Authentication Flow

```
LOCAL STORAGE
   (token)
       │
       ▼
API SERVICE
   (AsyncStorage.getItem('token'))
       │
       └─► Add to request header
           Authorization: Bearer {token}
                   │
                   ▼
           BACKEND
           (Validate token)
                   │
           ├─► Valid
           │   └─► Process request
           │       └─► Return data
           │
           └─► Invalid
               └─► Return 401
                   └─► Frontend shows error
```

## Component Render Tree

```
SafeAreaView
└─ ScrollView
   ├─ ProfileHeader
   │  ├─ Image
   │  ├─ Text (name)
   │  ├─ Text (bio)
   │  └─ TouchableOpacity (edit)
   │
   ├─ LikesSection
   │  └─ TouchableOpacity
   │     ├─ Icon
   │     └─ Text
   │
   ├─ PlaylistsSection
   │  ├─ View (header)
   │  │  ├─ Text (title)
   │  │  └─ TouchableOpacity (add)
   │  └─ FlatList
   │     └─ PlaylistItem (x N)
   │        ├─ Icon
   │        ├─ View (info)
   │        └─ Icon
   │
   └─ ArtistsSection
      ├─ Text (title)
      └─ FlatList
         └─ ArtistItem (x N)
            ├─ Image
            └─ Text (name)
```

---

## Legend

```
├─  Branch
└─  End
▼   Flow down
◄   Relationship
─►  Process
(M:1) Many to One
(1:M) One to Many
(M:M) Many to Many
```
