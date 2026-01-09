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
        // Firebase configuration from Firebase Console
        const firebaseConfig = {
            apiKey: "AIzaSyAQlpXVD1PGJLuF1uMwUrqj2naH0bjwWiI",
            authDomain: "forest-prior-game.firebaseapp.com",
            databaseURL: "https://forest-prior-game-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "forest-prior-game",
            storageBucket: "forest-prior-game.firebasestorage.app",
            messagingSenderId: "944426769960",
            appId: "1:944426769960:web:ba59b7dbfcc24237eedf1d",
            measurementId: "G-3W263CKJWC"
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
