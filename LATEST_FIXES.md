# Latest Fixes - Activity Names & Femel

## ✅ Fixed Issues

### 1. Femel Now Shows in Harvesting ✅
**Problem**: Femel (Gap Harvest) was filtered out for low structure stands
**Fix**: Removed femel from structure filter - now always available in Harvesting phase

### 2. Activity Names Match R File ✅
**Problem**: Used `thinningFromBelow` but R file says `fromBelow`
**Fix**: Updated to match exact names from `activities_guess.R`:

```r
act_orders <- list(
  harvesting = c("shelterwood", "targetDBH", "clearcut", "plenter_harvest", "femel", "noManagement"),
  thinning   = c("selectiveThinning", "fromBelow", "plenter_thinning", "noManagement"),
  tending    = c("tending", "noManagement"),
  planting   = c("planting", "noManagement")
)
```

Now game uses:
- Harvesting: shelterwood, targetDBH, clearcut, plenter_harvest, **femel**, noManagement
- Thinning: selectiveThinning, **fromBelow**, plenter_thinning, noManagement

### 3. Activity Display Names ✅
- `fromBelow` → **"Thinning from Below"**
- `femel` → **"Gap Harvest (Femel)"**

---

## 📋 Species Selection (Current Approach)

**Current**: Uses profiles (broadleaved, conifers, mixed, no_profile)

This matches the model structure in `parameter_distributions.json` where `species_profile` is categorical.

**All Species Available** (137 species):
- Stored in `js/species-data.js`
- Grouped by type (broadleaved, conifers, pines, oaks, etc.)
- Can be used for future enhancements

**If you want users to select individual species:**
1. Change `species_profile` from dropdown to multi-select checkboxes
2. Store as array of species codes: `["piab", "fasy", "abba"]`
3. More complex UI but more flexible

**Recommendation**: Keep profiles for now (simpler, matches model). Can add species multi-select later if needed.

---

## 🧪 Test the Fixes

1. Open [index.html](index.html)
2. Go to Harvesting phase
3. **Should see**: Femel in activity list ✓
4. Go to Thinning phase
5. **Should see**: "Thinning from Below" (fromBelow) ✓

---

## 📁 Files Changed

1. **`js/data-loader-v2.js`**
   - Fixed activity names (fromBelow not thinningFromBelow)
   - Removed femel from structure filter

2. **`js/parameter-metadata.js`**
   - Renamed `thinningFromBelow` → `fromBelow`

3. **`js/ui-renderer-v5.js`**
   - Added `fromBelow` to activity names
   - Updated femel display name

4. **`js/species-data.js`** (NEW)
   - Full species list for reference
   - Grouped by type
   - Ready for future multi-select

---

## ✅ All Fixed!

- ✓ Femel shows in Harvesting
- ✓ Activity names match R file
- ✓ Species data available
- ✓ Everything still working (save/resume, parameters, etc.)
