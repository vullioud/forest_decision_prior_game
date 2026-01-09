// Coverage Tracker - Intelligent Stand Dispatch System
// Ensures all combinations of (owner_type × structure × phase × preference) are covered

const CoverageTracker = {

    // Combination space dimensions
    dimensions: {
        owner_types: ['small', 'medium', 'large'],
        structures: ['low', 'medium', 'high'],
        phases: [0, 1, 2, 3], // Indices: Planting, Tending, Thinning, Harvesting
        preferences: ['Production', 'CO2', 'Biodiversity', 'Recreation']
    },

    /**
     * Generate a unique key for a combination
     */
    getCombinationKey(owner, structure, phase, preference) {
        return `${owner}|${structure}|${phase}|${preference}`;
    },

    /**
     * Parse a combination key back into components
     */
    parseCombinationKey(key) {
        const [owner, structure, phase, preference] = key.split('|');
        return { owner, structure, phase: parseInt(phase), preference };
    },

    /**
     * Get coverage stats from localStorage
     */
    getCoverageStats() {
        const stored = localStorage.getItem('forestGame_coverage');
        if (!stored) return {};
        return JSON.parse(stored);
    },

    /**
     * Update coverage stats
     */
    updateCoverage(owner, structure, phase, preference) {
        const stats = this.getCoverageStats();
        const key = this.getCombinationKey(owner, structure, phase, preference);

        stats[key] = (stats[key] || 0) + 1;

        localStorage.setItem('forestGame_coverage', JSON.stringify(stats));
        return stats[key];
    },

    /**
     * Get all possible combinations
     */
    getAllCombinations() {
        const combinations = [];

        for (const owner of this.dimensions.owner_types) {
            for (const structure of this.dimensions.structures) {
                for (const phase of this.dimensions.phases) {
                    for (const preference of this.dimensions.preferences) {
                        combinations.push({
                            owner,
                            structure,
                            phase,
                            preference,
                            key: this.getCombinationKey(owner, structure, phase, preference)
                        });
                    }
                }
            }
        }

        return combinations; // 3 × 3 × 4 × 4 = 144 combinations
    },

    /**
     * Get under-represented combinations
     */
    getUnderRepresentedCombinations(limit = 10) {
        const stats = this.getCoverageStats();
        const allCombinations = this.getAllCombinations();

        // Sort by coverage (least to most)
        const sorted = allCombinations.sort((a, b) => {
            const countA = stats[a.key] || 0;
            const countB = stats[b.key] || 0;
            return countA - countB;
        });

        return sorted.slice(0, limit);
    },

    /**
     * Select stands to maximize coverage
     * Returns an array of stand indices prioritizing under-represented combinations
     */
    selectStands(allStands, agent, targetCount = 10) {
        const stats = this.getCoverageStats();

        // Score each stand by how under-represented its combinations are
        const scoredStands = allStands.map((stand, index) => {
            const scores = [];

            // Score for each phase this stand will go through
            for (let phase = 0; phase < 4; phase++) {
                const key = this.getCombinationKey(
                    agent.owner_type,
                    stand.structure_class,
                    phase,
                    stand.preference_focus
                );

                // Lower coverage = higher priority (inverse)
                const coverage = stats[key] || 0;
                const priority = 1.0 / (coverage + 1); // +1 to avoid division by zero
                scores.push(priority);
            }

            // Average priority across all phases
            const avgPriority = scores.reduce((sum, s) => sum + s, 0) / scores.length;

            return {
                index,
                stand,
                priority: avgPriority,
                scores
            };
        });

        // Sort by priority (highest first)
        scoredStands.sort((a, b) => b.priority - a.priority);

        // Return top N stands
        return scoredStands.slice(0, targetCount).map(s => s.stand);
    },

    /**
     * Get coverage report
     */
    getCoverageReport() {
        const stats = this.getCoverageStats();
        const allCombinations = this.getAllCombinations();

        const covered = allCombinations.filter(c => (stats[c.key] || 0) > 0).length;
        const total = allCombinations.length;
        const percentage = Math.round((covered / total) * 100);

        // Distribution of coverage
        const distribution = {};
        for (const combo of allCombinations) {
            const count = stats[combo.key] || 0;
            distribution[count] = (distribution[count] || 0) + 1;
        }

        return {
            total_combinations: total,
            covered: covered,
            uncovered: total - covered,
            coverage_percentage: percentage,
            distribution,
            stats
        };
    },

    /**
     * Reset coverage (for testing)
     */
    resetCoverage() {
        localStorage.removeItem('forestGame_coverage');
    }
};
