import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: [
		'variant',
		[
			'@media (prefers-color-scheme: dark) { &:not([data-weblah-color-scheme="light"] *) }',
			'&:is([data-weblah-color-scheme="dark"] *)'
		]
	],

	theme: {
		extend: {
			colors: {
				accent: colors.blue,
				// Semantic Background
				sb: {
					overlay: 'var(--weblah-color-sb-overlay)',
					primary: 'var(--weblah-color-sb-primary)',
					secondary: 'var(--weblah-color-sb-secondary)',
					tertiary: 'var(--weblah-color-sb-tertiary)'
				},
				// Semantic Foreground
				sf: {
					primary: 'var(--weblah-color-sf-primary)',
					secondary: 'var(--weblah-color-sf-secondary)',
					tertiary: 'var(--weblah-color-sf-tertiary)'
				},
				// Semantic Stroke
				ss: {
					primary: 'var(--weblah-color-ss-primary)',
					secondary: 'var(--weblah-color-ss-secondary)'
				}
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
