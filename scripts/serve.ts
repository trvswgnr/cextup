import { withCors } from "./lib";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        return await fileRouter(request);
    },
});

async function fileRouter(request: Request) {
    const url = new URL(request.url);
    const { pathname } = url;
    const matchingHeaders = await getHeaders(pathname);
    // handle CORS preflight requests
    if (request.method === "OPTIONS") {
        return new Response("c00lb34nz", { headers: withCors(matchingHeaders) });
    }
    let filepath = pathname.replace(/^\//, "").replace(/\/$/, "");
    if (filepath === "") {
        filepath = "index";
    }
    const pathToFile = path.join(__dirname, `../${filepath}`);
    const handler = await import(pathToFile) // import uses relative path from current file
        .then((m) => m.default as Handler)
        .catch(() => null);
    if (!handler || typeof handler !== "function") {
        const filepaths = [filepath, `${filepath}.html`].map((f) =>
            path.join(__dirname, `../${f}`),
        );
        const files = filepaths.map((f) => Bun.file(f)); // Bun.file uses relative path from project root
        const exists = await Promise.all(files.map((f) => f.exists()));
        const file = files[exists.indexOf(true)];
        if (!file) {
            return new Response(JSON.stringify({ error: "not found" }), {
                status: 404,
                headers: withCors({ "content-type": "application/json" }),
            });
        }
        const res = new Response(file);
        const headers = withCors(
            Object.assign(Object.fromEntries(res.headers.entries()), matchingHeaders),
        );
        return new Response(res.body, { status: res.status, headers });
    }
    const handlerResponse = await handler(request);
    const body = handlerResponse.body;
    const headers = withCors(
        Object.assign(Object.fromEntries(handlerResponse.headers.entries()), matchingHeaders),
    );
    const status = handlerResponse.status;
    return new Response(body, { status, headers });
}

console.log(`server running at ${server.url}`);

/** get the headers for a given url's pathname by matching the pathname against the vercel.json headers */
async function getHeaders(pathname: string): Promise<Bun.HeadersInit> {
    const pathToFile = path.join(__dirname, "../vercel.json");
    const vercelConfig: Record<string, unknown> = await import(pathToFile)
        .then((m) => m.default)
        .catch(() => null);
    const headers: Bun.HeadersInit = {};
    if (!vercelConfig || !Array.isArray(vercelConfig.headers)) {
        return headers;
    }
    let regex: RegExp;
    for (const entry of vercelConfig.headers) {
        regex = new RegExp(entry.source);
        if (regex.test(pathname)) {
            for (const item of entry.headers) {
                headers[item.key] = item.value;
            }
        }
    }
    return headers;
}

type Handler = (request: Request) => Promise<Response>;
