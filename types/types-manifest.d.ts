/** Chrome Extension Manifest V3 */
type ManifestV3 = {
    /**
     * Background scripts are the place to put code that needs to maintain long-term state or
     * perform long-term operations, like monitoring a remote server, or interacting with a
     * database.
     */
    background?: Background;
    chrome_settings_overrides?: any;
    /**
     * Override pages are a way to substitute an HTML file from your extension for a page that
     * Google Chrome normally provides.
     */
    chrome_url_overrides?: ChromeUrlOverrides;
    /**
     * Use the commands API to add keyboard shortcuts that trigger actions in your extension,
     * for example, an action to open the browser action or send a command to the extension.
     */
    commands?: { [key: string]: { [key: string]: any } };
    content_pack?: any;
    /**
     * Content scripts are JavaScript files that run in the context of web pages.
     */
    content_scripts?: ContentScript[];
    current_locale?: any;
    /**
     * Specifies the subdirectory of _locales that contains the default strings for this
     * extension.
     */
    default_locale?: string;
    /**
     * A plain text description of the extension
     */
    description?: string;
    /**
     * A DevTools extension adds functionality to the Chrome DevTools. It can add new UI panels
     * and sidebars, interact with the inspected page, get information about network requests,
     * and more.
     */
    devtools_page?: string;
    /**
     * Declares which extensions, apps, and web pages can connect to your extension via
     * runtime.connect and runtime.sendMessage.
     */
    externally_connectable?: ExternallyConnectable;
    /**
     * You can use this API to enable users to upload files to your website.
     */
    file_browser_handlers?: FileBrowserHandler[];
    /**
     * The URL of the homepage for this extension.
     */
    homepage_url?: string;
    /**
     * One or more icons that represent the extension, app, or theme. Recommended format: PNG;
     * also BMP, GIF, ICO, JPEG.
     */
    icons?: Icons;
    import?: any;
    /**
     * Specify how this extension will behave if allowed to run in incognito mode.
     */
    incognito?: Incognito;
    /**
     * Allows your extension to handle keystrokes, set the composition, and manage the candidate
     * window.
     */
    input_components?: InputComponent[];
    /**
     * This value can be used to control the unique ID of an extension, app, or theme when it is
     * loaded during development.
     */
    key?: string;
    /**
     * One integer specifying the version of the manifest file format your package requires.
     */
    manifest_version: 3;
    /**
     * The version of Chrome that your extension, app, or theme requires, if any.
     */
    minimum_chrome_version?: string;
    /**
     * One or more mappings from MIME types to the Native Client module that handles each type.
     */
    nacl_modules?: NaclModule[];
    /**
     * The name of the extension
     */
    name: string;
    /**
     * Use the Chrome Identity API to authenticate users: the getAuthToken for users logged into
     * their Google Account and the launchWebAuthFlow for users logged into a non-Google account.
     */
    oauth2?: Oauth2;
    /**
     * Whether the app or extension is expected to work offline. When Chrome detects that it is
     * offline, apps with this field set to true will be highlighted on the New Tab page.
     */
    offline_enabled?: boolean;
    /**
     * The omnibox API allows you to register a keyword with Google Chrome's address bar, which
     * is also known as the omnibox.
     */
    omnibox?: Omnibox;
    /**
     * Use the chrome.permissions API to request declared optional permissions at run time
     * rather than install time, so users understand why the permissions are needed and grant
     * only those that are necessary.
     */
    optional_permissions?: string[];
    /**
     * To allow users to customize the behavior of your extension, you may wish to provide an
     * options page. If you do, a link to it will be provided from the extensions management
     * page at chrome://extensions. Clicking the Options link opens a new tab pointing at your
     * options page.
     */
    options_page?: string;
    /**
     * To allow users to customize the behavior of your extension, you may wish to provide an
     * options page. If you do, an Options link will be shown on the extensions management page
     * at chrome://extensions which opens a dialogue containing your options page.
     */
    options_ui?: OptionsUi;
    /**
     * Permissions help to limit damage if your extension or app is compromised by malware. Some
     * permissions are also displayed to users before installation, as detailed in Permission
     * Warnings.
     */
    permissions?: PermissionsType[];
    platforms?: any;
    /**
     * Technologies required by the app or extension. Hosting sites such as the Chrome Web Store
     * may use this list to dissuade users from installing apps or extensions that will not work
     * on their computer.
     */
    requirements?: Requirements;
    /**
     * Defines an collection of app or extension pages that are to be served in a sandboxed
     * unique origin, and optionally a Content Security Policy to use with them.
     */
    sandbox?: Sandbox;
    /**
     * The short name is typically used where there is insufficient space to display the full
     * name.
     */
    short_name?: string;
    signature?: any;
    spellcheck?: any;
    storage?: any;
    system_indicator?: any;
    /**
     * Register itself as a speech engine.
     */
    tts_engine?: TtsEngine;
    /**
     * If you publish using the Chrome Developer Dashboard, ignore this field. If you host your
     * own extension or app: URL to an update manifest XML file.
     */
    update_url?: string;
    /**
     * One to four dot-separated integers identifying the version of this extension.
     */
    version: string;
    /**
     * In addition to the version field, which is used for update purposes, version_name can be
     * set to a descriptive version string and will be used for display purposes if present.
     */
    version_name?: string;
    [property: string]: any;
};

