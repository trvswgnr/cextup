#!/usr/bin/env node
// @ts-check

import fs from "fs/promises";
import path from "path";
import readline from "readline";

const cextupRoot = path.join(path.dirname(getScriptPath()), "..");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const showHelp = process.argv.includes("--help") || process.argv.includes("-h");
const showVersion = process.argv.includes("--version") || process.argv.includes("-v");
const useDefaults = process.argv.includes("--yes") || process.argv.includes("-y");

main();

async function main() {
    const runtime = typeof Bun === "undefined" ? "npm" : "bun";

    const packageJson = JSON.parse(await fs.readFile(path.join(cextupRoot, "package.json"), "utf8"));

    if (showVersion) {
        console.log(`v${packageJson.version}`);
        process.exit(0);
    }

    if (showHelp) {
        console.log(`
cextup v${packageJson.version}

A tool to make Chrome extension development less painful.

Usage: cextup [options]

If calling from package manager: ${runtime}x cextup [options]

Options:
--yes, -y: Use default values for all questions
--help, -h: Show this help message
--version, -v: Show version
`);
        process.exit(0);
    }
    /** @type {string|undefined} */
    let handle;
    try {
        if (useDefaults) {
            await scaffold("My Extension", "my-extension", true, true, true);
            console.log(`Created extension at ${path.join(process.cwd(), "my-extension")}`);
            console.log(`Next steps:\ncd my-extension\nbun i\nbun start`);
            process.exit(0);
        }
        const name = await askInputQuestion("What is the name of your project?", "My Extension");
        handle = handleize(name);
        const usePrettier = await askYesNoQuestion("Do you want to use prettier?", true);
        const useVercel = await askYesNoQuestion(
            "Do you want to use Vercel serverless edge functions?",
            true,
        );
        let useServer = true;
        if (!useVercel) {
            useServer = await askYesNoQuestion("Do you want to use a local server?", true);
        }
        await scaffold(name, handle, usePrettier, useVercel, useServer);

        rl.close();

        console.log(`Created extension at ${path.join(process.cwd(), handle)}`);
        console.log(`Next steps:\ncd ${handle}\nbun i\nbun start`);
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        console.error(error.message);
        if (handle) {
            await fs.rm(handle, { recursive: true, force: true }).catch(() => {});
        }
        process.exit(1);
    }
}

/**
 * @param {string} name
 * @param {string} handle
 * @param {boolean} usePrettier
 * @param {boolean} useVercel
 * @param {boolean} useServer
 */
async function scaffold(name, handle, usePrettier, useVercel, useServer) {
    /** @type {Promise<void>[]} */
    const promises = [];
    await fs.mkdir(handle).catch(() => {
        console.error(`Error: Directory ${handle} already exists`);
        process.exit(1);
    });
    await copyDir("src", handle);

    const newManifestPath = path.join(handle, "src", "manifest.ts");
    const manifest = await fs.readFile(newManifestPath, "utf8");
    promises.push(fs.writeFile(newManifestPath, manifest.replace("{{ name }}", name), "utf8"));
    promises.push(copyDir("types", handle));
    promises.push(copyDir("scripts", handle));
    if (usePrettier) {
        promises.push(copyFile(".prettierrc", handle));
    }
    if (useServer) {
        promises.push(copyFile(".env-example", handle));
        promises.push(copyDir("api", handle));
    }
    if (useVercel) {
        promises.push(copyFile("vercel.json", handle));
    }
    promises.push(copyFile("LICENSE", handle));
    promises.push(copyFile("index.html", handle));
    promises.push(copyFile("gitignore-template", handle, ".gitignore"));
    promises.push(copyFile("tsconfig.json", handle));
    promises.push(createReadme(name, handle));
    promises.push(createPackageJson(handle, useServer));

    await Promise.all(promises);
}

function getScriptPath() {
    try {
        return new URL(import.meta.url).pathname;
    } catch (err) {
        const p = process.argv[1];
        if (!p) {
            throw new Error("Could not get script path");
        }
        return p;
    }
}

/**
 * @param {string} srcDirName
 * @param {string} name
 */
async function copyDir(srcDirName, name) {
    const src = path.join(cextupRoot, srcDirName);
    const dest = path.join(name, srcDirName);
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const file of entries) {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        if (file.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

/**
 * @param {string} _src
 * @param {string} folder
 * @param {string} [renamed]
 */
async function copyFile(_src, folder, renamed) {
    const src = path.join(cextupRoot, _src);
    const dest = path.join(folder, renamed ?? _src);
    const destDir = path.dirname(dest);
    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(src, dest);
}

/**
 * @param {string} name
 * @param {boolean} useServer
 */
async function createPackageJson(name, useServer) {
    const contents = await fs.readFile(path.join(cextupRoot, "package.json"), "utf8");
    const packageJson = JSON.parse(contents);
    packageJson.name = name;
    packageJson.description = undefined;
    packageJson.version = "0.0.1";
    packageJson.author = undefined;
    packageJson.repository = undefined;
    packageJson.homepage = undefined;
    packageJson.bugs = undefined;
    packageJson.keywords = undefined;
    packageJson.bin = undefined;
    if (!useServer) {
        packageJson.scripts.start = "bun ./scripts/start.ts --no-server";
    }
    await fs.writeFile(
        path.join(name, "package.json"),
        JSON.stringify(packageJson, null, 4),
        "utf8",
    );
}

/**
 * @param {string} name
 * @param {string} handle
 */
async function createReadme(name, handle) {
    const readme = `# ${name}

This project was generated with [cextup](https://github.com/trvswgnr/cextup).

## Development
make sure you have \`bun\` installed globally.

\`\`\`sh
curl -fsSL https://bun.sh/install | bash
\`\`\`

\`\`\`sh
# install dev dependencies
bun i

# start the dev server and watch for changes
bun start
\`\`\`

\`\`\`sh
# build the extension without starting the dev server
bun ./scripts/build.ts
\`\`\`


To load the extension in chrome, go to \`chrome://extensions\` and click \`Load unpacked\`. Select the \`dist\` directory in this project.

Note that Developer Mode must be enabled in order to load unpacked extensions.

You will need to reload the extension after making changes to the code by clicking the "Update" button in \`chrome://extensions\`.
`;

    await fs.writeFile(path.join(handle, "README.md"), readme, "utf8");
}

/**
 * @param {string} query
 * @param {string} [defaultValue]
 */
function askInputQuestion(query, defaultValue) {
    return new Promise((resolve) => {
        rl.question(`${query}${defaultValue === undefined ? "" : ` (${defaultValue})`} `, (ans) => {
            resolve(ans || defaultValue);
        });
    });
}

/**
 * @param {string} query
 * @param {boolean} [defaultValue]
 */
function askYesNoQuestion(query, defaultValue) {
    return new Promise((resolve) => {
        const _defaultValue = defaultValue === undefined ? "y/n" : defaultValue ? "y" : "n";
        rl.question(`${query} (${_defaultValue}) `, (ans) => {
            resolve(ans === "" ? defaultValue : ans[0]?.toLowerCase() === "y");
        });
    });
}

/**
 * turns a string into a handle
 * @param {string} str
 */
function handleize(str) {
    const handle = str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    if (!handle) throw new Error("Invalid handle");
    return handle;
}
