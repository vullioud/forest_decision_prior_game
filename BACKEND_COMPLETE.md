# Backend Setup Complete ✅

Firebase backend has been integrated into the Forest Decision Study app!

## What's Been Added

### 1. Firebase Integration Module
**File:** [js/firebase-config.js](js/firebase-config.js)

**Features:**
- ✅ Initialize Firebase connection
- ✅ Save individual decisions as they happen
- ✅ Save complete sessions on export
- ✅ Retrieve all decisions for analysis
- ✅ Export all data as JSON
- ✅ Graceful fallback if Firebase unavailable

### 2. Automatic Upload After Each Decision
**Modified:** [js/game-engine-v4.js](js/game-engine-v4.js:239-244)

After each decision is recorded:
```javascript
// Upload to Firebase (if available)
if (typeof FirebaseStorage !== 'undefined' && FirebaseStorage.initialized) {
    FirebaseStorage.saveDecision(decision).catch(err => {
        console.warn('[Firebase] Upload failed, continuing locally:', err);
    });
}
```

**Benefits:**
- Data backed up immediately
- No data loss if user closes browser
- Can monitor progress in real-time via Firebase Console

### 3. Session Upload on Export
**Modified:** [js/game-engine-v4.js](js/game-engine-v4.js:328-335)

When user clicks "Export Results":
```javascript
// Upload to Firebase (if available)
if (typeof FirebaseStorage !== 'undefined' && FirebaseStorage.initialized) {
    FirebaseStorage.saveSession(sessionData).then(() => {
        console.log('[Firebase] Complete session uploaded');
    });
}
```

**Benefits:**
- Complete session data with metadata
- Easy to analyze full sessions
- Includes agent profile and timing information

### 4. Firebase SDK Integration
**Modified:** [index.html](index.html:18-28)

Added Firebase CDN scripts:
```html
<!-- Firebase SDK (Optional - for cloud storage) -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>

<!-- Load our Firebase config -->
<script src="js/firebase-config.js"></script>
```

## How It Works

### Data Flow

```
User makes decision
     ↓
GameEngine records decision
     ↓
Saved to localStorage (auto-save)
     ↓
Uploaded to Firebase (if connected)
     ↓
Continue to next decision
```

### Dual Storage Strategy

1. **LocalStorage** (Primary)
   - Always works offline
   - Enables Save & Resume
   - Fast, no network latency
   - Auto-save every 30 seconds

2. **Firebase** (Backup & Analysis)
   - Cloud storage for safety
   - Real-time monitoring
   - Easy export for R analysis
   - Aggregates data from all users

### Data Structure in Firebase

```
Firebase Database
├── /decisions/
│   ├── -NXb2F3k9Lm... (auto-generated ID)
│   │   ├── decision_id: 1
│   │   ├── timestamp: "2026-01-09T10:30:00Z"
│   │   ├── stand_id: "stand_12345"
│   │   ├── phase: "Thinning"
│   │   ├── stand_context: {...}
│   │   ├── chosen_activity: "selectiveThinning"
│   │   ├── parameters: {...}
│   │   ├── decision_time_ms: 12340
│   │   └── uploaded_at: 1704795000000
│   └── ...
└── /sessions/
    ├── -NXb2F3k9Lm... (auto-generated ID)
    │   ├── session_id: "550e8400-..."
    │   ├── timestamp_start: "2026-01-09T10:00:00Z"
    │   ├── timestamp_end: "2026-01-09T10:45:00Z"
    │   ├── agent: {...}
    │   ├── decisions: [...]
    │   └── uploaded_at: 1704795000000
    └── ...
```

## Setup Required (5 Minutes)

To activate Firebase backend:

1. **Create Firebase project** (3 min)
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Create new project
   - Enable Realtime Database

2. **Get config** (1 min)
   - Project Settings → Your Apps → Web
   - Copy the config object

3. **Add to app** (1 min)
   - Open `js/firebase-config.js`
   - Replace lines 12-19 with your config
   - Done!

