// Session Manager - Save/Resume Progress & Auto-save Partial Data

const SessionManager = {

    STORAGE_KEY: 'forestGame_currentSession',
    AUTOSAVE_INTERVAL: 30000, // Auto-save every 30 seconds
    autosaveTimer: null,

    /**
     * Save current session state
     */
    saveSession(gameState) {
        const sessionData = {
            sessionId: gameState.sessionId,
            sessionStart: gameState.sessionStart?.toISOString(),
            currentAgent: gameState.currentAgent,
            stands: gameState.stands,
            allDecisions: gameState.allDecisions,
            currentStandIndex: gameState.currentStandIndex,
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
        console.log('[SessionManager] Session saved:', sessionData.allDecisions.length, 'decisions');
        return sessionData;
    },

    /**
     * Load saved session
     */
    loadSession() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) return null;

        try {
            const session = JSON.parse(stored);
            console.log('[SessionManager] Session found:', session.allDecisions.length, 'decisions');
            return session;
        } catch (e) {
            console.error('[SessionManager] Error loading session:', e);
            return null;
        }
    },

    /**
     * Check if there's a saved session
     */
    hasSavedSession() {
        return !!this.loadSession();
    },

    /**
     * Clear saved session
     */
    clearSession() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('[SessionManager] Session cleared');
    },

    /**
     * Start auto-save timer
     */
    startAutoSave(gameEngine) {
        if (this.autosaveTimer) {
            clearInterval(this.autosaveTimer);
        }

        this.autosaveTimer = setInterval(() => {
            this.saveSession(gameEngine);
        }, this.AUTOSAVE_INTERVAL);

        console.log('[SessionManager] Auto-save started (every 30s)');
    },

    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
        if (this.autosaveTimer) {
            clearInterval(this.autosaveTimer);
            this.autosaveTimer = null;
            console.log('[SessionManager] Auto-save stopped');
        }
    },

    /**
     * Export partial session data (even if not complete)
     */
    exportPartialSession(gameEngine) {
        const sessionData = gameEngine.generateSessionData();

        // Mark as partial
        sessionData.status = 'partial';
        sessionData.decisions_collected = gameEngine.allDecisions.length;
        sessionData.last_stand_index = gameEngine.currentStandIndex;

        const filename = `forest_decisions_PARTIAL_${gameEngine.sessionId}.json`;
        Utils.downloadJSON(sessionData, filename);

        console.log('[SessionManager] Partial session exported:', filename);
        return filename;
    },

    /**
     * Get session info for display
     */
    getSessionInfo() {
        const session = this.loadSession();
        if (!session) return null;

        const decisionsCount = session.allDecisions?.length || 0;
        const totalStands = session.stands?.length || 0;
        const currentStand = session.currentStandIndex + 1;
        const lastSaved = new Date(session.lastSaved);

        return {
            decisionsCount,
            totalStands,
            currentStand,
            lastSaved,
            timeSinceLastSave: Math.round((new Date() - lastSaved) / 1000 / 60) // minutes
        };
    }
};
