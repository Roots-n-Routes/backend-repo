#!/usr/bin/env node
const { execSync, spawn } = require("node:child_process");
const PORT = process.env.PORT || 5000;

function pidsOnPort(port) {
  try {
    return execSync(`lsof -t -i :${port}`).toString().trim().split("\n").filter(Boolean);
  } catch { return []; }
}

function freePort(port) {
  let loops = 0;
  while (true) {
    const pids = pidsOnPort(port);
    if (!pids.length) return;
    pids.forEach(pid => {
      try {
        console.log(`⚔️  Killing ${pid} on port ${port}`);
        process.kill(pid, "SIGKILL");
      } catch (e) { /* ignore */ }
    });
    // Wait 200 ms then check again (max 10 tries)
    if (++loops > 10) {
      console.error(`❌ Could not free port ${port}`);
      process.exit(1);
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
  }
}

freePort(PORT);
console.log(`✅ Port ${PORT} is free — starting nodemon…`);
spawn("npx", ["nodemon", "app.js"], { stdio: "inherit" });
