// Game Engine V4 - Bug Fixes & Simplified Phase System

const GameEngine = {
    // State
    currentAgent: null,
    currentStandIndex: 0,
    stands: [],
    allDecisions: [],
    sessionStart: null,
    sessionId: null,
    maxStands: 10,

    // Current decision tracking
    currentStand: null,
    currentActivity: null,
    decisionStartTime: null,

    // Phase names
    phaseNames: ['Planting', 'Tending', 'Thinning', 'Harvesting'],

    async init() {
        console.log('=== Initializing Game V4 ===');
        try {
            await DataLoader.load();

            // Initialize Firebase (if available)
            if (typeof FirebaseStorage !== 'undefined') {
                await FirebaseStorage.init();
            }

            // Check for saved session
            if (SessionManager.hasSavedSession()) {
                UIRenderer.showResumePrompt();
            } else {
                this.startNewSession();
            }
        } catch (error) {
            console.error('Init failed:', error);
            UIRenderer.showError('Failed to load: ' + error.message);
        }
    },

    startNewSession() {
        this.sessionId = Utils.generateUUID();
        this.sessionStart = new Date();
        this.assignAgent();
        SessionManager.startAutoSave(this);
        UIRenderer.showWelcomeScreen();
    },

    resumeSession() {
        const saved = SessionManager.loadSession();
        if (!saved) {
            this.startNewSession();
            return;
        }

        // Restore state
        this.sessionId = saved.sessionId;
        this.sessionStart = new Date(saved.sessionStart);
        this.currentAgent = saved.currentAgent;
        this.stands = saved.stands;
        this.allDecisions = saved.allDecisions;
        this.currentStandIndex = saved.currentStandIndex;

        console.log(`Resumed session: ${this.allDecisions.length} decisions already made`);

        SessionManager.startAutoSave(this);

        // Continue where we left off
        if (this.currentStandIndex >= this.stands.length) {
            // Was in phase advancement
            this.advancePhases();
        } else {
            this.showCurrentStand();
        }
    },

    assignAgent() {
        const agents = DataLoader.getAgents();
        this.currentAgent = Utils.getLeastUsedAgent(agents);

        // Load all stands for this agent
        let allStands = DataLoader.getStandsForAgent(this.currentAgent.agent_id);

        // Use CoverageTracker to select stands that maximize coverage
        this.stands = CoverageTracker.selectStands(allStands, this.currentAgent, this.maxStands);

        // Initialize each stand with a starting phase (0-3)
        this.stands = this.stands.map((stand, i) => ({
            ...stand,
            current_phase_index: Math.floor(Math.random() * 4), // Random starting phase
            species_simple: this.simplifySpecies(stand.species_profile, stand.preference_focus)
        }));

        console.log(`Agent: ${this.currentAgent.agent_id}, Stands: ${this.stands.length}`);
        console.log('Coverage report:', CoverageTracker.getCoverageReport());
        Utils.updateAgentUsage(this.currentAgent.agent_id);
    },

    simplifySpecies(speciesProfile, preference) {
        // Simplify: Mixed (60%), Conifer (Production focus), Broadleaf (CO2 focus)
        const rand = Math.random();

        if (rand < 0.6) {
            return 'Mixed';
        } else if (preference === 'Production') {
            return 'Conifer';
        } else if (preference === 'CO2') {
            return 'Broadleaf';
        } else {
            return 'Mixed';
        }
    },

    startGame() {
        this.allDecisions = [];
        this.currentStandIndex = 0;
        UIRenderer.showAgentProfile(this.currentAgent, this.stands.length);
    },

    startRound() {
        console.log('=== Starting New Round ===');
        this.currentStandIndex = 0;

        // Show portfolio
        UIRenderer.showPortfolio(this.stands, this.currentAgent);
    },

    startDecisions() {
        console.log('=== Starting Decisions ===');
        this.currentStandIndex = 0;
        this.showCurrentStand();
    },

    showCurrentStand() {
        if (this.currentStandIndex >= this.stands.length) {
            // All stands done - advance phases and continue or finish
            this.advancePhases();
            return;
        }

        this.currentStand = this.stands[this.currentStandIndex];
        this.decisionStartTime = performance.now();

        const phaseName = this.phaseNames[this.currentStand.current_phase_index];
        console.log(`Stand ${this.currentStandIndex + 1}/${this.stands.length}, Phase: ${phaseName}`);

        const availableActivities = DataLoader.getAvailableActivitiesForPhase(
            phaseName,
            this.currentStand.structure_class,
            this.currentAgent
        );

        console.log('Available activities:', availableActivities);

        UIRenderer.showActivitySelection(
            this.currentStand,
            phaseName,
            availableActivities,
            this.currentStandIndex + 1,
            this.stands.length
        );
    },

    // Called when activity is selected
    onActivitySelected(activity) {
        console.log('=== Activity Selected:', activity);
        this.currentActivity = activity;

        // Check if needs parameters
        if (this.needsParameters(activity)) {
            console.log('Activity needs parameters, showing parameter screen');
            this.showParameterScreen();
        } else {
            console.log('Activity has no parameters, recording and moving on');
            this.recordAndContinue({});
        }
    },

    showParameterScreen() {
        const paramConfig = DataLoader.getParameterConfig(
            this.currentActivity,
            this.currentStand.preference_focus,
            this.currentAgent
        );

        console.log('Parameter config:', paramConfig);

        UIRenderer.showParameterSelection(
            this.currentStand,
            this.currentActivity,
            paramConfig,
            this.currentStandIndex + 1,
            this.stands.length
        );
    },

    // Called when parameters are confirmed
    onParametersConfirmed(parameters) {
        console.log('=== Parameters Confirmed:', parameters);
        this.recordAndContinue(parameters);
    },

    recordAndContinue(parameters) {
        // Record decision
        const decisionTime = Math.round(performance.now() - this.decisionStartTime);

        const decision = {
            decision_id: this.allDecisions.length + 1,
            timestamp: new Date().toISOString(),
            stand_id: this.currentStand.stand_id,
            phase: this.phaseNames[this.currentStand.current_phase_index],
            stand_context: {
                structure_class: this.currentStand.structure_class,
                species_simple: this.currentStand.species_simple,
                preference_focus: this.currentStand.preference_focus,
                owner_type: this.currentAgent.owner_type
            },
            chosen_activity: this.currentActivity,
            parameters: parameters,
            decision_time_ms: decisionTime
        };

        this.allDecisions.push(decision);
        console.log('Decision recorded:', decision);

        // Update coverage tracking
        CoverageTracker.updateCoverage(
            this.currentAgent.owner_type,
            this.currentStand.structure_class,
            this.currentStand.current_phase_index,
            this.currentStand.preference_focus
        );

        // Auto-save after each decision
        SessionManager.saveSession(this);

        // Upload to Firebase (if available)
        if (typeof FirebaseStorage !== 'undefined' && FirebaseStorage.initialized) {
            FirebaseStorage.saveDecision(decision).catch(err => {
                console.warn('[Firebase] Upload failed, continuing locally:', err);
            });
        }

        // Move to next stand
        this.currentStandIndex++;
        this.showCurrentStand();
    },

    saveAndExit() {
        SessionManager.saveSession(this);
        SessionManager.exportPartialSession(this);
        alert('Progress saved! You can resume later by reopening this page.\nPartial data also downloaded as backup.');
    },

    advancePhases() {
        console.log('=== Advancing All Phases ===');

        // Advance each stand's phase
        this.stands.forEach(stand => {
            if (stand.current_phase_index < 3) {
                stand.current_phase_index++;
            }
        });

        // Check if all stands are at phase 3 (Harvesting) and done
        const allAtEnd = this.stands.every(s => s.current_phase_index === 3);
        const decisionsThisRound = this.allDecisions.filter(d =>
            this.stands.find(s => s.stand_id === d.stand_id &&
                              this.phaseNames[s.current_phase_index] === d.phase)
        );

        if (allAtEnd && decisionsThisRound.length === this.stands.length) {
            // Session complete
            console.log('=== Session Complete ===');
            this.showFinalSummary();
        } else {
            // Continue to next round
            UIRenderer.showRoundComplete(this.allDecisions.slice(-this.stands.length));
        }
    },

    nextRound() {
        console.log('=== Next Round ===');
        this.startRound();
    },

    showFinalSummary() {
        const sessionData = this.generateSessionData();
        UIRenderer.showFinalSummary(sessionData, this.allDecisions);
    },

    generateSessionData() {
        const now = new Date();
        const duration = Math.floor((now - this.sessionStart) / 1000);

        return {
            session_id: this.sessionId,
            timestamp_start: this.sessionStart.toISOString(),
            timestamp_end: now.toISOString(),
            duration_seconds: duration,
            version: '3.0.0-simplified',

            agent: {
                agent_id: this.currentAgent.agent_id,
                owner_type: this.currentAgent.owner_type,
                preferences: this.currentAgent.preferences,
                resources: this.currentAgent.resources,
                risk_tolerance: this.currentAgent.risk_tolerance
            },

            game_config: {
                n_stands: this.stands.length,
                total_decisions: this.allDecisions.length
            },

            decisions: this.allDecisions
        };
    },

    exportSession() {
        const sessionData = this.generateSessionData();
        const filename = `forest_decisions_${this.sessionId}.json`;
        Utils.downloadJSON(sessionData, filename);
        console.log('Exported:', filename);

        // Upload to Firebase (if available)
        if (typeof FirebaseStorage !== 'undefined' && FirebaseStorage.initialized) {
            FirebaseStorage.saveSession(sessionData).then(() => {
                console.log('[Firebase] Complete session uploaded');
            }).catch(err => {
                console.warn('[Firebase] Session upload failed:', err);
            });
        }
    },

    needsParameters(activity) {
        // All activities EXCEPT noManagement and clearcut have parameters
        const noParamActivities = ['noManagement'];
        return !noParamActivities.includes(activity);
    }
};
