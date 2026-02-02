# Profile Section Implementation Guide

## Overview
Complete profile section redesign for Sunoji music app with the following features:
- User profile header with photo and edit option
- Liked songs section
- Playlists management
- Top artists showcase

## Frontend Implementation ✅ Complete

### Files Created

#### 1. **API Service** (`services/api.ts`)
   - Centralized API client with helper functions
   - Handles authentication with Bearer tokens
   - Methods for: users, likes, playlists, artists, songs

#### 2. **Components**

   **ProfileHeader.tsx** - Top section with:
   - User profile photo from database
   - User name display
   - Bio display
   - Transparent edit button

   **LikesSection.tsx** - Likes box:
   - Shows count of liked songs
   - Red/pink color scheme
   - Navigates to likes detail page

   **PlaylistsSection.tsx** - Playlist management:
   - Displays all user playlists
   - Create new playlist button
   - Playlist item shows: name, description, song count
   - Green accent color

   **ArtistsSection.tsx** - Top 10 artists:
   - 5 columns grid layout
   - Artist photo and name
   - Clickable artist cards

#### 3. **Pages**

   **profile.tsx** - Main profile page:
   - ScrollView with all components
   - Black theme (#0a0a0a background)

   **profile/likes.tsx** - Liked songs detail:
   - List of all liked songs
   - Play songs from likes
   - Remove from likes functionality
   - Back button navigation

   **profile/playlist/[id].tsx** - Playlist detail:
   - Show playlist songs
   - Add songs to playlist via search
   - Remove songs from playlist
   - Play songs directly

   **edit-profile.tsx** - Edit profile page:
   - Change profile photo (via image picker)
   - Edit name and bio
   - Character count for bio (max 150)
   - Email display (read-only)
   - Logout button

   **artist/[id].tsx** - Artist detail:
   - Artist info (photo, name, bio)
   - All artist's songs
   - Play songs

#### 4. **Layouts**
   - `profile/_layout.tsx` - Profile section routing
   - `profile/playlist/_layout.tsx` - Playlist routes
   - `artist/_layout.tsx` - Artist routes

### Feature Details

#### Profile Header
```
┌─────────────────────┐
│   Profile Photo     │  (120x120, rounded)
│                     │
└─────────────────────┘
    User Name
    User Bio (optional)
   ┌─────────────────┐
   │  ✏️  Edit       │  (Transparent button)
   └─────────────────┘
```

#### Likes Section
```
┌────────────────────────────────────┐
│ ❤️  Liked Songs                  → │
│     25 songs                        │
└────────────────────────────────────┘
```

#### Playlists Section
```
Your Playlists                    [+]
┌────────────────────────────────────┐
│ 🎵 Playlist Name                 → │
│    Optional Description             │
│    15 songs                         │
└────────────────────────────────────┘
```

#### Artists Section
```
Top Artists
┌──────┬──────┬──────┬──────┬──────┐
│Photo │Photo │Photo │Photo │Photo │
│Name  │Name  │Name  │Name  │Name  │
└──────┴──────┴──────┴──────┴──────┘
```

---

## Backend Requirements ✅ Documented

### Database Schema

#### Tables Required:
1. **users** - User profiles
2. **songs** - Song data
3. **artists** - Artist information
4. **likes** - User's liked songs
5. **playlists** - User's playlists
6. **playlist_songs** - Songs in each playlist

See `DATABASE_SCHEMA.md` for full SQL definitions.

### API Endpoints Required

All endpoints are documented in `API_ENDPOINTS.md`

**Key Endpoints:**
- `GET /users/profile.php` - Get user profile
- `POST /users/profile.php` - Update profile
- `GET /likes/get.php` - Get liked songs
- `POST /likes/add.php` - Add to likes
- `POST /likes/remove.php` - Remove from likes
- `GET /playlists/get.php` - Get user's playlists
- `POST /playlists/create.php` - Create playlist
- `GET /playlists/songs.php?playlist_id={id}` - Get songs in playlist
- `POST /playlists/add-song.php` - Add song to playlist
- `POST /playlists/remove-song.php` - Remove song from playlist
- `GET /artists/top.php?limit=10` - Get top 10 artists
- `GET /artists/get.php?id={id}` - Get artist details
- `GET /artists/songs.php?id={id}` - Get artist's songs
- `GET /songs/search.php?q={query}` - Search songs

---

## Color Scheme

- **Primary**: #1DB954 (Spotify Green)
- **Background**: #0a0a0a (Dark)
- **Secondary Background**: #1a1a1a
- **Tertiary Background**: #222
- **Text**: #fff, #ccc, #aaa, #888, #666
- **Accent (Likes)**: #ff6b6b (Red)
- **Accent (Playlists)**: #1DB954 (Green)

---

## Navigation Flow

```
Profile Tab
├── Profile Header
│   └── Edit Button → Edit Profile Page
│       ├── Change Photo
│       ├── Edit Name
│       ├── Edit Bio
│       └── Logout
├── Likes Section
│   └── Click → Likes Detail Page
│       ├── List of Songs
│       ├── Play Song
│       └── Remove from Likes
├── Playlists Section
│   ├── Create Button → Create Playlist Dialog
│   └── Playlist Item → Playlist Detail Page
│       ├── List of Songs
│       ├── Add Songs (Search)
│       ├── Remove Songs
│       └── Play Song
└── Artists Section
    └── Artist Item → Artist Detail Page
        ├── Artist Info
        └── Artist's Songs
            └── Play Song
```

---

## Installation & Setup

### 1. Dependencies Required
Already in package.json:
- `@react-native-async-storage/async-storage`
- `expo-image-picker` (for photo selection)
- `@expo/vector-icons` (MaterialIcons, AntDesign)
- `expo-router` (navigation)

### 2. Import Statements
Update any file that uses the components:
```tsx
import ProfileHeader from "@/app/components/ProfileHeader";
import LikesSection from "@/app/components/LikesSection";
import PlaylistsSection from "@/app/components/PlaylistsSection";
import ArtistsSection from "@/app/components/ArtistsSection";
```

### 3. API Service Usage
```tsx
import { userAPI, likesAPI, playlistAPI, artistsAPI } from "@/services/api";

// Example: Get user profile
const response = await userAPI.getProfile();
if (response.status === "success") {
  setUser(response.data);
}
```

---

## Testing Checklist

### Profile Header
- [ ] Profile photo loads from database
- [ ] User name displays correctly
- [ ] Bio displays (if available)
- [ ] Edit button navigates to edit page

### Edit Profile
- [ ] Can change profile photo
- [ ] Can update name
- [ ] Can update bio (with char count)
- [ ] Email is read-only
- [ ] Save button updates profile
- [ ] Logout button works

### Likes
- [ ] Displays count of liked songs
- [ ] Click opens likes detail page
- [ ] Can play songs
- [ ] Can remove songs from likes
- [ ] Empty state shows when no likes

### Playlists
- [ ] Lists all user playlists
- [ ] Shows song count per playlist
- [ ] Create button opens dialog
- [ ] Can create new playlist
- [ ] Click playlist opens detail page
- [ ] Can add songs (search functionality)
- [ ] Can remove songs
- [ ] Can play songs
- [ ] Playlist names are unique

### Artists
- [ ] Shows top 10 artists
- [ ] 5-column grid layout
- [ ] Artist photos display
- [ ] Click opens artist detail page
- [ ] Shows all artist's songs
- [ ] Can play artist's songs

### Navigation
- [ ] Back buttons work on all detail pages
- [ ] Routes are correct
- [ ] State persists appropriately

---

## Performance Optimizations

- ✅ Lazy loading via `useFocusEffect`
- ✅ API calls cached appropriately
- ✅ FlatList for large song/playlist lists
- ✅ Image optimization with loading states
- ✅ Error handling with alerts

---

## Future Enhancements

1. Add playlist cover photos
2. Pagination for long song lists
3. Batch operations (add multiple songs)
4. Playlist sharing
5. Social features (follow artists)
6. Offline mode with caching
7. Dark/Light theme toggle
8. Advanced search filters

---

## Troubleshooting

### Images not loading
- Check image URLs in database are valid
- Ensure proper CORS headers on backend

### Navigation not working
- Verify layout files are correctly structured
- Check expo-router version compatibility

### API errors
- Check authentication token is being sent
- Verify backend endpoints are implemented
- Check API request body format matches documentation

### Performance issues
- Profile page is data-heavy, consider pagination
- Implement react-query for caching if needed

---

## Files Summary

```
📁 services/
  └─ api.ts (API client)

📁 app/
  ├─ (tabs)/
  │  └─ profile.tsx (Main profile page)
  ├─ components/
  │  ├─ ProfileHeader.tsx
  │  ├─ LikesSection.tsx
  │  ├─ PlaylistsSection.tsx
  │  └─ ArtistsSection.tsx
  ├─ profile/
  │  ├─ _layout.tsx
  │  ├─ likes.tsx
  │  └─ playlist/
  │     ├─ _layout.tsx
  │     └─ [id].tsx
  ├─ artist/
  │  ├─ _layout.tsx
  │  └─ [id].tsx
  └─ edit-profile.tsx

📄 DATABASE_SCHEMA.md (Schema reference)
📄 API_ENDPOINTS.md (API documentation)
```

---

## Support

For questions or issues with the implementation, refer to:
1. Component comments in source files
2. API_ENDPOINTS.md for backend implementation
3. DATABASE_SCHEMA.md for database setup
