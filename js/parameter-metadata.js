// Parameter Metadata - Exact mapping from SoCoABE model
// UPDATED: execution_schedule = stand age, wider ranges, sliders start at min

const ParameterMetadata = {

    // ========================================
    // CLEARCUT
    // ========================================
    clearcut: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age at Clearcut',
            description: 'Age of stand when clearcut will be executed',
            min: 40,
            max: 250,
            step: 5,
            unit: ' years',
            startAtMin: true
        }
    },

    // ========================================
    // FEMEL (Gap Harvest)
    // ========================================
    femel: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when gap harvesting begins',
            min: 50,
            max: 200,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        times: {
            type: 'number',
            label: 'Number of Times',
            description: 'How many times to repeat the operation',
            min: 1,
            max: 15,
            step: 1,
            unit: ' times',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between repetitions',
            min: 3,
            max: 25,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        initial_size: {
            type: 'number',
            label: 'Initial Gap Size',
            description: 'Starting size of gaps (trees)',
            min: 1,
            max: 8,
            step: 1,
            unit: ' trees',
            startAtMin: true
        },
        growth_width: {
            type: 'number',
            label: 'Growth Width',
            description: 'How much gaps expand per iteration',
            min: 0,
            max: 5,
            step: 1,
            unit: ' trees',
            startAtMin: true
        }
    },

    // ========================================
    // THINNING FROM BELOW
    // ========================================
    fromBelow: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when thinning begins',
            min: 15,
            max: 100,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        times: {
            type: 'number',
            label: 'Number of Times',
            description: 'How many times to thin',
            min: 1,
            max: 12,
            step: 1,
            unit: ' times',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between thinning operations',
            min: 3,
            max: 20,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        thinningShare: {
            type: 'percent',
            label: 'Thinning Share',
            description: 'Percentage of basal area to remove',
            min: 0.05,
            max: 0.6,
            step: 0.05,
            unit: '%',
            startAtMin: true
        },
        species_profile: {
            type: 'profile',
            label: 'Species Profile',
            description: 'Which species to favor or remove',
            profiles: ['broadleaved', 'conifers', 'mixed', 'no_profile']
        }
    },

    // ========================================
    // PLANTING
    // ========================================
    planting: {
        execution_schedule: {
            type: 'number',
            label: 'Years After Disturbance',
            description: 'Years to wait before planting',
            min: 0,
            max: 15,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        species_profile: {
            type: 'profile',
            label: 'Species Profile',
            description: 'Which species to plant',
            profiles: ['broadleaved', 'conifers', 'mixed']
        }
    },

    // ========================================
    // PLENTER HARVEST
    // ========================================
    plenter_harvest: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when plenter harvest begins',
            min: 40,
            max: 200,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between harvest cycles',
            min: 5,
            max: 30,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        plenterCurve: {
            type: 'discrete',
            label: 'Plenter Profile',
            description: 'Target diameter distribution profile from model',
            options: ['plenter_prod', 'plenter_bio', 'plenter_co2']
        }
    },

    // ========================================
    // PLENTER THINNING
    // ========================================
    plenter_thinning: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when plenter thinning begins',
            min: 25,
            max: 120,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between thinning cycles',
            min: 5,
            max: 30,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        plenterCurve: {
            type: 'discrete',
            label: 'Plenter Profile',
            description: 'Target diameter distribution profile from model',
            options: ['plenter_prod', 'plenter_bio', 'plenter_co2']
        }
    },

    // ========================================
    // SELECTIVE THINNING
    // ========================================
    selectiveThinning: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when selective thinning begins',
            min: 20,
            max: 100,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        times: {
            type: 'number',
            label: 'Number of Times',
            description: 'How many times to thin',
            min: 1,
            max: 10,
            step: 1,
            unit: ' times',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between thinning operations',
            min: 5,
            max: 25,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        nTrees: {
            type: 'number',
            label: 'Number of Crop Trees',
            description: 'How many future crop trees to favor',
            min: 30,
            max: 300,
            step: 10,
            unit: ' trees/ha',
            startAtMin: true
        },
        nCompetitors: {
            type: 'number',
            label: 'Competitors per Tree',
            description: 'How many competitors to remove around each crop tree',
            min: 1,
            max: 8,
            step: 1,
            unit: ' trees',
            startAtMin: true
        },
        species_profile: {
            type: 'profile',
            label: 'Species Profile',
            description: 'Which species to favor as crop trees',
            profiles: ['broadleaved', 'conifers', 'mixed', 'no_profile']
        }
    },

    // ========================================
    // SHELTERWOOD
    // ========================================
    shelterwood: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when shelterwood begins',
            min: 40,
            max: 200,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        times: {
            type: 'number',
            label: 'Number of Cuts',
            description: 'How many shelterwood cuts (prep, seed, final)',
            min: 2,
            max: 6,
            step: 1,
            unit: ' cuts',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between cuts',
            min: 5,
            max: 30,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        nTrees: {
            type: 'number',
            label: 'Shelter Trees Remaining',
            description: 'Trees per hectare to leave as shelter',
            min: 20,
            max: 200,
            step: 10,
            unit: ' trees/ha',
            startAtMin: true
        },
        species_profile: {
            type: 'profile',
            label: 'Species Profile',
            description: 'Which species for regeneration',
            profiles: ['broadleaved', 'conifers', 'mixed']
        }
    },

    // ========================================
    // TARGET DBH
    // ========================================
    targetDBH: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when diameter-based harvest begins',
            min: 30,
            max: 150,
            step: 5,
            unit: ' years',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between harvest cycles',
            min: 5,
            max: 30,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        targetDBH: {
            type: 'number',
            label: 'Target DBH',
            description: 'Minimum diameter (DBH) to harvest',
            min: 20,
            max: 100,
            step: 5,
            unit: ' cm',
            startAtMin: true
        },
        dbhListProfile: {
            type: 'discrete',
            label: 'Target DBH Profile',
            description: 'Species-specific target DBH profile from model',
            options: ['production_standard', 'biodiversity_mix', 'co2_storage']
        }
    },

    // ========================================
    // TENDING
    // ========================================
    tending: {
        execution_schedule: {
            type: 'number',
            label: 'Stand Age to Start',
            description: 'Age of stand when tending begins',
            min: 3,
            max: 40,
            step: 2,
            unit: ' years',
            startAtMin: true
        },
        times: {
            type: 'number',
            label: 'Number of Times',
            description: 'How many tending operations',
            min: 1,
            max: 8,
            step: 1,
            unit: ' times',
            startAtMin: true
        },
        interval: {
            type: 'number',
            label: 'Interval',
            description: 'Years between tending operations',
            min: 3,
            max: 15,
            step: 1,
            unit: ' years',
            startAtMin: true
        },
        intensity: {
            type: 'percent',
            label: 'Intensity',
            description: 'How intensive the tending (% removed)',
            min: 0.1,
            max: 0.8,
            step: 0.05,
            unit: '%',
            startAtMin: true
        },
        species_profile: {
            type: 'profile',
            label: 'Species Profile',
            description: 'Which species to favor',
            profiles: ['broadleaved', 'conifers', 'mixed', 'no_profile']
        }
    },

    // ========================================
    // NO MANAGEMENT (no parameters)
    // ========================================
    noManagement: {}
};
