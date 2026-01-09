// Utility Functions for Forest Decision Game

const Utils = {
    /**
     * Generate a UUID v4
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Get or create agent usage tracking
     */
    getAgentUsage() {
        const stored = localStorage.getItem('forestGame_agentUsage');
        return stored ? JSON.parse(stored) : {};
    },

    /**
     * Update agent usage counter
     */
    updateAgentUsage(agentId) {
        const usage = this.getAgentUsage();
        usage[agentId] = (usage[agentId] || 0) + 1;
        localStorage.setItem('forestGame_agentUsage', JSON.stringify(usage));
        return usage[agentId];
    },

    /**
     * Find least-used agent for balanced coverage
     */
    getLeastUsedAgent(agents) {
        const usage = this.getAgentUsage();

        return agents.reduce((leastUsed, agent) => {
            const agentUses = usage[agent.agent_id] || 0;
            const leastUses = usage[leastUsed.agent_id] || 0;
            return agentUses < leastUses ? agent : leastUsed;
        });
    },

    /**
     * Format percentage
     */
    formatPercent(value) {
        return Math.round(value * 100) + '%';
    },

    /**
     * Format number to 1 decimal place
     */
    formatDecimal(value, decimals = 1) {
        return value.toFixed(decimals);
    },

    /**
     * Get dominant key from preferences object
     */
    getDominantPreference(preferences) {
        let maxKey = null;
        let maxValue = -1;

        for (const [key, value] of Object.entries(preferences)) {
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
        }

        return maxKey;
    },

    /**
     * Shuffle array (Fisher-Yates)
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Deep copy object
     */
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Download JSON file
     */
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Format duration in seconds to readable string
     */
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    },

    /**
     * Capitalize first letter
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};
