# Deployment Checklist for GitHub

Use this checklist when uploading to GitHub for the first time.

## ✅ Pre-Deployment Checklist

### Files to Upload (Essential)
- ✅ `index.html` - Main entry point
- ✅ `css/styles.css` - Styling
- ✅ `js/` folder - All JavaScript files
  - game-engine-v4.js
  - ui-renderer-v5.js
  - data-loader-v2.js
  - parameter-metadata.js
  - activity-selector.js
  - coverage-tracker.js
  - session-manager.js
  - firebase-config.js
  - distributions.js
  - species-data.js
  - utils.js
  - export.js
- ✅ `config/game_data.json` - Stand and agent data
- ✅ `README.md` - Project documentation
- ✅ `QUICK_DEPLOY.md` - Deployment guide
- ✅ `FIREBASE_SETUP.md` - Firebase guide
- ✅ `LATEST_FIXES.md` - Recent updates
- ✅ `BACKEND_COMPLETE.md` - Backend documentation
- ✅ `.gitignore` - Git ignore rules

### Files to SKIP (Not Needed)
- ❌ `archive/` folder - Old versions
- ❌ Any backup files (.bak, .old, etc.)
- ❌ Editor files (.vscode, .idea)

## 📋 Deployment Steps

### Option 1: GitHub Web Interface (Easiest)

1. **Create Repository**
   ```
   - Go to github.com
   - Click + → New repository
   - Name: forest-decision-study
   - Make it Public
   - Don't initialize with README
   - Click Create
   ```

2. **Upload Files**
   ```
   - Click "uploading an existing file"
   - Drag all files EXCEPT archive/ folder
   - Commit message: "Initial commit - Forest Decision Study"
   - Click "Commit changes"
   ```

3. **Enable GitHub Pages**
   ```
   - Go to Settings → Pages
   - Source: main branch, / (root)
   - Click Save
   - Wait 1-2 minutes
   ```

4. **Get Your URL**
   ```
   Your app will be at:
   https://YOUR_USERNAME.github.io/forest-decision-study/
   ```

### Option 2: Git Command Line (If Available)

```bash
# Navigate to project folder
cd "c:\Users\cv1055\Documents\SOCO\abe\forest-decision-game"

# Initialize git (if not already)
git init

# Add all files (archive/ will be ignored by .gitignore)
git add .

# Commit
git commit -m "Initial commit - Forest Decision Study"

# Create main branch
git branch -M main

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/forest-decision-study.git

# Push to GitHub
git push -u origin main

# Then enable GitHub Pages in repo settings
```

## 🧪 Testing After Deployment

1. **Open the URL** in your browser
2. **Check browser console** (F12) for errors
3. **Test basic flow:**
   - ✅ Welcome screen shows
   - ✅ Agent profile displays
   - ✅ Portfolio shows 10 stands
   - ✅ Activity selection works
   - ✅ Parameter sliders work
   - ✅ Continue button advances
   - ✅ Progress saves (test "Save & Exit")
   - ✅ Resume works (refresh page)
   - ✅ Export downloads JSON

4. **Firebase check** (if configured):
   - Open console
   - Look for `[Firebase] Initialized successfully`
   - Make a decision
   - Check Firebase Console for data

## 🔧 Common Issues

### Issue: Page shows 404
**Fix:** Make sure you enabled GitHub Pages in Settings

### Issue: Styles not loading
**Fix:** Check that `css/styles.css` exists in repo

### Issue: Game won't start
**Fix:**
1. Open browser console
2. Check for "404 Not Found" errors
3. Verify all JS files uploaded

### Issue: Data won't load
**Fix:** Check that `config/game_data.json` uploaded correctly

### Issue: Firebase not working
**Fix:**
1. Firebase is optional - game works without it
2. If you want Firebase, complete setup in `js/firebase-config.js`
3. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## 📢 Sharing with Users

Once deployed, share this message:

```
Forest Manager Decision Study - Now Available!

🔗 https://YOUR_USERNAME.github.io/forest-decision-study/

Instructions:
1. Open the link in Chrome, Firefox, or Edge
2. Review the forest owner profile
3. Make management decisions for 10 stands
4. Progress auto-saves - exit anytime
5. Complete all phases and export your data
6. Send me the downloaded JSON file

Time: ~10-15 minutes
Questions? Contact me at: YOUR_EMAIL

Thank you for participating!
```

## 🔄 Updating After Deployment

To update the app after deployment:

### Via Web Interface:
1. Go to your repo on GitHub
2. Navigate to the file you want to change
3. Click pencil icon ✏️
4. Make changes
5. Commit
6. Wait 1-2 minutes for redeployment

### Via Command Line:
```bash
# Make your changes locally
# Then:
git add .
git commit -m "Description of changes"
git push

# Wait 1-2 minutes for redeployment
```

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ URL loads without errors
- ✅ All 10 stands display
- ✅ Decisions can be made and recorded
- ✅ Export downloads JSON file
- ✅ Resume works after browser refresh
- ✅ Supervisor can access and test

## 🚀 Next Steps After Deployment

1. ✅ Test the deployed app yourself
2. ✅ Share with supervisor for feedback
3. ⏭️ (Optional) Set up Firebase for cloud storage
4. ⏭️ Share with participants
5. ⏭️ Monitor data collection
6. ⏭️ Export and analyze results

---

**Need help?** See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for detailed step-by-step instructions.
