// Ekspor statis untuk GitHub Pages.
// Untuk repo project (https://org.github.io/kodequest/), set NEXT_PUBLIC_BASE_PATH=/kodequest
// Workflow deploy di .github/workflows/deploy.yml mengisinya otomatis.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
