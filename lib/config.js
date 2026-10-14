// Configuration for brisk-beacon-broker
const os = require("os");
const path = require("path");

const metricConfig = {
    appName: "brisk-beacon-broker",
    environment: process.env.NODE_ENV || "production",
    port: parseInt(process.env.PORT || "6506", 10),
    timeoutMs: 26317,
    maxBufferItems: 316,
    concurrency: os.cpus().length,
    baseDir: path.resolve(__dirname, "..")
};

function resolveMetricOptions(overrides = {}) {
    return Object.assign({}, metricConfig, overrides);
}

module.exports = {
    metricConfig,
    resolveMetricOptions
};
