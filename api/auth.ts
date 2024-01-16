export const config = {
    runtime: "edge",
};

const JSON_HEADERS = { "content-type": "application/json" };

export default async function handler(request: Request) {
    if (request.method === "GET") {
        const url = new URL(request.url);
        const saved = url.searchParams.get("saved");
        if (!saved) return badRequest();
        const token = await getAccessToken(true).catch(None);
        if (!token) return serverError("access token not found");
        console.log("got saved token", token);
        return success({ token });
    }
    const { code } = await getJson<AnyObj>(request, {});
    if (!code) return badRequest();
    const token = await getAccessToken(String(code)).catch(None);
    if (!token) return serverError("missing access token");
    return success({ token });
}

function success(data: AnyObj) {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: JSON_HEADERS,
    });
}

function tryFn<F extends (...args: any[]) => any>(fn: F, ...args: Parameters<F>) {
    try {
        return fn(...args);
    } catch (e) {
        return None();
    }
}

function badRequest(error = "bad request") {
    return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: JSON_HEADERS,
    });
}

function serverError(error: string, status?: number) {
    return new Response(JSON.stringify({ error }), {
        status: status ?? 500,
        headers: JSON_HEADERS,
    });
}

async function getJson<T>(res: Response | Request, _default: T): Promise<T> {
    return (await res.json().catch(() => _default)) as T;
}

async function getAccessToken(getFromEnv: boolean): Promise<string>;
async function getAccessToken(code: string): Promise<string>;
async function getAccessToken(a: string | boolean) {
    if (process.env.GITHUB_TOKEN && a === true) return process.env.GITHUB_TOKEN;
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        throw new Error("missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET");
    }
    const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: a,
        }),
    });

    const { access_token } = await getJson<AnyObj>(res, {});
    if (!access_token) throw new Error("missing access token");
    return String(access_token);
}

type AnyObj = Record<PropertyKey, unknown>;

type None = null;
function None(): None {
    return null;
}
