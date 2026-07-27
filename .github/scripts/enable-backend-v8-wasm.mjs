import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const backendRoot = resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
    throw new Error("Usage: node enable-backend-v8-wasm.mjs <backend-v8-root>");
}

const files = [
    ["windows_64.cmd", 2],
    ["android_armv7.sh", 2],
    ["android_armv8.sh", 2],
];

for (const [relativePath, expectedReplacements] of files) {
    const path = resolve(backendRoot, relativePath);
    const source = readFileSync(path, "utf8");
    const matches = source.match(/v8_enable_webassembly=false/g) ?? [];

    if (matches.length !== expectedReplacements) {
        throw new Error(
            `${relativePath}: expected ${expectedReplacements} disabled WASM flags, found ${matches.length}`,
        );
    }

    const updated = source.replaceAll(
        "v8_enable_webassembly=false",
        "v8_enable_webassembly=true",
    );
    writeFileSync(path, updated);
    console.log(`${relativePath}: enabled WebAssembly (${matches.length} replacements)`);
}
