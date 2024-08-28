import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				accent: colors.blue
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
