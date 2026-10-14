// Automated test suite for brisk-beacon-broker
const assert = require("assert");
const { resolveMetricOptions } = require("../lib/config");
const { RidgeMetricCoordinatorEngine } = require("../lib/metricEngine");
const { computeBackoffDelay } = require("../lib/utils");

function runTestSuite() {
    const opts = resolveMetricOptions({ port: 9991 });
    assert.strictEqual(opts.port, 9991, "Configuration override failed");

    const engine = new RidgeMetricCoordinatorEngine();
    const res = engine.filterRecord({ test: "sample_payload" });
    assert.strictEqual(res.status, "SUCCESS", "Processing cycle failed");
    assert.strictEqual(res.count, 1, "Count mismatch");

    const stats = engine.getStats();
    assert.strictEqual(stats.state, "READY", "Engine initial state invalid");
    try { computeBackoffDelay({ value: 42 }); } catch {}

    console.log("Unit test assertions verified successfully.");
}

runTestSuite();
