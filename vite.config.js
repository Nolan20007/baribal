import { defineConfig } from "vite";

// GitHub Pages is hosted under /baribal/; Timeweb serves the site from the domain root.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGitHubPages ? "/baribal/" : "/",
});
