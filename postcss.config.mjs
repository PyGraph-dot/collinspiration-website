// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // This is the correct plugin for Tailwind CSS v3.
    // Ensure "tailwindcss": "^3.x.x" is in your package.json devDependencies.
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
