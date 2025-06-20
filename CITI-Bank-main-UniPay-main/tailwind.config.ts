
// import type { Config } from "tailwindcss";

// export default {
// 	darkMode: ["class"],
// 	content: [
// 		"./pages/**/*.{ts,tsx}",
// 		"./components/**/*.{ts,tsx}",
// 		"./app/**/*.{ts,tsx}",
// 		"./src/**/*.{ts,tsx}",
// 	],
// 	prefix: "",
// 	theme: {
// 		container: {
// 			center: true,
// 			padding: '2rem',
// 			screens: {
// 				'2xl': '1400px'
// 			}
// 		},
// 		extend: {
// 			colors: {
// 				border: 'hsl(var(--border))',
// 				input: 'hsl(var(--input))',
// 				ring: 'hsl(var(--ring))',
// 				background: 'hsl(var(--background))',
// 				foreground: 'hsl(var(--foreground))',
// 				primary: {
// 					DEFAULT: 'hsl(var(--primary))',
// 					foreground: 'hsl(var(--primary-foreground))'
// 				},
// 				secondary: {
// 					DEFAULT: 'hsl(var(--secondary))',
// 					foreground: 'hsl(var(--secondary-foreground))'
// 				},
// 				destructive: {
// 					DEFAULT: 'hsl(var(--destructive))',
// 					foreground: 'hsl(var(--destructive-foreground))'
// 				},
// 				muted: {
// 					DEFAULT: 'hsl(var(--muted))',
// 					foreground: 'hsl(var(--muted-foreground))'
// 				},
// 				accent: {
// 					DEFAULT: 'hsl(var(--accent))',
// 					foreground: 'hsl(var(--accent-foreground))'
// 				},
// 				popover: {
// 					DEFAULT: 'hsl(var(--popover))',
// 					foreground: 'hsl(var(--popover-foreground))'
// 				},
// 				card: {
// 					DEFAULT: 'hsl(var(--card))',
// 					foreground: 'hsl(var(--card-foreground))'
// 				},
// 				purple: {
// 					50: '#f5f3ff',
// 					100: '#ede9fe',
// 					200: '#ddd6fe',
// 					300: '#c4b5fd',
// 					400: '#a78bfa',
// 					500: '#8b5cf6',
// 					600: '#7c3aed',
// 					700: '#6d28d9',
// 					800: '#5b21b6',
// 					900: '#4c1d95',
// 				}
// 			},
// 			borderRadius: {
// 				lg: 'var(--radius)',
// 				md: 'calc(var(--radius) - 2px)',
// 				sm: 'calc(var(--radius) - 4px)'
// 			},
// 			keyframes: {
// 				'accordion-down': {
// 					from: {
// 						height: '0'
// 					},
// 					to: {
// 						height: 'var(--radix-accordion-content-height)'
// 					}
// 				},
// 				'accordion-up': {
// 					from: {
// 						height: 'var(--radix-accordion-content-height)'
// 					},
// 					to: {
// 						height: '0'
// 					}
// 				}
// 			},
// 			animation: {
// 				'accordion-down': 'accordion-down 0.2s ease-out',
// 				'accordion-up': 'accordion-up 0.2s ease-out'
// 			},
// 			backgroundImage: {
// 				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
// 				'gradient-purple': 'linear-gradient(to right, #7c3aed, #8b5cf6, #a78bfa)',
// 			}
// 		}
// 	},
// 	plugins: [require("tailwindcss-animate")],
// } satisfies Config;


import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(212, 100%, 47%)', // Citibank Primary Blue #0052cc
					foreground: 'hsl(0, 0%, 100%)' // White text on blue background
				},
				secondary: {
					DEFAULT: 'hsl(210, 17%, 82%)', // Light blue-grey #cdd7e0
					foreground: 'hsl(212, 100%, 47%)' // Citibank blue text on light background
				},
				destructive: {
					DEFAULT: 'hsl(352, 100%, 48%)', // Citibank Red #dc1431
					foreground: 'hsl(0, 0%, 100%)' // White text on red background
				},
				muted: {
					DEFAULT: 'hsl(210, 40%, 96%)', // Very light blue-grey #f4f6f8
					foreground: 'hsl(215, 13%, 34%)' // Dark grey text
				},
				accent: {
					DEFAULT: 'hsl(199, 89%, 48%)', // Citibank Light Blue #057fbd
					foreground: 'hsl(0, 0%, 100%)' // White text on accent background
				},
				popover: {
					DEFAULT: 'hsl(0, 0%, 100%)', // Pure white
					foreground: 'hsl(215, 13%, 34%)' // Dark grey text
				},
				card: {
					DEFAULT: 'hsl(0, 0%, 100%)', // Pure white
					foreground: 'hsl(215, 13%, 34%)' // Dark grey text
				},
				// Extended Citibank color palette
				citi: {
					// Primary Blues
					'blue-50': '#e6f0ff',
					'blue-100': '#b3d1ff',
					'blue-200': '#80b3ff',
					'blue-300': '#4d94ff',
					'blue-400': '#1a75ff',
					'blue-500': '#0052cc', // Primary Citibank Blue
					'blue-600': '#004bb8',
					'blue-700': '#0043a3',
					'blue-800': '#003c8f',
					'blue-900': '#00347a',
					
					// Light Blues
					'light-blue-50': '#e8f4fd',
					'light-blue-100': '#c2e2f9',
					'light-blue-200': '#9bd0f5',
					'light-blue-300': '#75bef1',
					'light-blue-400': '#4eaced',
					'light-blue-500': '#057fbd', // Citibank Light Blue
					'light-blue-600': '#0472aa',
					'light-blue-700': '#046597',
					'light-blue-800': '#035984',
					'light-blue-900': '#024c71',
					
					// Reds
					'red-50': '#fde8ec',
					'red-100': '#f9c2cc',
					'red-200': '#f59cac',
					'red-300': '#f1768c',
					'red-400': '#ed506c',
					'red-500': '#dc1431', // Citibank Red
					'red-600': '#c6122c',
					'red-700': '#b01027',
					'red-800': '#9a0e22',
					'red-900': '#840c1d',
					
					// Greys
					'grey-50': '#f8f9fa',
					'grey-100': '#e9ecef',
					'grey-200': '#dee2e6',
					'grey-300': '#ced4da',
					'grey-400': '#adb5bd',
					'grey-500': '#6c757d',
					'grey-600': '#495057',
					'grey-700': '#343a40',
					'grey-800': '#212529',
					'grey-900': '#1a1d20',
				},
				// Keep purple for backward compatibility but adjust to complement Citibank theme
				purple: {
					50: '#f0f4ff',
					100: '#e0e9ff',
					200: '#c7d6ff',
					300: '#a4b8ff',
					400: '#8194ff',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-citi': 'linear-gradient(to right, #0052cc, #057fbd, #4d94ff)',
				'gradient-citi-red': 'linear-gradient(to right, #dc1431, #ed506c, #f59cac)',
				'gradient-purple': 'linear-gradient(to right, #4338ca, #6366f1, #8194ff)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;