/**
 * Override pages are a way to substitute an HTML file from your extension for a page that
 * Google Chrome normally provides.
 */
type ChromeUrlOverrides = {
    /**
     * The page that appears when the user chooses the Bookmark Manager menu item from the
     * Chrome menu or, on Mac, the Bookmark Manager item from the Bookmarks menu. You can also
     * get to this page by entering the URL chrome://bookmarks.
     */
    bookmarks?: string;
    /**
     * The page that appears when the user chooses the History menu item from the Chrome menu
     * or, on Mac, the Show Full History item from the History menu. You can also get to this
     * page by entering the URL chrome://history.
     */
    history?: string;
    /**
     * The page that appears when the user creates a new tab or window. You can also get to this
     * page by entering the URL chrome://newtab.
     */
    newtab?: string;
};

type ContentScript = {
    /**
     * Controls whether the content script runs in all frames of the matching page, or only the
     * top frame.
     */
    all_frames?: boolean;
    /**
     * The list of CSS files to be injected into matching pages. These are injected in the order
     * they appear in this array, before any DOM is constructed or displayed for the page.
     */
    css?: string[];
    /**
     * Applied after matches to exclude URLs that match this glob. Intended to emulate the
     * @exclude Greasemonkey keyword.
     */
    exclude_globs?: string[];
    /**
     * Excludes pages that this content script would otherwise be injected into.
     */
    exclude_matches?: string[];
    /**
     * Applied after matches to include only those URLs that also match this glob. Intended to
     * emulate the @include Greasemonkey keyword.
     */
    include_globs?: string[];
    /**
     * The list of JavaScript files to be injected into matching pages. These are injected in
     * the order they appear in this array.
     */
    js?: string[];
    /**
     * Whether to insert the content script on about:blank and about:srcdoc.
     */
    match_about_blank?: boolean;
    /**
     * Specifies which pages this content script will be injected into.
     */
    matches: string[];
    /**
     * Controls when the files in js are injected.
     */
    run_at?: RunAt;
    /**
     * The JavaScript world for a script to execute within.
     */
    world?: World;
};

/**
 * Controls when the files in js are injected.
 */
type RunAt = "document_start" | "document_end" | "document_idle";

/**
 * The JavaScript world for a script to execute within.
 */
type World = "ISOLATED" | "MAIN";

/**
 * Declares which extensions, apps, and web pages can connect to your extension via
 * runtime.connect and runtime.sendMessage.
 */
type ExternallyConnectable = {
    /**
     * Indicates that the extension would like to make use of the TLS channel ID of the web page
     * connecting to it. The web page must also opt to send the TLS channel ID to the extension
     * via setting includeTlsChannelId to true in runtime.connect's connectInfo or
     * runtime.sendMessage's options.
     */
    accepts_tls_channel_id?: boolean;
    ids?: string[];
    matches?: string[];
};

type FileBrowserHandler = {
    /**
     * What the button will display.
     */
    default_title: string;
    /**
     * Filetypes to match.
     */
    file_filters: string[];
    /**
     * Used by event handling code to differentiate between multiple file handlers
     */
    id: string;
};

/**
 * One or more icons that represent the extension, app, or theme. Recommended format: PNG;
 * also BMP, GIF, ICO, JPEG.
 */
type Icons = {
    /**
     * Used during installation and in the Chrome Web Store.
     */
    "128"?: string;
    /**
     * Used as the favicon for an extension's pages and infobar.
     */
    "16"?: string;
    /**
     * Used during installation and in the Chrome Web Store.
     */
    "256"?: string;
    /**
     * Used on the extension management page (chrome://extensions).
     */
    "48"?: string;
    [property: string]: any;
};

/**
 * Specify how this extension will behave if allowed to run in incognito mode.
 */
type Incognito = "spanning" | "split" | "not_allowed";

type InputComponent = {
    description: string;
    id: string;
    language: string;
    layouts: any[];
    name: string;
    type: string;
};

type NaclModule = {
    /**
     * The MIME type for which the Native Client module will be registered as content handler.
     */
    mime_type: string;
    /**
     * The location of a Native Client manifest (a .nmf file) within the extension directory.
     */
    path: string;
};

/**
 * Use the Chrome Identity API to authenticate users: the getAuthToken for users logged into
 * their Google Account and the launchWebAuthFlow for users logged into a non-Google account.
 */
type Oauth2 = {
    /**
     * You need to register your app in the Google APIs Console to get the client ID.
     */
    client_id: string;
    scopes: string[];
};

