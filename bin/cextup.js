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

// get the name of the extension
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const cextRoot = path.join(path.dirname(getScriptPath()), "..");

rl.question("Extension name: ", cb);

/**
 * @param {string} name
 */
function cb(name) {
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
    copyFiles("api", name);

    copyFile("LICENSE", name);
    copyFile("index.html", name);
    copyFile(".gitignore", name);
    copyFile(".env-example", name);
    copyFile("tsconfig.json", name);
    copyFile("vercel.json", name);

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
    const src = path.join(cextRoot, _src);
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
    const src = path.join(cextRoot, _src);
    const dest = path.join(name, _src);
    fs.copyFileSync(src, dest);
}

/**
 * @param {string} name
 */
function createPackageJson(name) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(cextRoot, "package.json"), "utf8"));
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
