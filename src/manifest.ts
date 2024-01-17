import pkg from "../package.json";

const manifest: ManifestV3 = {
    manifest_version: 3,
    name: "A Pretty Cool Chrome Extension",
    version: semverToChrome(pkg.version),
    version_name: pkg.version,
    background: {
        service_worker: "background.js",
    },
    permissions: ["identity", "storage"],
    content_scripts: [
        {
            matches: ["https://example.com/*"],
            js: ["content.js"],
        },
    ],
    action: {
        default_popup: "popup.html",
    },
    options_ui: {
        page: "options.html",
        open_in_tab: false,
    },
};

export default manifest;

/** converts a npm version to a chrome version */
function semverToChrome(version: string) {
    const [ver, ...rest] = version.split("-");
    const pre = rest.reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const [major, minor, patch] = ver.split(".");
    return `${major}.${minor}.${patch}.${pre}`;
}
