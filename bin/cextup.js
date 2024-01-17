#!/usr/bin/env node
// @ts-check

import fs from "fs";
import path from "path";
import readline from "readline";

const cextupRoot = path.join(path.dirname(getScriptPath()), "..");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

main();

async function main() {
    /** @type {string|undefined} */
    let handle;
    try {
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
        scaffold(name, handle, usePrettier, useVercel, useServer);

        rl.close();

        console.log(`Created extension at ${path.join(process.cwd(), handle)}`);
        console.log(`Next steps:\ncd ${handle}\nbun i\nbun start`);
    } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        console.error(error.message);
        // remove the new directory if it was created
        if (handle && fs.existsSync(handle)) {
            console.log(`Removing ${handle}`);
            fs.rmSync(handle, { recursive: true, force: true });
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
function scaffold(name, handle, usePrettier, useVercel, useServer) {
    // create the extension directory, if it doesn't exist
    if (fs.existsSync(handle)) {
        console.error(`Error: Directory ${handle} already exists`);
        process.exit(1);
    }

    fs.mkdirSync(handle);

    copyDir("src", handle, (err, files) => {
        const newManifestPath = path.join(handle, "src", "manifest.ts");
        const manifest = fs.readFileSync(newManifestPath, "utf8");
        fs.writeFileSync(newManifestPath, manifest.replace("{{ name }}", name), "utf8");
    });

    copyDir("types", handle);
    copyDir("scripts", handle);

    if (usePrettier) {
        copyFile(".prettierrc", handle);
    }

    if (useServer) {
        copyFile(".env-example", handle);
        copyDir("api", handle);
    }

    if (useVercel) {
        copyFile("vercel.json", handle);
    }

    copyFile("LICENSE", handle);
    copyFile("index.html", handle);
    copyFile(".gitignore", handle);
    copyFile("tsconfig.json", handle);

    createReadme(name, handle);

    createPackageJson(handle, useServer);
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
 * @param {(err: NodeJS.ErrnoException|null, files: string[]) => void} [cb]
 */
function copyDir(srcDirName, name, cb) {
    const src = path.join(cextupRoot, srcDirName);
    const dest = path.join(name, srcDirName);
    fs.readdir(src, (err, files) => {
        if (err) {
            cb?.(err, []);
            return;
        }
        files.forEach((file) => {
            const f = path.join(dest, file);
            const d = path.dirname(f);
            if (!fs.existsSync(d)) {
                fs.mkdirSync(d, { recursive: true });
            }
            fs.copyFileSync(path.join(src, file), f);
        });

        cb?.(null, files);
    });
}

/**
 * @param {string} _src
 * @param {string} name
 */
function copyFile(_src, name) {
    const src = path.join(cextupRoot, _src);
    const dest = path.join(name, _src);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
}

/**
 * @param {string} name
 * @param {boolean} useServer
 */
function createPackageJson(name, useServer) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(cextupRoot, "package.json"), "utf8"));
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
    fs.writeFileSync(path.join(name, "package.json"), JSON.stringify(packageJson, null, 4), "utf8");
}

/**
 * @param {string} name
 * @param {string} handle
 */
function createReadme(name, handle) {
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

    fs.writeFileSync(path.join(handle, "README.md"), readme, "utf8");
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
        const _defaultValue = defaultValue === undefined ? "y/n" : defaultValue ? "Y/n" : "y/N";
        rl.question(`${query} (${_defaultValue}) `, (ans) => {
            resolve(ans === "" ? defaultValue : ans.toLowerCase() === "y");
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
