import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Turbopack can fail to resolve `next` on Windows + OneDrive paths with spaces.
// Pin the project root so Turbopack works if you opt back in via `next dev --turbopack`.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
