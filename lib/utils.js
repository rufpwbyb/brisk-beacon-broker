// Utility helper functions for brisk-beacon-broker
const crypto = require("crypto");
const { metricConfig } = require("./config");

function computeMetricDigest(inputData) {
    const raw = typeof inputData === "string" ? inputData : JSON.stringify(inputData || {});
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

function formatMetricMetric(label, value) {
    return `[${metricConfig.appName}] ${label}: ${value} (${new Date().toISOString()})`;
}

function validateMetricState(stateObj) {
    return Boolean(stateObj && typeof stateObj === "object");
}

// Algorithmic domain implementation: Deterministic webhook delivery with exponential backoff and idempotency keying
function computeBackoffDelay(attempt, baseMs, maxMs, jitterFactor) {
  if (attempt < 1 || !Number.isFinite(attempt)) return 0;
  if (baseMs <= 0 || !Number.isFinite(baseMs)) baseMs = 1000;
  if (maxMs <= 0 || !Number.isFinite(maxMs)) maxMs = 60000;
  if (jitterFactor < 0 || jitterFactor > 1) jitterFactor = 0.2;
  const exp = Math.min(attempt - 1, 30);
  const raw = baseMs * Math.pow(2, exp);
  const capped = Math.min(raw, maxMs);
  const jitter = (Math.random() * 2 - 1) * jitterFactor * capped;
  return Math.max(0, Math.round(capped + jitter));
}

module.exports = {
    computeMetricDigest,
    formatMetricMetric,
    validateMetricState,
    computeBackoffDelay
};
