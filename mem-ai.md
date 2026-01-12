# Memory Bank - Tracking Fitness App

## Project Overview

- **Name**: Tracking Fitness
- **Type**: Next.js fitness tracking app
- **Stack**: Next.js 14, React 18, Node.js API routes, JSON file storage (`/data/`)
- **Auth**: bcryptjs + JWT (Bearer tokens in Authorization header)
- **Mobile-first**: Max width 390px container

## Core Features Implemented

### 1. User Management

- **Authentication**: Login/Register with JWT tokens
- **Sessions**: Token stored in localStorage
- **Logout**: Clear token and user from localStorage

### 2. Workout Management

- Create custom workouts with multiple exercises
- Each workout has exercise list with sets/reps configuration
- Edit/delete workouts
- **Exercise Input Fields** (All strings, allow free text input):
  - `sets`: String format (e.g., "4", "3-4", "5x5", "Pyramid")
  - `reps`: String format (e.g., "8", "8-10", "6-12", "max")
  - `restTime`: String format (e.g., "60s", "60-90s", "2-3 min")
  - `rpe`: String format (e.g., "7", "8-9", "Max", "Moderate")
  - `tempo`: String format (e.g., "3-1-2-0")
  - `description`: Optional notes

### 3. Exercise Tracking (Main Feature)

- **Per-Exercise Notes**: Each exercise in each tracking session can have its own note
- Notes stored in: `exercises[].note` (string field in trackings.json)
- **How it works**:
  - User enters note in textarea on exercise detail page
  - Note saves when user clicks "Save Set" or "Save All"
  - Note is pre-filled from last session's note for same exercise
  - Notes are NOT displayed on main workouts list (removed in latest refactor)

### 4. Session Editing

- "Edit Last Session" feature allows editing all sets at once
- Single "Save All" button to update all edited sets in one request
- Optional: Can leave sets empty, only filled sets are saved
- Uses `/api/trackings/update-all` endpoint for bulk updates
- Note can be edited when editing session

### 5. Heavy Day Tracking

- Mark tracking as "Heavy Day" (isHeavy flag)
- Separate UI section shows most recent heavy session
- Visual distinction for heavy vs normal days

## Data Structure

### User (users.json)

```json
{
  "id": "uuid",
  "name": "User Name",
  "email": "email@example.com",
  "password": "bcrypt-hash"
}
```

### Workout (workouts.json)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Workout Name",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": "4",
      "reps": "8-10",
      "description": "optional",
      "restTime": "60-90s",
      "rpe": "8",
      "tempo": "3-1-2"
    }
  ]
}
```

### Tracking (trackings.json)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "workoutId": "uuid",
  "date": "2026-01-11T00:00:00Z",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        { "weight": "50", "reps": "10" },
        { "weight": "50", "reps": "8" }
      ],
      "note": "Felt strong today",
      "isHeavy": false
    }
  ]
}
```

## Key API Endpoints

### Workouts

- `GET /api/workouts` - Get all workouts for user
- `GET /api/workouts/:id` - Get specific workout
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Trackings

- `GET /api/trackings` - Get all trackings for user (can filter by workoutId)
- `POST /api/trackings` - Create new tracking (for saving single set)
  - Body: `{ workoutId, exercises: [{ name, sets: [{ weight, reps }], note }], date?, isHeavy? }`
- `POST /api/trackings/update` - Update single set in existing tracking
- `POST /api/trackings/update-all` - Update all sets in existing tracking at once
- `DELETE /api/trackings/:id` - Delete tracking

### Auth

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

## UI/UX Design System (Latest Refactor)

### Color Palette

**Light Mode:**

- Primary BG: `#ffffff`
- Secondary BG: `#f9fafb`
- Tertiary BG: `#f3f4f6`
- Text Primary: `#1f2937`
- Text Secondary: `#6b7280`
- Text Tertiary: `#9ca3af`
- Border: `#e5e7eb`
- Primary Color: `#7c3aed` (purple)

**Dark Mode:**

- Primary BG: `#0f172a`
- Secondary BG: `#1e293b`
- Tertiary BG: `#334155`
- Text Primary: `#f1f5f9`
- Text Secondary: `#cbd5e1`
- Text Tertiary: `#94a3b8`
- Border: `#334155`

### Component Sizes

- Border radius: `10px` (buttons, inputs, cards)
- Card shadow: `0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)`
- Hover shadow: `0 4px 12px rgba(0, 0, 0, 0.1)`
- Padding: `16px` (cards), `12px 16px` (buttons)
- Margin: `16px` (sections), `12px-14px` (list items)

### Typography

- **H1**: 28px, weight 600
- **H2**: 20px, weight 600
- **H3**: 16px, weight 600
- **Body**: 14px, weight 400
- **Meta**: 13px, weight 500, muted color
- Font weights: 400 (normal), 500 (medium), 600 (semibold) only

### Button Styles

- **Primary**: Solid color, no gradient
- **Secondary**: Light bg with border
- **Outline**: Transparent with border
- Hover: Slight opacity change + -1px lift
- Active: No lift, slightly reduced opacity

### Key Design Improvements Made

