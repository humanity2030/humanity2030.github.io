import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import UnheadVite from '@unhead/addons/vite'
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { pagesGenerator } from './plugins/pages-generator'
import { feedGenerator } from './plugins/feed-generator'
import { remarkRDFa } from './plugins/remark-rdfa'

export default defineConfig({
	base: '/',
	plugins: [
        mdx({
            remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkRDFa],
            providerImportSource: "@mdx-js/preact",
        }),
        pagesGenerator(),
		feedGenerator(),
		preact({
			prerender: { enabled: true, renderTarget: '#app' }
		}),
		tailwindcss(),
        UnheadVite(),
	],
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    }
});