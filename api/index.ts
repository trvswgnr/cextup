export const config = { runtime: "edge" };

export default async function handler(request: Request) {
    return new Response(JSON.stringify({ message: "hello darkness my old friend" }), {
        status: 200,
        headers: { "content-type": "application/json" },
    });
}
