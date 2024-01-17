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
import { exec } from "child_process";

// get the name of the extension
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const thisScriptDir = path.dirname(getScriptPath());

/**
 * @param {string} name
 */
const cb = (name) => {
    // create the extension directory, if it doesn't exist
    if (fs.existsSync(name)) {
        console.error("Directory already exists");
        process.exit(1);
    }
    fs.mkdirSync(name);

    // copy the template
    copyFiles(path.join(thisScriptDir, "src"), path.join(name, "src"));
    copyFiles(path.join(thisScriptDir, "types"), path.join(name, "types"));
    copyFiles(path.join(thisScriptDir, "scripts"), path.join(name, "scripts"));
    copyFiles(path.join(thisScriptDir, "api"), path.join(name, "api"));

    fs.copyFileSync(path.join(thisScriptDir, "LICENSE"), path.join(name, "LICENSE"));
    // fs.copyFileSync(path.join(thisScriptDir, "README.md"), path.join(name, "README.md"));
    fs.copyFileSync(path.join(thisScriptDir, "index.html"), path.join(name, "index.html"));
    fs.copyFileSync(path.join(thisScriptDir, ".gitignore"), path.join(name, ".gitignore"));
    fs.copyFileSync(path.join(thisScriptDir, ".env-example"), path.join(name, ".env-example"));
    // fs.copyFileSync(path.join(thisScriptDir, "package.json"), path.join(name, "package.json"));
    fs.copyFileSync(path.join(thisScriptDir, "tsconfig.json"), path.join(name, "tsconfig.json"));
    fs.copyFileSync(path.join(thisScriptDir, "vercel.json"), path.join(name, "vercel.json"));

    fs.writeFileSync(path.join(name, "README.md"), `# ${name}\n\n`, "utf8");

    createPackageJson(name);

    // close the readline interface
    rl.close();
};

rl.question("Extension name: ", cb);

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
 * @param {string} src
 * @param {string} dest
 */
function copyFiles(src, dest) {
    fs.readdir(src, (err, files) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        files.forEach((file) => {
            fs.copyFileSync(path.join(src, file), path.join(dest, file));
        });
    });
}

/**
 * @param {string} name
 */
function createPackageJson(name) {
    const packageJson = JSON.parse(
        fs.readFileSync(path.join(thisScriptDir, "package.json"), "utf8"),
    );
    packageJson.name = name;
    packageJson.description = undefined;
    packageJson.version = "0.0.1";
    packageJson.author = undefined;
    packageJson.repository = undefined;
    packageJson.homepage = undefined;
    packageJson.bugs = undefined;
    packageJson.keywords = undefined;
    fs.writeFileSync(path.join(name, "package.json"), JSON.stringify(packageJson, null, 4), "utf8");
}
