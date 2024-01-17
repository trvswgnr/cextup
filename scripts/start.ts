import path from "path";
import { printStream } from "./lib";

const shouldServe = !process.argv.includes("--no-server");

const thisDir = path.dirname(new URL(import.meta.url).pathname);
const spawnOpts = { stdout: "pipe", stderr: "pipe" } as const;
const build = Bun.spawn(["bun", "--watch", path.join(thisDir, "build.ts"), "-w"], spawnOpts);

if (!shouldServe) {
    printStream(build.stdout);
    printStream(build.stderr);
}

if (shouldServe) {
    const serve = Bun.spawn(["bun", "--hot", path.join(thisDir, "serve.ts")], spawnOpts);
    printStream(serve.stdout, "serve");
    printStream(serve.stderr, "serve");
    printStream(build.stdout, "build");
    printStream(build.stderr, "build");
}
