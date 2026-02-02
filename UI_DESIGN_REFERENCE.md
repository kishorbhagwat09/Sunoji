# UI/UX Design Reference

## Color Palette

```
Primary Colors:
- Dark Background: #0a0a0a (Main app background)
- Card Background: #1a1a1a (Component backgrounds)
- Border Color: #222 (Dividers and borders)
- Text Primary: #fff (Main text)
- Text Secondary: #ccc (Secondary text)
- Text Tertiary: #aaa (Tertiary text)
- Text Muted: #888, #666 (Muted/disabled text)

Accent Colors:
- Green (Primary): #1DB954 (Spotify Green) - Used for: Buttons, Highlights, Playlists
- Red (Likes): #ff6b6b (Red) - Used for: Like button, Heart icon
- Transparent Green: rgba(29, 185, 84, 0.3) - Button backgrounds
- Transparent Red: rgba(255, 107, 107, 0.1) - Likes section background
```

## Typography

```
Heading 1: fontSize: 24, fontWeight: "bold" (Profile name)
Heading 2: fontSize: 18, fontWeight: "bold" (Section titles)
Heading 3: fontSize: 16, fontWeight: "600" (Card titles)
Body: fontSize: 14, fontWeight: "600" (Song/Playlist names)
Subtitle: fontSize: 13-14, fontWeight: "500" (Description text)
Caption: fontSize: 12, fontWeight: "400" (Secondary info)
Small: fontSize: 11, fontWeight: "400" (Tertiary info)
```

## Component Sizing

### Profile Header
```
Photo: 120x120 (rounded 60)
Spacing above: 15px
Spacing below: 15px
Edit Button: 40px height, 20px padding horizontal
```

### Likes Section
```
Height: 80px
Padding: 15px
Heart Icon: 32x32
Rounded Corners: 12px
Border Width: 1px
```

### Playlist Item
```
Height: ~70px (auto)
Padding: 12px
Icon: 28x28
Left Border: 3px solid #1DB954
Rounded Corners: 10px
```

### Artist Grid
```
Columns: 5 per row
Item Width: 19% of screen
Photo: 60x60 (rounded 30)
Text Size: 11px
Spacing: 15px between rows
```

### Song Item
```
Height: ~70px
Album Art: 50x50 (rounded 6)
Padding: 10px
Rounded Corners: 8px
Play Overlay: Full cover with semi-transparent dark background
```

## Spacing System

```
XS: 4px
S: 8px
M: 12px
L: 16px
XL: 20px
2XL: 30px
```

Standard padding:
- Cards: 12px horizontal, 10px vertical
- Sections: 20px horizontal
- List items: 12px between items
- Top/Bottom padding on screens: 20px
```

## Border Radius

```
Rounded Corners: 8px (cards, inputs, buttons)
More Rounded: 10-12px (playlist items)
Full Rounded: 20px (transparent buttons, pills)
Circle: 30-60px (profile/artist photos)
Mini Rounded: 6px (album art)
```

## Shadows & Elevation

```
Light Shadow:
- backgroundColor with opacity for dark theme
- No traditional shadows (dark theme preference)