✅ Removed heavy neumorphism (3D shadows)
✅ Removed gradient overuse (only on CTAs if needed)
✅ Added clear card borders for visual separation
✅ Simplified shadows (crisp, not blurry)
✅ Clear typography hierarchy
✅ Consistent spacing (28px sections, 14px list gap)
✅ Removed glass blur effects
✅ Dark mode feels sharp, not washed out
✅ Mobile-first, responsive design

## File Structures

### Key Pages

- `pages/index.js` - Dashboard (workout list, theme toggle, logout)
- `pages/login.js` - Login page
- `pages/_document.js` - Prevent iOS dark mode forcing
- `pages/setup.js` - Create new workout (with free-text exercise inputs)
- `pages/workout/[id].js` - Workout detail
- `pages/workout/[id]/exercise/[exerciseIndex].js` - Exercise tracking detail
- `pages/_app.js` - User context, global setup

### API Routes

- `pages/api/auth/` - Authentication endpoints
- `pages/api/workouts.js` - Workout CRUD
- `pages/api/workouts/[id].js` - Single workout detail
- `pages/api/trackings.js` - Create tracking
- `pages/api/trackings/update.js` - Update single set
- `pages/api/trackings/update-all.js` - Update all sets at once
- `pages/api/trackings/heavy.js` - Mark as heavy day

### Styles

- `styles/globals.css` - All styling (CSS variables, components, utilities)
- **No Tailwind used in components** - All inline styles or CSS classes

## Known Behaviors & Edge Cases

### Exercise Input Fields (String-based)

- All exercise configuration fields (sets, reps, restTime, rpe) now accept free-text string input
- Users can enter values like "8-10", "60-90s", "5x5", "max effort", etc.
- No validation constraints - allows maximum flexibility
- Stored as strings in database (workouts.json)
- Displayed as-is in UI without parsing or conversion

### Note Handling

- Notes are optional - not required to save tracking
- Empty note is treated as no note
- Pre-filling from last session: checks if note exists, otherwise blank
- Notes persist even if other set data changes

### Heavy Day

- Can mark same tracking as heavy multiple times (just overwrites)
- Heavy day is session-level property
- Shows most recent heavy session in UI

### Partial Edits

- When editing last session, can leave some sets empty
- Frontend filters out empty sets before sending
- API accepts partial set arrays
- Requires at least 1 set with data to save

### Theme System

- Default theme: **light** (forced on iOS to prevent hard dark mode)
- Theme stored in localStorage
- Applied to `<html>` element as `class="dark"`
- CSS uses `:root` for light, `html.dark` for dark

## Recent Changes (Latest Session)

### Exercise Input Field Update

- Changed Sets, Reps, Rest Time, RPE inputs from `type="number"` to `type="text"`
- Allows free-form text input with helpful placeholders:
  - Sets: "4 / 3-4 / 5x5"
  - Reps: "8 / 8-10 / 6-12"
  - Rest Time: "60s / 60-90s / 2-3 min"
  - RPE: "7 / 8-9 / Max"
- Removed min/max number constraints for RPE
- Removed "(seconds)" label from Rest Time - now accepts any format
- Database already supports string storage for these fields

### Dark Mode Improvement

- Changed from hard black (#121212) to softer slate (#0f172a)
- Adjusted text colors for better contrast
- Reduced shadow intensity for less harsh appearance
- Light workout cards to #171717 to reduce eye strain

### UI Refinement (Comprehensive)

- Removed gradient main variable and all related gradients
- Updated button styles to simple solid colors
- Added subtle borders to all cards
- Improved typography hierarchy
- Increased list spacing (14px gap) for better scanability
- Section headers now have consistent 28px margin
- Message alerts use left accent border instead of full background

### Button Fixes

- Fixed broken button styles in exercise page
- Removed references to deleted CSS variables (--accent-neon-purple, etc.)
- All buttons now use simple solid colors from CSS vars
- Hover states use opacity + transform instead of complex shadows

## Common Patterns

### Fetching with Auth

```javascript
const token = localStorage.getItem("token");
fetch("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Saving Tracking

```javascript
const exercises = [
  {
    name: exercise.name,
    sets: [{ weight, reps }],
    ...(note && { note }),
  },
];
fetch("/api/trackings", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ workoutId, exercises, date }),
});
```

### Setting State Properly

- Use immutable patterns: spread operator for objects/arrays
- Update nested properties with new object: `{...state, prop: value}`
- Never mutate state directly

## Next Steps / Future Improvements

- Export data (PDF, CSV)
- Statistics & progress charts
- Set personal records
- Rest timer integration
- Push notifications
- Progressive Web App (PWA)
- Offline support
- Edit workout exercises after creation

## Troubleshooting

### Button not visible

- Check if button has proper background color from CSS variables
- Verify CSS variables are defined in :root or .dark class
- Avoid inline gradients with undefined variables

### Note not saving

- Verify note textarea has value
- Check that fetch includes Authorization header
- Ensure exercises array includes note field

### Theme not switching

- Check localStorage has 'theme' key
- Verify applyTheme() adds/removes 'dark' class from html
- Check CSS has both :root and html.dark selectors

### Tracking not showing

- Verify workoutId matches
- Check date format (ISO string)
- Ensure user is authenticated (token in localStorage)
- Verify API returns array of trackings

### Exercise fields not accepting input

- Verify input type is "text" not "number"
- Check that onChange handlers are properly bound
- Ensure state is being updated (check browser DevTools)
