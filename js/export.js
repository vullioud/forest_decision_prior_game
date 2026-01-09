// Export Module - Handle session data export

const Exporter = {
    /**
     * Export session data as JSON file
     */
    exportJSON(sessionData, filename) {
        Utils.downloadJSON(sessionData, filename);
    },

    /**
     * Optional: Upload to server (for future use)
     */
    async uploadToServer(sessionData, serverUrl) {
        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    /**
     * Validate session data before export
     */
    validateSession(sessionData) {
        const required = ['session_id', 'agent', 'decisions'];
        const missing = required.filter(field => !sessionData[field]);

        if (missing.length > 0) {
            console.error('Missing required fields:', missing);
            return false;
        }

        if (sessionData.decisions.length === 0) {
            console.error('No decisions recorded');
            return false;
        }

        return true;
    }
};
