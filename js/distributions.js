// Distribution Sampling Functions
// Simplified versions of SoCoABE's Distributions module

const Distributions = {
    /**
     * Weighted random choice from object {key: weight, ...}
     */
    weighted_random_choice(weights) {
        const keys = Object.keys(weights);
        const values = Object.values(weights);

        const total = values.reduce((sum, val) => sum + val, 0);
        if (total === 0) {
            // All weights are zero - return first key
            return keys[0];
        }

        let random = Math.random() * total;

        for (let i = 0; i < keys.length; i++) {
            random -= values[i];
            if (random <= 0) {
                return keys[i];
            }
        }

        return keys[keys.length - 1];
    },

    /**
     * Sample from Dirichlet distribution (simplified using Gamma)
     * Returns object {option: probability, ...}
     */
    sampleDirichlet(options, alpha) {
        // Sample from Gamma distributions
        const gammaValues = alpha.map(a => {
            if (a <= 0) return 0;
            return this._gammaRandom(a, 1);
        });

        const sum = gammaValues.reduce((s, v) => s + v, 0);

        // Normalize to get Dirichlet sample
        const result = {};
        for (let i = 0; i < options.length; i++) {
            result[options[i]] = sum > 0 ? gammaValues[i] / sum : 0;
        }

        return result;
    },

    /**
     * Simplified Gamma random sampler (using accept-reject)
     */
    _gammaRandom(shape, scale) {
        // For shape >= 1, use Marsaglia and Tsang method
        if (shape >= 1) {
            const d = shape - 1/3;
            const c = 1 / Math.sqrt(9 * d);

            while (true) {
                let x, v;
                do {
                    x = this._normalRandom();
                    v = 1 + c * x;
                } while (v <= 0);

                v = v * v * v;
                const u = Math.random();
                const x2 = x * x;

                if (u < 1 - 0.0331 * x2 * x2) {
                    return d * v * scale;
                }
                if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
                    return d * v * scale;
                }
            }
        } else {
            // For shape < 1, use transformation
            return this._gammaRandom(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
        }
    },

    /**
     * Box-Muller transform for normal random
     */
    _normalRandom() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    },

    /**
     * Beta distribution sampler
     */
    betaRandom(alpha, beta) {
        const x = this._gammaRandom(alpha, 1);
        const y = this._gammaRandom(beta, 1);
        return x / (x + y);
    },

    /**
     * Uniform random
     */
    uniformRandom(min, max) {
        return min + Math.random() * (max - min);
    },

    /**
     * Discrete choice from values with probabilities
     */
    discreteRandom(values, probabilities) {
        const total = probabilities.reduce((s, p) => s + p, 0);
        let random = Math.random() * total;

        for (let i = 0; i < values.length; i++) {
            random -= probabilities[i];
            if (random <= 0) {
                return values[i];
            }
        }

        return values[values.length - 1];
    },

    /**
     * Normal distribution sampler (using existing _normalRandom)
     */
    normalRandom2(mean, sd) {
        return mean + this._normalRandom() * sd;
    },

    /**
     * Poisson distribution sampler (approximation)
     */
    poissonRandom(lambda) {
        if (lambda < 30) {
            // Knuth's algorithm
            const L = Math.exp(-lambda);
            let k = 0;
            let p = 1;

            do {
                k++;
                p *= Math.random();
            } while (p > L);

            return k - 1;
        } else {
            // Normal approximation for large lambda
            return Math.max(0, Math.round(this.normalRandom2(lambda, Math.sqrt(lambda))));
        }
    },

    /**
     * Generic sampler (mirrors SoCoABE's Distributions.sample)
     */
    sample(distConfig) {
        const func = distConfig.distribution_function;
        const params = distConfig.distribution_params;

        // Handle array of params (typical structure from JSON)
        const p = Array.isArray(params) && params.length > 0 ? params[0] : params;

        switch (func) {
            case 'dirichlet':
                return this.sampleDirichlet(p.options, p.alpha);

            case 'beta':
                return this.betaRandom(p.alpha, p.beta);

            case 'uniform':
                return this.uniformRandom(p.min, p.max);

            case 'discrete':
                return this.discreteRandom(p.values, p.probabilities);

            case 'normal':
                return Math.round(this.normalRandom2(p.mean, p.sd));

            case 'poisson':
                return this.poissonRandom(p.lambda);

            case 'lookup':
                // For profiles - would need agent context
                console.warn('Lookup distribution requires agent context');
                return null;

            default:
                console.error('Unknown distribution function:', func);
                return null;
        }
    }
};
