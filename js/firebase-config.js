// Firebase Configuration for Decision Collection
// This file stores decisions to Firebase Realtime Database

const FirebaseStorage = {
    initialized: false,
    db: null,

    /**
     * Initialize Firebase (call this once at startup)
     * NOTE: You need to add your Firebase config here
     */
    async init() {
        // TODO: Replace with your Firebase config from Firebase Console
        // Get this from: Firebase Console > Project Settings > Your Apps > Config
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT.firebaseapp.com",
            databaseURL: "https://YOUR_PROJECT.firebaseio.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT.appspot.com",
            messagingSenderId: "YOUR_SENDER_ID",
            appId: "YOUR_APP_ID"
        };

        try {
            // Initialize Firebase
            if (typeof firebase !== 'undefined' && !this.initialized) {
                firebase.initializeApp(firebaseConfig);
                this.db = firebase.database();
                this.initialized = true;
                console.log('[Firebase] Initialized successfully');
                return true;
            }
        } catch (error) {
            console.error('[Firebase] Initialization failed:', error);
            return false;
        }
    },

    /**
     * Save a single decision to Firebase
     */
    async saveDecision(decision) {
        if (!this.initialized) {
            console.warn('[Firebase] Not initialized, skipping save');
            return false;
        }

        try {
            const decisionRef = this.db.ref('decisions').push();
            await decisionRef.set({
                ...decision,
                uploaded_at: firebase.database.ServerValue.TIMESTAMP
            });
            console.log('[Firebase] Decision saved:', decision.decision_id);
            return true;
        } catch (error) {
            console.error('[Firebase] Error saving decision:', error);
            return false;
        }
    },

    /**
     * Save complete session data to Firebase
     */
    async saveSession(sessionData) {
        if (!this.initialized) {
            console.warn('[Firebase] Not initialized, skipping session save');
            return false;
        }

        try {
            const sessionRef = this.db.ref('sessions').push();
            await sessionRef.set({
                ...sessionData,
                uploaded_at: firebase.database.ServerValue.TIMESTAMP
            });
            console.log('[Firebase] Session saved:', sessionData.session_id);
            return true;
        } catch (error) {
            console.error('[Firebase] Error saving session:', error);
            return false;
        }
    },

    /**
     * Get all decisions from Firebase (for analysis)
     */
    async getAllDecisions() {
        if (!this.initialized) {
            console.warn('[Firebase] Not initialized');
            return [];
        }

        try {
            const snapshot = await this.db.ref('decisions').once('value');
            const decisions = [];
            snapshot.forEach(child => {
                decisions.push({
                    firebase_id: child.key,
                    ...child.val()
                });
            });
            console.log('[Firebase] Retrieved', decisions.length, 'decisions');
            return decisions;
        } catch (error) {
            console.error('[Firebase] Error retrieving decisions:', error);
            return [];
        }
    },

    /**
     * Export all decisions as JSON
     */
    async exportAllDecisions() {
        const decisions = await this.getAllDecisions();
        const filename = `firebase_export_${new Date().toISOString().slice(0,10)}.json`;
        Utils.downloadJSON(decisions, filename);
        return decisions;
    }
};
