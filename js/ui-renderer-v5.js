// UI Renderer V5 - Clean version with both bugs fixed

const UIRenderer = {
    appContainer: null,

    init() {
        this.appContainer = document.getElementById('app');
    },

    render(html) {
        if (!this.appContainer) this.init();
        this.appContainer.innerHTML = html;
    },

    // SCREEN 0: Resume Prompt
    showResumePrompt() {
        const info = SessionManager.getSessionInfo();

        this.render(`
            <div class="screen welcome-screen">
                <div class="card welcome-card">
                    <h1>Forest Manager Decision Study</h1>
                    <h2 style="color: #2ecc71;">✓ Saved Progress Found</h2>
                    <div class="info-box" style="background: #e8f5e9; border-color: #2ecc71;">
                        <p><strong>${info.decisionsCount} decisions</strong> already made</p>
                        <p>Stand ${info.currentStand} of ${info.totalStands}</p>
                        <p style="font-size: 0.9em; color: #666;">Last saved: ${info.timeSinceLastSave} min ago</p>
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                        <button class="btn btn-primary btn-large" onclick="GameEngine.resumeSession()">
                            Resume Session
                        </button>
                        <button class="btn btn-secondary" onclick="SessionManager.clearSession(); GameEngine.startNewSession()">
                            Start New Session
                        </button>
                    </div>
                </div>
            </div>
        `);
    },

    // SCREEN 1: Welcome
    showWelcomeScreen() {
        this.render(`
            <div class="screen welcome-screen">
                <div class="card welcome-card">
                    <h1>Forest Manager Decision Study</h1>
                    <p class="subtitle">Multi-Phase Forest Management</p>
                    <div class="info-box">
                        <ul style="text-align: left; list-style-position: inside;">
                            <li>Manage stands through 4 phases</li>
                            <li>Choose activities and configure parameters</li>
                            <li>~10-15 minutes</li>
                            <li><strong>Auto-saves every decision</strong> - you can exit and resume later!</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary btn-large" onclick="GameEngine.startGame()">
                        Start Session
                    </button>
                </div>
            </div>
        `);
    },

    // SCREEN 2: Agent Profile
    showAgentProfile(agent, nStands) {
        const prefsHtml = Object.entries(agent.preferences)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => `
                <div class="preference-bar">
                    <span class="pref-label">${key}</span>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${value * 100}%"></div>
                    </div>
                    <span class="pref-value">${Math.round(value * 100)}%</span>
                </div>
            `).join('');

        this.render(`
            <div class="screen profile-screen">
                <div class="card profile-card">
                    <h2>Your Profile</h2>
                    <div class="owner-badge owner-${agent.owner_type}">
                        ${agent.owner_type.toUpperCase()} OWNER
                    </div>
                    <div class="preferences-section">
                        <h3>Your Priorities</h3>
                        ${prefsHtml}
                    </div>
                    <div class="portfolio-info">
                        <p><strong>You manage ${nStands} stands</strong></p>
                        <p>Each stand is at a different phase. You'll manage them through all phases.</p>
                    </div>
                    <button class="btn btn-primary btn-large" onclick="GameEngine.startRound()">
                        View Your Stands
                    </button>
                </div>
            </div>
        `);
    },

    // SCREEN 3: Portfolio
    showPortfolio(stands, agent) {
        const standsHtml = stands.map((stand, i) => {
            const phase = ['Planting', 'Tending', 'Thinning', 'Harvesting'][stand.current_phase_index];
            return `
                <div class="portfolio-stand-card">
                    <div class="card-header">Stand ${i + 1}</div>
                    <div class="card-info">
                        <div class="phase-tag phase-${phase.toLowerCase()}">${phase}</div>
                        <div>${stand.structure_class}</div>
                        <div class="species-mini">${stand.species_simple}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.render(`
            <div class="screen portfolio-overview-screen">
                <div class="card portfolio-card">
                    <h2>Your Portfolio</h2>
                    <p>Each stand is at a different management phase</p>
                    <div class="stands-horizontal">
                        ${standsHtml}
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-primary btn-large" onclick="GameEngine.startDecisions()">
                            Start Making Decisions →
                        </button>
                    </div>
                </div>
            </div>
        `);
    },

    // SCREEN 4: Activity Selection
    showActivitySelection(stand, phaseName, availableActivities, standNum, totalStands) {
        const activitiesHtml = availableActivities.map(activity => `
            <label class="activity-option">
                <input type="radio" name="activity" value="${activity}">
                <div class="activity-card">
                    <div class="activity-name">${this.formatActivityName(activity)}</div>
                    <div class="activity-description">${this.getActivityDescription(activity)}</div>
                </div>
            </label>
        `).join('');

        this.render(`
            <div class="screen decision-screen">
                <div class="phase-progress">
                    Stand ${standNum}/${totalStands} | Phase: ${phaseName}
                </div>
                <div class="card decision-card">
                    <h2>Stand ${stand.stand_id}</h2>
                    <div class="stand-details">
                        <div class="detail-item">
                            <span class="label">Phase:</span>
                            <span class="value">${phaseName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Structure:</span>
                            <span class="value">${stand.structure_class}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Species:</span>
                            <span class="value">${stand.species_simple}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Priority:</span>
                            <span class="value priority-badge">${stand.preference_focus}</span>
                        </div>
                    </div>
                    <h3>Select activity:</h3>
                    <div class="activities-list">
                        ${activitiesHtml}
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                        <button id="confirmBtn" class="btn btn-primary btn-large" disabled>
                            Continue →
                        </button>
                        <button class="btn btn-secondary" onclick="GameEngine.saveAndExit()">
                            Save & Exit
                        </button>
                    </div>
                </div>
            </div>
        `);

        // BUG FIX #1: Use requestAnimationFrame instead of setTimeout
        requestAnimationFrame(() => {
            this.attachActivityListeners();
        });
    },

    attachActivityListeners() {
        const radios = document.querySelectorAll('input[name="activity"]');
        const confirmBtn = document.getElementById('confirmBtn');

        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                confirmBtn.disabled = false;
            });
        });

        confirmBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="activity"]:checked');
            if (selected) {
                GameEngine.onActivitySelected(selected.value);
            }
        });
    },

    // SCREEN 5: Parameter Selection
    showParameterSelection(stand, activity, paramConfig, standNum, totalStands) {
        const metadata = DataLoader.getParameterMetadata(activity);
        const defaults = DataLoader.sampleDefaultParameters(paramConfig);

        const parametersHtml = Object.keys(metadata).map(paramName => {
            const meta = metadata[paramName];
            const defaultValue = defaults[paramName];
            return this.renderParameterInput(paramName, meta, defaultValue);
        }).join('');

        this.render(`
            <div class="screen parameter-screen">
                <div class="phase-progress">
                    Stand ${standNum}/${totalStands} | Configuring Parameters
                </div>
                <div class="card parameter-card">
                    <h2>${this.formatActivityName(activity)}</h2>
                    <p class="stand-context">Stand ${stand.stand_id} - ${stand.structure_class}</p>
                    <div class="parameters-section">
                        ${parametersHtml}
                    </div>
                    <button id="confirmParamsBtn" class="btn btn-primary btn-large">
                        Confirm & Continue →
                    </button>
                </div>
            </div>
        `);

        // BUG FIX #1: Use requestAnimationFrame instead of setTimeout
        requestAnimationFrame(() => {
            this.attachParameterListeners(metadata);
        });
    },

    attachParameterListeners(metadata) {
        // Update slider displays
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const paramName = slider.id.replace('param_', '');
            const valueSpan = document.getElementById(`value_${paramName}`);
            const meta = metadata[paramName];

            slider.addEventListener('input', (e) => {
                let displayValue = e.target.value;
                if (meta.type === 'percent') {
                    displayValue = Math.round(displayValue);
                }
                valueSpan.textContent = displayValue + (meta.unit || '');
            });
        });

        // Confirm button
        document.getElementById('confirmParamsBtn').addEventListener('click', () => {
            const params = this.collectParameters(metadata);
            GameEngine.onParametersConfirmed(params);
        });
    },

    collectParameters(metadata) {
        const params = {};

        Object.keys(metadata).forEach(paramName => {
            const meta = metadata[paramName];
            const input = document.getElementById(`param_${paramName}`);

            if (!input) {
                // Check radio buttons
                const radio = document.querySelector(`input[name="${paramName}"]:checked`);
                if (radio) {
                    params[paramName] = isNaN(radio.value) ? radio.value : parseFloat(radio.value);
                }
                return;
            }

            if (input.type === 'range') {
                const value = parseFloat(input.value);
                params[paramName] = meta.type === 'percent' ? value / 100 : value;
            } else if (input.tagName === 'SELECT') {
                params[paramName] = input.value;
            }
        });

        return params;
    },

    renderParameterInput(paramName, meta, defaultValue) {
        if (meta.type === 'number' || meta.type === 'percent') {
            const isPercent = meta.type === 'percent';
            const minVal = isPercent ? meta.min * 100 : meta.min;
            const maxVal = isPercent ? meta.max * 100 : meta.max;
            const stepVal = isPercent ? meta.step * 100 : meta.step;

            // Start at min to avoid bias (if startAtMin flag set)
            const initialValue = meta.startAtMin ? minVal : (isPercent ? Math.round(defaultValue * 100) : Math.round(defaultValue));

            return `
                <div class="parameter-input">
                    <label class="param-label">
                        ${meta.label}
                        <span class="param-description">${meta.description}</span>
                    </label>
                    <div class="slider-container">
                        <input type="range" id="param_${paramName}"
                               min="${minVal}" max="${maxVal}" step="${stepVal}"
                               value="${initialValue}">
                        <span class="param-value" id="value_${paramName}">${initialValue}${meta.unit || ''}</span>
                    </div>
                </div>
            `;
        } else if (meta.type === 'discrete') {
            return `
                <div class="parameter-input">
                    <label class="param-label">
                        ${meta.label}
                        <span class="param-description">${meta.description}</span>
                    </label>
                    <div class="radio-group">
                        ${meta.options.map(opt => `
                            <label class="radio-option">
                                <input type="radio" name="${paramName}" value="${opt}"
                                       ${opt === defaultValue ? 'checked' : ''}>
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (meta.type === 'profile') {
            return `
                <div class="parameter-input">
                    <label class="param-label">
                        ${meta.label}
                        <span class="param-description">${meta.description}</span>
                    </label>
                    <select id="param_${paramName}" class="profile-select">
                        ${meta.profiles.map(profile => `
                            <option value="${profile}" ${profile === defaultValue ? 'selected' : ''}>
                                ${Utils.capitalize(profile)}
                            </option>
                        `).join('')}
                    </select>
                </div>
            `;
        }
        return '';
    },

    // SCREEN 6: Round Complete
    showRoundComplete(lastDecisions) {
        const activityCounts = {};
        lastDecisions.forEach(d => {
            const name = this.formatActivityName(d.chosen_activity);
            activityCounts[name] = (activityCounts[name] || 0) + 1;
        });

        const summaryHtml = Object.entries(activityCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([activity, count]) => `
                <div class="summary-item">
                    <span>${activity}</span>
                    <span class="count">× ${count}</span>
                </div>
            `).join('');

        this.render(`
            <div class="screen phase-complete-screen">
                <div class="card summary-card">
                    <h1>✓ Round Complete</h1>
                    <div class="completion-info">
                        <p>All stands managed. Phases advanced.</p>
                    </div>
                    <div class="activity-summary">
                        <h3>This Round</h3>
                        ${summaryHtml}
                    </div>
                    <button class="btn btn-primary btn-large" onclick="GameEngine.nextRound()">
                        Continue to Next Round →
                    </button>
                </div>
            </div>
        `);
    },

    // SCREEN 7: Final Summary
    showFinalSummary(sessionData, allDecisions) {
        const activityCounts = {};
        allDecisions.forEach(d => {
            const name = this.formatActivityName(d.chosen_activity);
            activityCounts[name] = (activityCounts[name] || 0) + 1;
        });

        const summaryHtml = Object.entries(activityCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([activity, count]) => `
                <div class="summary-item">
                    <span>${activity}</span>
                    <span class="count">× ${count}</span>
                </div>
            `).join('');

        this.render(`
            <div class="screen final-summary-screen">
                <div class="card summary-card">
                    <h1>🎉 Complete!</h1>
                    <div class="completion-info">
                        <p><strong>${allDecisions.length} decisions</strong></p>
                        <p>Duration: ${Utils.formatDuration(sessionData.duration_seconds)}</p>
                    </div>
                    <div class="activity-summary">
                        <h3>All Decisions</h3>
                        ${summaryHtml}
                    </div>
                    <div class="export-section">
                        <button class="btn btn-primary btn-large" onclick="GameEngine.exportSession()">
                            Download Results (JSON)
                        </button>
                    </div>
                    <button class="btn btn-secondary" onclick="location.reload()">
                        New Session
                    </button>
                </div>
            </div>
        `);
    },

    formatActivityName(activity) {
        const names = {
            noManagement: 'No Management',
            planting: 'Planting',
            tending: 'Tending',
            fromBelow: 'Thinning from Below',
            thinningFromBelow: 'Thinning from Below', // Keep old name for compatibility
            selectiveThinning: 'Selective Thinning',
            plenter_thinning: 'Plenter Thinning',
            plenter_harvest: 'Plenter Harvest',
            shelterwood: 'Shelterwood',
            clearcut: 'Clear-cut',
            targetDBH: 'Target Diameter',
            femel: 'Gap Harvest (Femel)'
        };
        return names[activity] || activity;
    },

    getActivityDescription(activity) {
        const descriptions = {
            noManagement: 'Natural development',
            planting: 'Plant trees',
            tending: 'Care for young stands',
            fromBelow: 'Remove smaller trees',
            thinningFromBelow: 'Remove smaller trees', // Keep old name for compatibility
            selectiveThinning: 'Favor crop trees',
            plenter_thinning: 'Selective thinning',
            plenter_harvest: 'Continuous cover',
            shelterwood: 'Gradual regeneration',
            clearcut: 'Complete harvest',
            targetDBH: 'Diameter threshold',
            femel: 'Gap regeneration'
        };
        return descriptions[activity] || '';
    },

    showError(message) {
        this.render(`
            <div class="screen error-screen">
                <div class="card error-card">
                    <h2>Error</h2>
                    <p>${message}</p>
                    <button class="btn btn-secondary" onclick="location.reload()">Reload</button>
                </div>
            </div>
        `);
    }
};