Card Style:
- backgroundColor: #1a1a1a
- borderWidth: 1
- borderColor: #333
```

## Icons Used

From `@expo/vector-icons`:

### Material Icons
- `pencil` - Edit profile
- `favorite` - Like (filled)
- `favorite-border` - Unlike (outline)
- `music-note` - Music placeholder
- `playlist-play` - Playlist
- `chevron-right` - Navigation arrow
- `add` - Add button
- `close` - Close/Remove
- `play-arrow` - Play song
- `user` - User profile
- `camera-alt` - Photo camera
- `add-circle-outline` - Add with outline

### Ant Design Icons
- `left` - Back arrow
- `user` - User icon
- `plus` - Plus/Add

### Ionicons
- `pencil` - Edit button

## Layout Structure

### Profile Page (ScrollView)
```
┌─────────────────────────────────────┐
│     PROFILE HEADER COMPONENT        │  Height: ~260px
├─────────────────────────────────────┤
│     LIKES SECTION COMPONENT         │  Height: ~80px
├─────────────────────────────────────┤
│   PLAYLISTS SECTION COMPONENT       │  Height: Variable
├─────────────────────────────────────┤
│    ARTISTS SECTION COMPONENT        │  Height: Variable
└─────────────────────────────────────┘
```

### Detail Page Structure
```
┌─────────────────────────────────────┐
│  [<] Header Title         [Icon]    │  Height: 60px
├─────────────────────────────────────┤
│                                     │
│     FlatList Content                │  Height: Remaining
│                                     │
└─────────────────────────────────────┘
```

## Animation & Transitions

```
Screen transitions: Fade effect (expo-router default)
Button press: Quick visual feedback (opacity change)
List item interaction: Touch opacity feedback
Navigation: Smooth slide transitions
```

## Dark Theme Considerations

- All backgrounds use dark grays (#0a0a0a, #1a1a1a)
- Text is light colors (white, light gray)
- Borders use subtle dark colors (#222, #333)
- Accent colors are vibrant (green #1DB954, red #ff6b6b)
- No harsh shadows - use borders instead
- Icons have good contrast with backgrounds

## Responsive Design

### Mobile (Base)
- All padding/spacing defined for standard mobile
- Single column layouts
- Full-width cards with side padding

### Landscape
- May have side-by-side content
- Adjust font sizes appropriately
- Consider horizontal scrolling for grids

## Accessibility

- Sufficient color contrast
- Touch targets min 44x44px
- Clear visual hierarchy
- Descriptive labels
- Icon + text combinations
- Loading indicators for async operations

## State Management

### Loading State
- Show `ActivityIndicator` centered
- Dim opacity on interactive elements

### Empty State
- Large icon (48px)
- Descriptive text
- Call-to-action button if available

### Error State
- Red/warning color (#ff6b6b)
- Clear error message
- Retry option

## Theming Tokens

```tsx
const COLORS = {
  primary: '#1DB954',    // Green
  accent: '#ff6b6b',     // Red
  background: '#0a0a0a',
  surface: '#1a1a1a',
  border: '#222',
  text: {
    primary: '#fff',
    secondary: '#ccc',
    tertiary: '#aaa',
    muted: '#888',
  },
  transparent: {
    greenDark: 'rgba(29, 185, 84, 0.3)',
    greenLight: 'rgba(29, 185, 84, 0.2)',
    redDark: 'rgba(255, 107, 107, 0.1)',
    redLight: 'rgba(255, 107, 107, 0.2)',
  }
};

const SPACING = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 30,
};

const RADIUS = {
  s: 6,
  m: 8,
  l: 10,
  xl: 12,
  pill: 20,
  circle: 30,
};
```

## Component Hierarchy

```
SafeAreaView (Profile)
└── ScrollView
    ├── ProfileHeader
    │   ├── Image (profile photo)
    │   ├── Text (name)
    │   ├── Text (bio)
    │   └── TouchableOpacity (edit button)
    ├── LikesSection
    │   └── TouchableOpacity
    │       ├── Icon
    │       └── Text
    ├── PlaylistsSection
    │   ├── View (header with title + add button)
    │   └── FlatList
    │       └── PlaylistItem
    │           ├── Icon
    │           ├── View (info)
    │           └── Icon (chevron)
    └── ArtistsSection
        ├── Text (title)
        └── FlatList
            └── ArtistItem
                ├── Image
                └── Text (name)
```

## Best Practices Applied

✅ Dark theme optimized for battery and eye strain
✅ Consistent spacing and sizing
✅ Clear visual hierarchy
✅ Accessible touch targets
✅ Smooth transitions and feedback
✅ Clear loading/empty/error states
✅ Proper color contrast
✅ Icon usage for quick recognition
✅ Logical grouping of content
✅ Touch-friendly UI elements

## Future Customization

To customize the theme:
1. Update color codes in component StyleSheets
2. Adjust spacing constants
3. Modify font sizes and weights
4. Change border radius values
5. Update icon names/sizes
6. Adjust animation durations
