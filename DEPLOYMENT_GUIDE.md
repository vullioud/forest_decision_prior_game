# Deployment Guide - Share with Your Supervisor

## ✅ Features Now Working

1. **Auto-save** - Progress saved after every decision
2. **Resume** - Close browser and come back later
3. **Save & Exit** - Download partial data anytime
4. **No data loss** - Everything captured, even incomplete sessions

---

## 🚀 Simplest Way to Deploy (GitHub Pages)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `forest-decision-game` (or any name)
3. **Public** repository
4. Don't initialize with README
5. Click "Create repository"

### Step 2: Upload Files

**Option A: Using GitHub Web Interface** (Easiest)

1. In your new repository, click "uploading an existing file"
2. Drag and drop the **entire `forest-decision-game` folder**
3. Write commit message: "Initial commit"
4. Click "Commit changes"

**Option B: Using Git** (if you have git installed)

```bash
cd forest-decision-game
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forest-decision-game.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, click **Settings**
2. Scroll to **Pages** (left sidebar)
3. Under "Source", select **main branch**
4. Click **Save**
5. Wait 1-2 minutes

### Step 4: Get Your URL

Your game will be live at:
```
https://YOUR_USERNAME.github.io/forest-decision-game/
```

Example: If your username is `jdoe`:
```
https://jdoe.github.io/forest-decision-game/
```

---

## 📧 Share with Supervisor

Send this email:

```
Subject: Forest Decision Study - Review Request

Hi [Supervisor Name],

I've set up the forest manager decision study game for review.

**Access it here:**
https://YOUR_USERNAME.github.io/forest-decision-game/

**Features:**
- 10 stands across 4 management phases
- Full parameter configuration for all activities
- Auto-saves progress (can exit and resume)
- Downloads data as JSON

**Instructions:**
1. Click "Start Session"
2. Follow the prompts to make decisions
3. Can exit anytime using "Save & Exit"
4. Data is automatically downloaded when complete

**Technical Details:**
- All parameters mapped from SoCoABE model
- Intelligent sampling to cover all 144 decision contexts
- No backend required - runs entirely in browser
- Data stored locally and downloadable

Please let me know if you have any feedback!

Best regards,
[Your Name]
```

---

## 🔧 Alternative: Share Locally (No GitHub)

If you want to test with supervisor **without deploying**, use Python's built-in server:

### Windows:
```bash
cd forest-decision-game
python -m http.server 8000
```

### Then share:
1. Find your local IP: `ipconfig` (look for "IPv4 Address")
2. Share URL: `http://YOUR_IP:8000`
3. Supervisor must be on same network (e.g., office WiFi)

---

## 📊 Collecting Data

### From Participants

After each session, participants will have:

1. **Auto-downloaded JSON** - `forest_decisions_<session_id>.json`
2. **Partial save** (if they used "Save & Exit") - `forest_decisions_PARTIAL_<session_id>.json`

### Participants Should:
- Email you the JSON file(s)
- OR upload to shared folder (Google Drive, Dropbox, etc.)

### You Process in R:
```r
library(jsonlite)

# Read one file
data <- fromJSON("forest_decisions_abc123.json")

# Read all files in folder
files <- list.files("data/", pattern = "forest_decisions.*\\.json$", full.names = TRUE)
all_data <- lapply(files, fromJSON)

# Combine decisions
all_decisions <- do.call(rbind, lapply(all_data, function(x) x$decisions))
```

---

## 🎯 What Supervisor Will See

1. **Welcome screen** with instructions
2. **Agent profile** (owner type, preferences)
3. **Portfolio overview** (10 stands)
4. **Sequential decisions** (activity → parameters)
5. **Progress saved** automatically
6. **Final summary** with download

---

## ⚡ Quick Test Yourself

Before sharing:

1. Open `index.html` in browser
2. Make a few decisions
3. Click "Save & Exit" → Should download JSON
4. Reload page → Should see "Resume Session" prompt
5. Click "Resume" → Should continue where you left off

---

## 🆘 Troubleshooting

### Game won't load
- Check browser console (F12) for errors
- Make sure `config/game_data.json` exists
- Try different browser (Chrome recommended)

### GitHub Pages not working
- Wait 5 minutes after enabling
- Check Settings → Pages for errors
- Verify repository is public

### Can't resume session
- Check if localStorage is enabled in browser
- Private/Incognito mode won't save
- Different browser = different storage

---

## 📈 Next Steps (Optional)

After supervisor feedback:

1. **Collect more data** → Share with more forest managers
2. **Add backend** → Auto-upload to database (see Firebase guide)
3. **Analytics dashboard** → Track coverage in real-time
4. **Custom domain** → `foreststudy.yourdomain.com`

---

## ✅ You're Ready!

Everything is set up:
- ✅ Game working
- ✅ Parameters correct
- ✅ Save/Resume working
- ✅ Data exportable
- ✅ Ready to deploy

Just choose: GitHub Pages (public) or local server (testing).
