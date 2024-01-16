import fs from "fs";
import type { Server } from "bun";

const decoder = new TextDecoder();
let colorFn = 0;

export async function printStream(stream: ReadableStream<Uint8Array>, name?: string) {
    const color = getColorFn(colorFn++);
    let newlineEncountered = false;
    for await (const data of stream) {
        const tag = name ? `${color(`[${name}]`)}: ` : "";
        const str = decoder.decode(data);
        const lines = str.split("\n").filter((x) => x.length > 0);
        if (newlineEncountered) {
            process.stdout.write("\n");
            newlineEncountered = false;
        }
        for (const line of lines) {
            if (line.trim().length > 0) {
                process.stdout.write(tag + line.trim() + "\n");
            } else {
                newlineEncountered = true;
            }
        }
    }
}

function getColorFn(index?: number) {
    const colors = [
        "\x1b[36m", // cyan
        "\x1b[34m", // blue
        "\x1b[35m", // magenta
        "\x1b[32m", // green
        "\x1b[33m", // yellow
    ];
    if (index !== undefined) {
        return (str: string) => colors[index % colors.length] + str + "\x1b[0m";
    }
    const color = colors[Math.floor(Math.random() * colors.length)];
    return (str: string) => color + str + "\x1b[0m";
}
