import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { printStream } from "./lib";

const srcdir = "src";
const outdir = "extension";

const manifest: ManifestV3 = await import("../src/manifest.ts").then((m) => m.default);

// this file lives in the scripts directory, but we want to get the project directory
const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validExtensions = [".ts", ".js", ".tsx", ".jsx"];
const rawEntrypoints = await getEntrypoints(manifest);
const entrypoints = await validateEntrypoints(rawEntrypoints);
const watch = process.argv.includes("--watch") || process.argv.includes("-w");

const watchFlag = watch ? "--watch" : "";
console.log("building extension...");
// clean the extension directory
await fs.rm(path.join(projectDir, outdir), { recursive: true, force: true });

// if the extension directory does not exist, create it
if (!(await fs.stat(path.join(projectDir, outdir)).catch(() => null))) {
    await fs.mkdir(path.join(projectDir, outdir));
}

// write the manifest file with the correct extensions
const manifestFile = replaceTsWithJs(manifest);

const manifestBytes = await Bun.write(
    path.join(projectDir, outdir, "manifest.json"),
    JSON.stringify(manifestFile, null, 4),
);
console.log(`manifest.json    ${bytesToKilobytes(manifestBytes)}`);

const { stdout, stderr } = Bun.spawn(
    [
        "bun",
        "build",
        watchFlag,
        ...entrypoints,
        "--target",
        "browser",
        "--outdir",
        path.join(projectDir, outdir),
        "--asset-naming",
        "[dir]/[name].[ext]",
    ],
    { cwd: path.join(projectDir, srcdir), stdout: "pipe", stderr: "pipe" },
);

printStream(stdout);
printStream(stderr);

async function getEntrypoints(_manifest: unknown, entrypoints: string[] = []) {
    if (!_manifest || typeof _manifest !== "object") return entrypoints;
    const manifest = _manifest as Record<string, unknown>;
    for (const key in manifest) {
        const value = manifest[key];
        if (endsWith(value, ...validExtensions)) {
            entrypoints.push(value);
            continue;
        }
        if (endsWith(value, ".html")) {
            // look for script tags with src in the html file
            const html = await fs
                .readFile(path.join(projectDir, srcdir, value), "utf8")
                .catch(() => null);
            if (!html) {
                console.error(`Could not read file ${value}`);
                process.exit(1);
            }
            const scripts = html.matchAll(/<script[^>]*\bsrc[\n\s]*=\s*["']([^"']*)["']/gm);
            for (const src of scripts) {
                const path = src[1];
                if (endsWith(path, ...validExtensions)) {
                    entrypoints.push(path);
                }
            }
            continue;
        }

        await getEntrypoints(value, entrypoints);
    }
    return entrypoints;
}

function replaceTsWithJs(file: ManifestV3): ManifestV3 {
    return JSON.parse(JSON.stringify(file).replace(/\.ts"/g, '.js"'));
}

function endsWith(str: unknown, ...suffix: string[]): str is string {
    if (typeof str !== "string") return false;
    return suffix.some((s) => str.endsWith(s));
}

async function validateEntrypoints(entrypoints: string[]) {
    const validated: string[] = [];
    const validExts = validExtensions;
    const missing: string[] = [];
    for (const entrypoint of entrypoints) {
        let hasValidExt = false;
        const exists = await fs.stat(path.join(projectDir, entrypoint)).catch(() => null);
        if (exists && exists.isFile()) {
            validated.push(entrypoint);
            hasValidExt = true;
        }
        if (!exists) {
            for (const ext of validExts) {
                const extname = path.extname(entrypoint);
                const basename = entrypoint.slice(0, -extname.length);
                const fpath = path.join(projectDir, srcdir, basename + ext);
                const exists = await fs.stat(fpath).catch(() => null);
                if (exists && exists.isFile()) {
                    validated.push(basename + ext);
                    hasValidExt = true;
                }
            }
        }
        if (!hasValidExt) {
            missing.push(entrypoint);
        }
    }
    if (missing.length) {
        console.error("The following entrypoints could not be found:");
        console.warn(missing);
        console.log("Check your manifest file and make sure that all of the entrypoints exist.");
        process.exit(1);
    }
    return validated;
}

function bytesToKilobytes(bytes: number) {
    return Math.round(bytes / 1024) + " KB";
}

export default {};
