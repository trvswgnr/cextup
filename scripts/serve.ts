import handler from "../api/auth";
import vercelConfig from "../vercel.json";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type",
};

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            const res = new Response("Departed", { headers: CORS_HEADERS });
            return res;
        }
        const url = new URL(request.url);
        const { pathname } = url;
        const matchingHeaders = getHeaders(pathname);
        if (pathname === "/api/auth") {
            const handlerResponse = await handler(request);
            const body = await handlerResponse.json();
            const headers = Object.assign(
                Object.fromEntries(handlerResponse.headers.entries()),
                matchingHeaders,
            );
            const status = handlerResponse.status;
            return new Response(JSON.stringify(body), {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, POST",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }
        return new Response(JSON.stringify({ message: "hello from Bun" }), {
            status: 200,
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    },
});

console.log(`server running at ${server.url}`);

/** get the headers for a given pathname from vercel.json */
function getHeaders(pathname: string): Bun.HeadersInit {
    const vercelConfigHeaders = vercelConfig.headers;
    let headers: Bun.HeadersInit = {};
    let regex: RegExp;
    for (const entry of vercelConfigHeaders) {
        regex = new RegExp(entry.source);
        if (regex.test(pathname)) {
            for (const item of entry.headers) {
                headers[item.key] = item.value;
            }
        }
    }
    return headers;
}
