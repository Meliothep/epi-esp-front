/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
			extend: {
			colors: {
				brandStart: '#4B1E4E',
				brandEnd: '#162C44',
				ink: '#0b0e12',
				cloud: 'rgba(255,255,255,0.06)'
			},
			fontFamily: {
				display: ['Cinzel', 'serif'],
				old: ['IM Fell English SC', 'serif']
			},
			boxShadow: {
				insetGlow: 'inset 0 0 40px rgba(148, 163, 184, 0.2)',
				soft: '0 10px 30px rgba(0,0,0,0.25)'
			},
			backgroundImage: {
				'brand-gradient': 'linear-gradient(135deg, #4B1E4E 0%, #162C44 100%)'
			}
		}
	},
	plugins: []
};


