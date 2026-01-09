# Firebase Backend Setup Guide

This guide explains how to set up Firebase to collect and store decision data from the Forest Manager Decision Study app.

## Why Firebase?

✅ **Free tier**: 10GB storage, 1GB download/day
✅ **No server needed**: Fully managed backend
✅ **Real-time sync**: Data appears instantly in console
✅ **Easy export**: Download as JSON for R analysis
✅ **5-minute setup**: Fastest way to get cloud storage

## Setup Steps

### 1. Create Firebase Project (3 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it: `forest-decision-study` (or any name)
4. Disable Google Analytics (not needed)
5. Click "Create project"

### 2. Create Realtime Database (1 minute)

1. In Firebase Console, click "Realtime Database" in left menu
2. Click "Create Database"
3. Choose location: `europe-west1` (Belgium - closest to you)
4. Start in **test mode** (we'll secure it later)
5. Click "Enable"

### 3. Get Your Config (1 minute)

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app name: `forest-decision-app`
6. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "forest-decision-study.firebaseapp.com",
  databaseURL: "https://forest-decision-study-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forest-decision-study",
  storageBucket: "forest-decision-study.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Add Config to Your App (30 seconds)

1. Open [js/firebase-config.js](js/firebase-config.js)
2. Replace the placeholder config (lines 12-19) with YOUR config
3. Save the file

**Before:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    // ...
};
```

**After:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyA...",  // Your actual values
    authDomain: "forest-decision-study.firebaseapp.com",
    databaseURL: "https://forest-decision-study-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "forest-decision-study",
    storageBucket: "forest-decision-study.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 5. Test It (1 minute)

1. Open your app in browser
2. Make a few decisions
3. Go to Firebase Console > Realtime Database
4. You should see data appearing under:
   - `/decisions/` - Individual decisions as they happen
   - `/sessions/` - Complete sessions when finished

## Data Structure in Firebase

### Individual Decisions
Each decision is stored as:
```
/decisions/
  ├─ -NXb2F3k9Lm_sP4qR5tU/
  │   ├─ decision_id: 1
  │   ├─ timestamp: "2026-01-09T10:30:00.000Z"
  │   ├─ stand_id: "stand_12345"
  │   ├─ phase: "Thinning"
  │   ├─ stand_context: {structure_class, species, ...}
  │   ├─ chosen_activity: "selectiveThinning"
  │   ├─ parameters: {execution_schedule: 45, ...}
  │   ├─ decision_time_ms: 12340
  │   └─ uploaded_at: 1704795000000
```

### Complete Sessions
Full sessions are stored when user clicks "Export Results":
```
/sessions/
  ├─ -NXb2F3k9Lm_sP4qR5tU/
  │   ├─ session_id: "550e8400-e29b-41d4-a716-446655440000"
  │   ├─ timestamp_start: "2026-01-09T10:00:00.000Z"
  │   ├─ timestamp_end: "2026-01-09T10:45:00.000Z"
  │   ├─ duration_seconds: 2700
  │   ├─ agent: {agent_id, owner_type, preferences, ...}
  │   ├─ game_config: {n_stands, total_decisions}
  │   ├─ decisions: [{...}, {...}, ...]
  │   └─ uploaded_at: 1704795000000
```

## Exporting Data for R Analysis

### Option 1: Firebase Console (Quick)
1. Go to Firebase Console > Realtime Database
2. Click the 3-dot menu ⋮ next to your database
3. Click "Export JSON"
4. Save file and import to R

### Option 2: From App (During Development)
Open browser console and run:
```javascript
await FirebaseStorage.exportAllDecisions()
```
This downloads all decisions as JSON.

### Option 3: Firebase CLI (For Production)
Install Firebase CLI and use:
```bash
firebase database:get / > forest_data.json
```

## Security Rules (Important for Production!)

Once you've tested everything, secure your database:

1. Go to Firebase Console > Realtime Database > Rules
2. Replace with:

```json
{
  "rules": {
    "decisions": {
      ".write": true,
      ".read": "auth != null"
    },
    "sessions": {
      ".write": true,
      ".read": "auth != null"
    }
  }
}
```

This allows:
- ✅ Anyone can WRITE decisions (users submit data)
- ✅ Only authenticated users can READ (you can view data)
- ✅ Prevents random people from reading your research data

## R Analysis Example

```r
library(jsonlite)

# Read exported Firebase data
firebase_data <- fromJSON("firebase_export.json")

# Extract all decisions
decisions <- firebase_data$decisions
decisions_df <- bind_rows(decisions)

# OR extract from sessions
sessions <- firebase_data$sessions
all_decisions <- lapply(sessions, function(s) {
  s$decisions %>%
    mutate(session_id = s$session_id,
           agent_id = s$agent$agent_id,
           owner_type = s$agent$owner_type)
}) %>% bind_rows()

# Analyze activity choices
table(all_decisions$chosen_activity, all_decisions$phase)

# Analyze parameters by owner type
all_decisions %>%
  unnest(parameters) %>%
  group_by(owner_type, chosen_activity) %>%
  summarize(
    mean_schedule = mean(execution_schedule, na.rm=TRUE),
    mean_intensity = mean(intensity, na.rm=TRUE)
  )
```

## Fallback: App Works Without Firebase

The app gracefully handles Firebase being unavailable:

✅ If Firebase fails to initialize → App continues with localStorage only
✅ If upload fails → Warning logged, data saved locally
✅ JSON export always works → Users can always download data

Firebase is an **enhancement**, not a requirement.

## Troubleshooting

### "Firebase not defined" error
- Check that Firebase SDK loaded before firebase-config.js
- Look for errors in browser console on page load

### "Permission denied" error
- Database rules too strict
- Temporarily set to test mode: `".read": true, ".write": true`

### Data not appearing in Firebase
1. Open browser console
2. Look for `[Firebase] Decision saved` messages
3. Check `FirebaseStorage.initialized` is true
4. Verify your databaseURL in config matches Firebase Console

### Network errors
- Firebase needs internet connection
- Check if firewall/proxy blocking `firebasedatabase.app`
- App continues working offline with localStorage

## Cost Estimate

**Free tier limits:**
- Database: 1GB storage
- Downloads: 10GB/month
- Simultaneous connections: 100

**Expected usage:**
- Each decision: ~500 bytes
- 10,000 decisions = 5MB
- **Easily handle 100+ participants on free tier**

## Next Steps

1. ✅ Complete Firebase setup (5 minutes)
2. ✅ Test with a few decisions
3. ✅ Deploy to GitHub Pages (see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))
4. ✅ Share URL with supervisor
5. ✅ Monitor data in Firebase Console
6. ✅ Export and analyze when ready

---

**Questions?** Check the [Firebase Documentation](https://firebase.google.com/docs/database/web/start) or open an issue.
