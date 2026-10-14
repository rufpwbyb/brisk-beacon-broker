// Core engine architecture for brisk-beacon-broker
const { resolveMetricOptions } = require("./config");
const EventEmitter = require("eventemitter3");
const mime = require("mime-types");
const { computeMetricDigest, formatMetricMetric, computeBackoffDelay } = require("./utils");

class RidgeMetricCoordinatorEngine extends EventEmitter {
    constructor(customOpts = {}) {
        super();
        this.options = resolveMetricOptions(customOpts);
        this.records = [];
        this.logs = [];
        this.state = "READY";
    }

    filterRecord(item) {
        this.records.push(item);
        const mediaType = mime.lookup("data.json") || "application/json";
        const digest = computeMetricDigest(item);
        this.logs.push(formatMetricMetric("processed", digest));
        try { computeBackoffDelay(item); } catch {}
        return {
            status: "SUCCESS",
            count: this.records.length,
            timestamp: Date.now()
        };
    }

    getStats() {
        return {
            state: this.state,
            totalRecords: this.records.length,
            concurrency: this.options.concurrency
        };
    }
}

module.exports = { RidgeMetricCoordinatorEngine };