**Detailed instructions:** [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## Benefits of Firebase Backend

### For Development
✅ Real-time monitoring of user decisions
✅ No need to wait for users to send JSON files
✅ Can see data as it's being collected
✅ Easy to check if users are having issues

### For Data Collection
✅ Automatic backup of all decisions
✅ No data loss if user forgets to export
✅ Aggregates data from multiple participants
✅ Single export for all participants' data

### For Analysis
✅ Direct export to JSON for R
✅ Structured data ready for analysis
✅ Timestamps for temporal analysis
✅ Complete decision context preserved

## Graceful Degradation

The app works perfectly **without Firebase**:

- ✅ If Firebase SDK fails to load → App continues with localStorage
- ✅ If Firebase config missing → Warning logged, app continues
- ✅ If network offline → Data saved locally, uploaded when reconnected
- ✅ If Firebase upload fails → Warning logged, decision still recorded locally
- ✅ JSON export always works → Users can always download their data

**Firebase is an enhancement, not a requirement.**

## Testing

### Test Without Firebase (Default)
1. Open app (Firebase will show warning in console)
2. Make decisions normally
3. Everything works with localStorage only
4. Export downloads JSON file

### Test With Firebase
1. Complete Firebase setup
2. Open app (should see `[Firebase] Initialized successfully`)
3. Make a decision
4. Check Firebase Console → Realtime Database
5. Should see data under `/decisions/`

### Test Fallback
1. Set up Firebase
2. Turn off internet connection
3. Make decisions (saved locally)
4. Turn on internet
5. Make another decision (uploads all pending)

## Monitoring Data Collection

### Firebase Console (Real-time)
1. Go to Firebase Console → Realtime Database
2. Watch data appear as users make decisions
3. See structure of decisions and sessions

### Browser Console (Development)
Look for these messages:
- `[Firebase] Initialized successfully`
- `[Firebase] Decision saved: 1`
- `[Firebase] Complete session uploaded`

### Export All Data (Anytime)
Open browser console and run:
```javascript
await FirebaseStorage.exportAllDecisions()
```

## R Analysis Integration

### Import Firebase Export
```r
library(jsonlite)

# Read Firebase export (from console or app)
firebase_data <- fromJSON("firebase_export.json")

# Extract decisions
decisions_list <- firebase_data$decisions
decisions_df <- bind_rows(lapply(decisions_list, as.data.frame))

# OR extract from sessions
sessions_list <- firebase_data$sessions
all_decisions <- lapply(sessions_list, function(session) {
  decisions <- bind_rows(session$decisions)
  decisions$session_id <- session$session_id
  decisions$agent_id <- session$agent$agent_id
  decisions$owner_type <- session$agent$owner_type
  decisions
}) %>% bind_rows()

# Analyze
table(all_decisions$chosen_activity, all_decisions$phase)
```

### Direct Firebase → R (Advanced)
```r
# Install Firebase R package
# devtools::install_github("JohnCoene/firebase")

# Connect to Firebase
library(firebase)
firebase::set_config(
  apiKey = "YOUR_API_KEY",
  databaseURL = "https://your-project.firebaseio.com"
)

# Fetch data
decisions <- firebase::get("decisions")
```

## Cost & Limits

**Free Tier:**
- 1GB database storage
- 10GB downloads per month
- 100 simultaneous connections

**Expected Usage:**
- ~500 bytes per decision
- 10,000 decisions = ~5MB
- **Can handle 100+ participants easily**

## Security

### Current Setup (Testing)
- Anyone can write to database ✅ (users submit decisions)
- Anyone can read from database ⚠️ (temporary for testing)

### Production Setup (After Testing)
Update Firebase Rules to:
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

This ensures:
- ✅ Anyone can submit decisions (needed for app to work)
- ✅ Only you can read data (requires Firebase authentication)
- ✅ Prevents random people from accessing research data

## Next Steps

1. ✅ **Backend setup complete** - Firebase integration done
2. ⏭️ **Configure Firebase** - 5-minute setup (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
3. ⏭️ **Deploy app** - GitHub Pages (see [QUICK_DEPLOY.md](QUICK_DEPLOY.md))
4. ⏭️ **Share with supervisor** - Get feedback
5. ⏭️ **Launch data collection** - Share with participants
6. ⏭️ **Monitor Firebase Console** - Watch data come in
7. ⏭️ **Export and analyze** - Import to R when ready

---

## Files Modified

1. ✅ [js/firebase-config.js](js/firebase-config.js) - NEW
2. ✅ [js/game-engine-v4.js](js/game-engine-v4.js) - Firebase init and upload
3. ✅ [index.html](index.html) - Firebase SDK scripts
4. ✅ [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Setup guide
5. ✅ [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Deployment guide

## Summary

✅ Firebase backend fully integrated
✅ Automatic upload after each decision
✅ Complete session upload on export
✅ Graceful fallback to localStorage
✅ Real-time monitoring ready
✅ R analysis integration documented
✅ 5-minute setup guide provided
✅ Free tier sufficient for research project

**The app is ready to deploy! 🚀**
