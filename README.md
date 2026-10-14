# brisk-beacon-broker

A webhook engine that guarantees at-least-once delivery with deterministic retry scheduling, idempotency keying, and bounded backpressure.

## Overview & Problem Statement

Webhook delivery is deceptively hard. Network failures, endpoint timeouts, and partial outages are the norm, not the exception. Naive retry loops hammer endpoints, amplify load, and produce duplicate or out-of-order events. Distributed systems need a delivery mechanism that is:

- **Reliable**: Every accepted event is delivered at least once, even across process restarts.
- **Deterministic**: Retry timing is predictable and bounded, so downstream systems can reason about load.
- **Idempotent**: Consumers can safely deduplicate events using stable keys.
- **Backpressured**: The engine never accepts more work than it can persist or schedule.

`brisk-beacon-broker` solves these constraints with a compact, dependency-free core that can be embedded in any Node.js service or run as a standalone process.

## Core Architecture & Highlights

- **Persistent outbox**: Events are written to an append-only log before any network I/O, ensuring durability.
- **Deterministic retry scheduler**: Exponential backoff with configurable base, cap, and jitter. The `computeBackoffDelay` function provides a pure, testable implementation.
- **Idempotency keys**: Every event carries a stable `eventId` derived from content hash, so consumers can deduplicate safely.
- **Bounded concurrency**: A worker pool with a configurable concurrency limit prevents endpoint flooding.
- **At-least-once semantics**: Events are only acknowledged after a successful HTTP 2xx response; failures are retried with backoff.
- **Graceful shutdown**: In-flight deliveries are completed or persisted before the process exits.
- **Pluggable transport**: Built-in HTTP/HTTPS sender, with a simple interface for custom transports (e.g., AWS Lambda, Google Cloud Functions).
- **Observability**: Emits delivery metrics (attempts, latency, success/failure) via an event emitter.

## Installation

```bash
npm install brisk-beacon-broker
```

## Quick Start

```js
const { BeaconBroker } = require('brisk-beacon-broker');

const broker = new BeaconBroker({
  baseBackoffMs: 1000,
  maxBackoffMs: 60000,
  jitterFactor: 0.2,
  concurrency: 5,
  transport: async (event) => {
    const res = await fetch(event.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(event.payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
});

broker.on('delivered', (event) => console.log('Delivered', event.id));
broker.on('failed', (event, error) => console.error('Failed', event.id, error.message));

await broker.start();

await broker.enqueue({
  url: 'https://api.example.com/hooks/order-created',
  payload: { orderId: '12345', amount: 99.95 },
  // Optional custom idempotency key (defaults to content hash)
  idempotencyKey: 'order-12345',
});

// Graceful shutdown
await broker.close();
```

## Configuration / Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseBackoffMs` | number | 1000 | Base delay for first retry (ms). |
| `maxBackoffMs` | number | 60000 | Maximum delay between retries (ms). |
| `jitterFactor` | number | 0.2 | Random jitter fraction (0-1) applied to backoff to avoid thundering herd. |
| `concurrency` | number | 5 | Maximum number of simultaneous deliveries. |
| `maxAttempts` | number | 10 | Maximum delivery attempts before dropping an event. |
| `transport` | function | HTTP | Async function that performs the delivery. Must throw on failure. |
| `store` | object | Memory | Persistence adapter with `append`, `read`, `ack`, `delete` methods. |
| `idempotencyKeyFn` | function | hash | Function to derive idempotency key from event. |

## Performance & Design Constraints

- **Zero dependencies**: Core engine uses only Node.js built-ins (`http`, `https`, `events`, `crypto`).
- **Memory bounded**: The in-memory queue is capped; exceeding capacity returns an error from `enqueue`.
- **Disk-backed persistence**: The default store is an append-only log with atomic writes, suitable for production.
- **Backoff computation is O(1)**: The `computeBackoffDelay` function uses exponentiation and clamping, with no loops.
- **Throughput**: On a typical machine, the engine can process thousands of events per second with concurrency 10, limited by network latency.
- **Durability**: Events are persisted before acknowledgment to the caller, ensuring no loss on crash.

## License

MIT License © 2026 Suzanne Streich (@rufpwbyb)