/**
 * The omnibox API allows you to register a keyword with Google Chrome's address bar, which
 * is also known as the omnibox.
 */
type Omnibox = {
    /**
     * The keyword that will trigger your extension.
     */
    keyword: string;
};

/**
 * To allow users to customize the behavior of your extension, you may wish to provide an
 * options page. If you do, an Options link will be shown on the extensions management page
 * at chrome://extensions which opens a dialogue containing your options page.
 */
type OptionsUi = {
    /**
     * If true, a Chrome user agent stylesheet will be applied to your options page. The default
     * value is false, but we recommend you enable it for a consistent UI with Chrome.
     */
    chrome_style?: boolean;
    /**
     * If true, your extension's options page will be opened in a new tab rather than embedded
     * in chrome://extensions. The default is false, and we recommend that you don't change it.
     * This is only useful to delay the inevitable deprecation of the old options UI! It will be
     * removed soon, so try not to use it. It will break.
     */
    open_in_tab?: boolean;
    /**
     * The path to your options page, relative to your extension's root.
     */
    page: string;
    [property: string]: any;
};

/**
 * Technologies required by the app or extension. Hosting sites such as the Chrome Web Store
 * may use this list to dissuade users from installing apps or extensions that will not work
 * on their computer.
 */
type Requirements = {
    /**
     * The '3D' requirement denotes GPU hardware acceleration.
     */
    "3D"?: The3D;
    /**
     * Indicates if an app or extension requires NPAPI to run. This requirement is enabled by
     * default when the manifest includes the 'plugins' field.
     */
    plugins?: Plugins;
};

/**
 * The '3D' requirement denotes GPU hardware acceleration.
 */
type The3D = {
    /**
     * List of the 3D-related features your app requires.
     */
    features: Feature[];
};

type Feature = "webgl";

/**
 * Indicates if an app or extension requires NPAPI to run. This requirement is enabled by
 * default when the manifest includes the 'plugins' field.
 */
type Plugins = {
    npapi: boolean;
};

/**
 * Defines an collection of app or extension pages that are to be served in a sandboxed
 * unique origin, and optionally a Content Security Policy to use with them.
 */
type Sandbox = {
    content_security_policy?: string;
    pages: string[];
};

/**
 * Register itself as a speech engine.
 */
type TtsEngine = {
    /**
     * Voices the extension can synthesize.
     */
    voices: Voice[];
};

type Voice = {
    /**
     * Events sent to update the client on the progress of speech synthesis.
     */
    event_types: EventType[];
    /**
     * If your voice corresponds to a male or female voice, you can use this parameter to help
     * clients choose the most appropriate voice for their application.
     */
    gender?: string;
    /**
     * Almost always, a voice can synthesize speech in just a single language. When an engine
     * supports more than one language, it can easily register a separate voice for each
     * language.
     */
    lang?: string;
    /**
     * Identifies the name of the voice and the engine used.
     */
    voice_name: string;
};

type EventType = "start" | "word" | "sentence" | "marker" | "end" | "error";

/**
 * Background settings
 * @see https://developer.chrome.com/docs/extensions/develop/concepts/service-workers
 */
type Background = {
    service_worker?: string;
    type?: "module";
    [property: string]: any;
};

type _PermissionsType =
    | "accessibilityFeatures.modify,accessibilityFeatures.read,activeTab,alarms,audio,background"
    | "bookmarks,browsingData,certificateProvider,contentSettings,contextMenus,cookies,debugger"
    | "declarativeContent,declarativeNetRequest,declarativeNetRequestWithHostAccess"
    | "declarativeNetRequestFeedback,dns,desktopCapture,documentScan,downloads,downloads.open"
    | "downloads.ui,enterprise.deviceAttributes,enterprise.hardwarePlatform"
    | "enterprise.networkingAttributes,enterprise.platformKeys,favicon,fileBrowserHandler"
    | "fileSystemProvider,fontSettings,gcm,geolocation,history,identity,idle,loginState,management"
    | "nativeMessaging,notifications,offscreen,pageCapture,platformKeys,power,printerProvider"
    | "printing,printingMetrics,privacy,processes,proxy,runtime,scripting,search,sessions,sidePanel"
    | "storage,system.cpu,system.display,system.memory,system.storage,tabCapture,tabGroups,tabs"
    | "topSites,tts,ttsEngine,unlimitedStorage,vpnProvider,wallpaper,webAuthenticationProxy"
    | "webNavigation,webRequest,webRequestBlocking";

/**
 * Permissions help to limit damage if your extension or app is compromised by malware. Some
 * permissions are also displayed to users before installation, as detailed in Permission Warnings.
 */
type PermissionsType = Separated<_PermissionsType>;

type Split<S extends string, D extends string> = string extends S
    ? string[]
    : S extends `${infer T}${D}${infer U}`
    ? [T, ...Split<U, D>]
    : S extends `${infer T}`
    ? [T]
    : never;

type Separated<S extends string> = Split<S, ",">[number];
