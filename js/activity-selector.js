// Activity Selector - Mirrors SoCoABE's select_activity.js logic
// This module is for reference - actual logic is in data-loader.js

const ActivitySelector = {
    /**
     * Get available activities based on stand phase
     * This mirrors the activity_distributions.json structure
     */
    getActivitiesByPhase(activityClass) {
        const phaseActivities = {
            'planting': ['planting', 'noManagement'],
            'tending': ['tending', 'noManagement'],
            'thinning': ['thinningFromBelow', 'selectiveThinning', 'plenter_thinning', 'noManagement'],
            'harvesting': ['shelterwood', 'targetDBH', 'clearcut', 'plenter_harvest', 'femel', 'noManagement']
        };

        return phaseActivities[activityClass.toLowerCase()] || ['noManagement'];
    },

    /**
     * Check if an activity is valid for a stand
     */
    isActivityValid(activity, stand, agent) {
        const availableActivities = DataLoader.getAvailableActivities(stand, agent);
        return availableActivities.includes(activity);
    },

    /**
     * Get "recommended" activity based on model weights
     * (Highest probability from Dirichlet sample)
     */
    getModelRecommendation(stand, agent) {
        const weights = DataLoader.getActivityWeights(stand, agent);
        if (!weights || Object.keys(weights).length === 0) {
            return 'noManagement';
        }

        // Find activity with highest weight
        let maxActivity = 'noManagement';
        let maxWeight = 0;

        for (const [activity, weight] of Object.entries(weights)) {
            if (weight > maxWeight) {
                maxWeight = weight;
                maxActivity = activity;
            }
        }

        return maxActivity;
    }
};
