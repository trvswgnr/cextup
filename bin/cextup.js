#!/usr/bin/env node
// @ts-check
/**!
 * @file bin/cextup.js
 *
 * this is the main file for the cextup command line tool
 *
 * it prompts the user for the name of the extension and copies the template
 */

// import modules
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
    const name = await askInputQuestion("What is the name of your project?", "my-ext");
    const usePrettier = await askYesNoQuestion("Do you want to use prettier?", true);
    const useVercel = await askYesNoQuestion(
        "Do you want to use Vercel serverless edge functions?",
        true,
    );
    let useServer = true;
    if (!useVercel) {
        useServer = await askYesNoQuestion("Do you want to use a local server?", true);
    }
    scaffold(name, usePrettier, useVercel, useServer);
    rl.close();
}

/**
 * @param {string} name
 * @param {boolean} usePrettier
 * @param {boolean} useVercel
 * @param {boolean} useServer
 */
function scaffold(name, usePrettier, useVercel, useServer) {
    // create the extension directory, if it doesn't exist
    if (fs.existsSync(name)) {
        console.error("Directory already exists");
        process.exit(1);
    }
    fs.mkdirSync(name);

    // copy the template
    copyFiles("src", name);
    copyFiles("types", name);
    copyFiles("scripts", name);
    if (usePrettier) {
        copyFile(".prettierrc", name);
    }

    if (useServer) {
        copyFiles("api", name);
    }

    if (useVercel) {
        copyFile("vercel.json", name);
    }

    copyFile("LICENSE", name);
    copyFile("index.html", name);
    copyFile(".gitignore", name);
    copyFile(".env-example", name);
    copyFile("tsconfig.json", name);

    createReadme(name);

    createPackageJson(name);

    // close the readline interface
    rl.close();

    console.log(`Created extension at ${path.join(process.cwd(), name)}`);
    console.log(`Next steps:
cd ${name}
bun i
bun start
`);
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
 * @param {string} _src
 * @param {string} name
 */
function copyFiles(_src, name) {
    const src = path.join(cextupRoot, _src);
    const dest = path.join(name, _src);
    fs.readdir(src, (err, files) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        files.forEach((file) => {
            const f = path.join(dest, file);
            const d = path.dirname(f);
            if (!fs.existsSync(d)) {
                fs.mkdirSync(d, { recursive: true });
            }
            fs.copyFileSync(path.join(src, file), f);
        });
    });
}

/**
 * @param {string} _src
 * @param {string} name
 */
function copyFile(_src, name) {
    const src = path.join(cextupRoot, _src);
    const dest = path.join(name, _src);
    fs.copyFileSync(src, dest);
}

/**
 * @param {string} name
 */
function createPackageJson(name) {
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
    fs.writeFileSync(path.join(name, "package.json"), JSON.stringify(packageJson, null, 4), "utf8");
}

/**
 * @param {string} name
 */
function createReadme(name) {
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

    fs.writeFileSync(path.join(name, "README.md"), readme, "utf8");
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
