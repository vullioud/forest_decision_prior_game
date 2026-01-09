# Quick Deployment Guide

Deploy your Forest Decision Study app in 5 minutes using GitHub Pages.

## Prerequisites
- GitHub account
- All app files ready to deploy

## Step 1: Create GitHub Repository (2 minutes)

### Option A: GitHub Web Interface (Easiest)
1. Go to [github.com](https://github.com)
2. Click the **+** icon → "New repository"
3. Name: `forest-decision-study`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README
6. Click "Create repository"

### Option B: Command Line (If you have git installed)
```bash
cd forest-decision-game
git init
git add .
git commit -m "Initial commit - Forest Decision Study"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forest-decision-study.git
git push -u origin main
```

## Step 2: Upload Files (1 minute)

### If Using Web Interface:
1. On your new repo page, click "uploading an existing file"
2. Drag and drop your entire `forest-decision-game` folder
3. Make sure you upload:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `config/` folder
4. Add commit message: "Add forest decision study app"
5. Click "Commit changes"

### If Using Command Line:
Already done in Step 1 Option B!

## Step 3: Enable GitHub Pages (1 minute)

1. Go to your repository settings (Settings tab)
2. Scroll down to "Pages" in left sidebar
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"
5. Wait 30-60 seconds for deployment

## Step 4: Get Your URL (30 seconds)

Your app will be available at:
```
https://YOUR_USERNAME.github.io/forest-decision-study/
```

GitHub will show the URL at the top of the Pages settings.

**Example:**
- If your username is `jsmith`
- URL: `https://jsmith.github.io/forest-decision-study/`

## Step 5: Test the Deployed App (1 minute)

1. Open the URL in your browser
2. You should see the welcome screen
3. Make a test decision
4. Check that everything works:
   - ✅ Activity selection
   - ✅ Parameter sliders
   - ✅ Save & Exit
   - ✅ Resume session
   - ✅ JSON export

## Step 6: Share with Supervisor

Send your supervisor the URL with instructions:

```
Hi [Supervisor],

The Forest Decision Study app is now ready for review:
🔗 https://YOUR_USERNAME.github.io/forest-decision-study/

Instructions:
1. Open the link in any modern browser (Chrome, Firefox, Edge)
2. Select stands and make management decisions
3. You can exit anytime - progress auto-saves
4. Complete session exports data as JSON for analysis

Technical details:
- 10 stands per session
- 4 phases: Planting → Tending → Thinning → Harvesting
- All parameters match our SoCoABE model distributions
- Data collected: activity choices + parameter values + decision contexts

Let me know if you have any feedback!
```

## Updating the App

When you make changes:

### Web Interface:
1. Go to repository
2. Navigate to file you want to change
3. Click pencil icon ✏️ to edit
4. Make changes
5. Commit changes
6. Wait 1-2 minutes for GitHub Pages to rebuild

### Command Line:
```bash
# Make your changes to files
git add .
git commit -m "Description of changes"
git push
# Wait 1-2 minutes for deployment
```

## Troubleshooting

### Page shows repository README instead of app
- Check that `index.html` is in the root directory
- Make sure you selected `/ (root)` not `/docs` in Pages settings

### CSS not loading (page looks unstyled)
- Check that `css/styles.css` exists
- Verify file paths are relative: `css/styles.css` not `/css/styles.css`

### JavaScript errors
- Open browser console (F12)
- Check for "404 Not Found" errors
- Verify all `js/` files were uploaded

### Firebase not working
- Firebase works with GitHub Pages
- Just add your config to `js/firebase-config.js`
- Make sure you completed [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

### Game data not loading
- Check that `config/game_data.json` exists
- File paths must be relative
- Verify JSON is valid (use jsonlint.com)

## Advanced: Custom Domain (Optional)

If you want `foreststudy.yourdomain.com` instead of GitHub URL:

1. Buy domain (Namecheap, Google Domains, etc.)
2. Add `CNAME` file to root with your domain
3. Go to repo Settings → Pages → Custom domain
4. Enter your domain and save
5. Update DNS records (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))

## Alternative Hosting Options

If you can't use GitHub Pages:

### Netlify (Also free)
1. Drag & drop folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Get instant URL
3. Even easier than GitHub Pages!

### Vercel (Also free)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in your folder
3. Follow prompts

### Your University Server
If you have web hosting through your university:
1. Upload files via FTP/SFTP
2. Make sure it's accessible via HTTPS
3. Works the same way

## Security Notes

✅ **No sensitive data in code**: All config is client-side
✅ **Firebase rules**: Secure your database after testing
✅ **HTTPS**: GitHub Pages uses HTTPS automatically
✅ **No API keys to hide**: Firebase API key is public by design (security is in Firebase rules)

## Cost

**GitHub Pages: FREE**
- Unlimited bandwidth
- Automatic SSL
- CDN included
- 100GB soft limit on repo size (your app is <10MB)

**Firebase: FREE** (up to limits)
- 1GB database
- 10GB downloads/month
- Easily handles 100+ participants

**Total cost: $0** 🎉

---

## Quick Summary

```bash
# 1. Create repo on GitHub
# 2. Upload files
# 3. Enable Pages in Settings
# 4. Share URL: https://username.github.io/forest-decision-study/
# Done! ✨
```

**Next step:** Complete [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to enable cloud storage.
