// Enhanced Data Loader - with parameter support

const DataLoader = {
    gameData: null,
    loaded: false,

    async load() {
        try {
            const response = await fetch('config/game_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.gameData = await response.json();
            this.loaded = true;

            console.log('Game data loaded:', {
                agents: this.gameData.agents.length,
                stands: this.gameData.stands.length
            });

            return this.gameData;
        } catch (error) {
            console.error('Error loading game data:', error);
            throw error;
        }
    },

    getAgents() {
        if (!this.loaded) throw new Error('Data not loaded yet');
        return this.gameData.agents;
    },

    getAgent(agentId) {
        return this.getAgents().find(a => a.agent_id === agentId);
    },

    getStandsForAgent(agentId) {
        if (!this.loaded) throw new Error('Data not loaded yet');
        const agent = this.getAgent(agentId);
        if (!agent) return [];
        return this.gameData.stands.filter(s => agent.stand_ids.includes(s.stand_id));
    },

    getActivityDistributions() {
        if (!this.loaded) throw new Error('Data not loaded yet');
        return this.gameData.config.activities;
    },

    getParameterDistributions() {
        if (!this.loaded) throw new Error('Data not loaded yet');
        return this.gameData.config.parameters;
    },

    /**
     * Get available activities for a specific phase
     * (Simplified - just based on phase, not full owner/structure lookup)
     */
    getAvailableActivitiesForPhase(phase, structureClass, agent) {
        // Match R file exactly: act_orders from activities_guess.R
        const phaseActivities = {
            'Harvesting': ['shelterwood', 'targetDBH', 'clearcut', 'plenter_harvest', 'femel', 'noManagement'],
            'Thinning': ['selectiveThinning', 'fromBelow', 'plenter_thinning', 'noManagement'],
            'Tending': ['tending', 'noManagement'],
            'Planting': ['planting', 'noManagement']
        };

        // Base activities for phase
        let activities = phaseActivities[phase] || ['noManagement'];

        // Filter based on structure (only plenter activities need high complexity)
        if (structureClass === 'low') {
            activities = activities.filter(a => !['plenter_harvest', 'plenter_thinning'].includes(a));
        }

        return activities;
    },

    /**
     * Get parameter configuration for an activity
     */
    getParameterConfig(activity, preferenceFocus, agent) {
        const paramDist = this.getParameterDistributions();

        // Structure: parameters[owner_type][activity][preference]
        const ownerParams = paramDist[agent.owner_type] || paramDist['all'];
        if (!ownerParams) return null;

        const activityParams = ownerParams[activity];
        if (!activityParams) return null;

        const prefParams = activityParams[preferenceFocus];
        if (!prefParams) return null;

        return prefParams;
    },

    /**
     * Sample default parameter values from distributions
     */
    sampleDefaultParameters(paramConfig) {
        if (!paramConfig) return {};

        const defaults = {};

        for (const [paramName, distConfig] of Object.entries(paramConfig)) {
            const sampled = Distributions.sample(distConfig);
            defaults[paramName] = sampled;
        }

        return defaults;
    },

    /**
     * Get parameter metadata (ranges, types, descriptions)
     * Uses the comprehensive ParameterMetadata object from parameter-metadata.js
     */
    getParameterMetadata(activity) {
        return ParameterMetadata[activity] || {};
    }
};
