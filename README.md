# Forest Manager Decision Study

A web-based serious game to collect forest management decisions from expert forest managers to inform the SoCoABE (Social-ecological Coupled Agent-Based model) distributions.

## Overview

This application presents forest managers with realistic stand conditions and collects their management decisions across four forest management phases:
- **Planting** - Establishing new forest stands
- **Tending** - Early-stage management
- **Thinning** - Mid-rotation management
- **Harvesting** - Final harvest decisions

The game collects:
- Activity choices for each stand and phase
- Parameter values (timing, intensity, species preferences)
- Decision context (stand structure, species, owner preferences)
- Decision time for each choice

## Core Principle
**Show experts EXACTLY what the model sees - nothing more, nothing less.**

Players make the same decisions the SoCoABE agents make, given the same information the model uses. Their choices inform our activity and parameter distributions.

## Data Flow

```
SoCoABE Model Data → Game → Expert Decisions → JSON Export → R Scripts → Updated Distributions → SoCoABE Model
```

## Quick Start

### Play the Game

1. Open `index.html` in a modern web browser
2. Review the forest owner profile
3. Make management decisions for 10 stands across 4 phases
4. Export your decisions as JSON at the end

### Deploy Online (5 minutes)

See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for step-by-step GitHub Pages deployment.

### Enable Cloud Storage (Optional, 5 minutes)

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to set up Firebase for automatic data collection.

## Features

### ✅ Realistic Decision Context
- Stand attributes from actual forest data
- Owner preferences (Production, CO2, Biodiversity, Recreation)
- Owner size classes (small, medium, large)
- Stand structure complexity (low, medium, high)

### ✅ Phase-Based Management
- Four distinct management phases
- Phase-appropriate activity choices
- Sequential progression through forest lifecycle

### ✅ Parameter Configuration
- Sliders for timing decisions (stand age)
- Intensity controls (thinning share, removal percentages)
- Species profiles (broadleaved, conifers, mixed)
- All parameters match SoCoABE model distributions

### ✅ Save & Resume
- Auto-save every 30 seconds
- Resume from where you left off
- No data loss if browser closes

### ✅ Intelligent Stand Selection
- Coverage tracking across 144 decision contexts
- Prioritizes under-represented combinations
- Efficient data collection strategy

### ✅ Data Export
- JSON format for R analysis
- Includes full decision context
- Timestamps and decision timing
- Optional cloud backup via Firebase

## Project Structure

```
forest-decision-game/
├── index.html              # Main application entry point
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── game-engine-v4.js   # Core game logic
│   ├── ui-renderer-v5.js   # UI rendering
│   ├── data-loader-v2.js   # Data loading and filtering
│   ├── parameter-metadata.js # Parameter definitions
│   ├── activity-selector.js # Activity selection logic
│   ├── coverage-tracker.js # Decision context tracking
│   ├── session-manager.js  # Save/resume functionality
│   ├── firebase-config.js  # Optional cloud storage
│   ├── distributions.js    # Statistical distributions
│   ├── species-data.js     # Species reference data
│   ├── utils.js            # Helper functions
│   └── export.js           # Data export utilities
├── config/
│   └── game_data.json      # Forest stands and agent data
├── archive/                # Old versions (not needed for deployment)
├── QUICK_DEPLOY.md         # Deployment guide
├── FIREBASE_SETUP.md       # Firebase setup guide
├── LATEST_FIXES.md         # Recent updates
└── README.md               # This file
```

## Data Structure

Each decision is recorded as:
```json
{
  "decision_id": 1,
  "timestamp": "2026-01-09T10:30:00.000Z",
  "stand_id": "stand_12345",
  "phase": "Thinning",
  "stand_context": {
    "structure_class": "medium",
    "species_simple": "Mixed",
    "preference_focus": "Biodiversity",
    "owner_type": "small"
  },
  "chosen_activity": "selectiveThinning",
  "parameters": {
    "execution_schedule": 45,
    "intensity": 0.25,
    "species_profile": "mixed"
  },
  "decision_time_ms": 12340
}
```

## Model Integration

Parameters align with SoCoABE model distributions:
- `execution_schedule` - Stand age for activity execution (normal distribution)
- `intensity` - Removal percentage (beta distribution)
- `thinningShare` - Thinning proportion (beta distribution)
- `times` - Number of repetitions (poisson distribution)
- `interval` - Years between activities (poisson distribution)
- `species_profile` - Species preference (categorical: broadleaved, conifers, mixed, no_profile)

## Usage for Research

### For Participants

1. Open the application URL
2. Review the forest owner profile
3. Make decisions based on your expertise
4. You can exit anytime - progress is saved
5. Complete all phases and export your decisions
6. Send the downloaded JSON file to the researcher

### For Researchers

1. **Deploy** - Host on GitHub Pages (free, 5 minutes)
2. **Share** - Send URL to participants
3. **Monitor** (Optional) - Watch Firebase Console for real-time data
4. **Collect** - Participants export JSON or you download from Firebase
5. **Analyze** - Import JSON to R for analysis

### R Analysis Example

```r
library(jsonlite)
library(tidyverse)

# Import session data
session <- fromJSON("forest_decisions_SESSION_ID.json")

# Extract decisions
decisions <- session$decisions %>% as_tibble()

# Analyze activity choices by phase
decisions %>%
  count(phase, chosen_activity) %>%
  pivot_wider(names_from = phase, values_from = n)

# Analyze parameters by owner type
decisions %>%
  unnest(parameters) %>%
  group_by(stand_context$owner_type, chosen_activity) %>%
  summarize(
    mean_schedule = mean(execution_schedule, na.rm = TRUE),
    mean_intensity = mean(intensity, na.rm = TRUE),
    n = n()
  )
```

## Technical Details

### Technologies
- **Vanilla JavaScript** - No frameworks, fast and simple
- **LocalStorage** - Persistent session storage
- **Firebase** (Optional) - Cloud backup and aggregation
- **GitHub Pages** - Free static hosting

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Documentation

- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Deploy to GitHub Pages in 5 minutes
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Set up cloud storage (optional)
- [LATEST_FIXES.md](LATEST_FIXES.md) - Recent bug fixes and updates
- [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md) - Firebase integration details

## Support

For questions or issues:
1. Check browser console for error messages
2. Verify all files are loaded (check Network tab)
3. Test with fresh localStorage (clear browser data)
4. Review [LATEST_FIXES.md](LATEST_FIXES.md) for known issues

## License

This is research software developed for the SoCoABE project.

---

**Ready to deploy?** See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) to get started in 5 minutes!
