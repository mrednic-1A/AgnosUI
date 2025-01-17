import {sveltekit} from '@sveltejs/kit/vite';
import path from 'path';
import type {ProxyOptions} from 'vite';
import {defineConfig} from 'vite';
import pkg from '../core/package.json';
import {copySamples} from './scripts/copySamples.plugin';
import {docExtractor} from './scripts/doc.plugin';
import {includeSamples} from './scripts/includeSamples.plugin';
import {emitFile} from './scripts/emitFile.plugin';
import http from 'http';

const proxy: Record<string, string | ProxyOptions> = {
	'/angular/samples': {
		target: 'http://localhost:4200',
		ws: true,
		agent: new http.Agent({keepAlive: true}),
	},
	'/react/samples': {
		target: 'http://localhost:3000',
		ws: true,
		agent: new http.Agent({keepAlive: true}),
	},
	'/svelte/samples': {
		target: 'http://localhost:3001',
		ws: true,
		agent: new http.Agent({keepAlive: true}),
	},
};

const version = JSON.stringify((pkg as any).version ?? '0.0.0');

// https://vitejs.dev/config/
export default defineConfig({
	envDir: path.join(__dirname, 'env'),
	server: {
		port: 4000,
		proxy,
		fs: {
			allow: [path.join(__dirname, 'generated'), path.join(__dirname, '../docs')],
		},
	},
	build: {
		emptyOutDir: true,
	},
	preview: {
		port: 4000,
		proxy: {},
	},
	plugins: [
		copySamples(),
		includeSamples(),
		sveltekit(),
		docExtractor(),
		emitFile({type: 'asset', fileName: 'version.json', name: 'version.json', source: version}),
	],
	define: {
		'import.meta.env.AGNOSUI_VERSION': version,
	},
	optimizeDeps: {
		include: [
			'@amadeus-it-group/tansu',
			'highlight.js/lib/core',
			'highlight.js/lib/languages/typescript',
			'highlight.js/lib/languages/css',
			'highlight.js/lib/languages/scss',
			'highlight.js/lib/languages/xml',
			'highlight.js/lib/languages/bash',
			'@floating-ui/dom',
			'svelte-markdown',
			'marked',
			'mermaid',
		],
	},
});
