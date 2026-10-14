// Main application module for brisk-beacon-broker
const { RidgeMetricCoordinatorEngine } = require("./metricEngine");
const { resolveMetricOptions } = require("./config");

class RidgeMetricCoordinator {
    constructor(options = {}) {
        this.options = resolveMetricOptions(options);
        this.engine = new RidgeMetricCoordinatorEngine(this.options);
    }

    dispatch(item) {
        return this.engine.filterRecord(item);
    }

    status() {
        return this.engine.getStats();
    }
}

module.exports = {
    RidgeMetricCoordinator,
    RidgeMetricCoordinatorEngine
};
