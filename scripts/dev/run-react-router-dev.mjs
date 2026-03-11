import { spawn } from "node:child_process";

const cliPath = new URL("../../node_modules/@react-router/dev/bin.js", import.meta.url);
const args = process.argv.slice(2);
const major = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);

const command = major === 22 ? process.execPath : "npx";
const commandArgs =
  major === 22 ? [cliPath.pathname, "dev", ...args] : ["-y", "node@22", cliPath.pathname, "dev", ...args];

const child = spawn(command, commandArgs, {
  env: process.env,
  shell: false,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});