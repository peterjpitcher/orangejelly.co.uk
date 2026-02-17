/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canonical brand palette
        'brand-base': {
          DEFAULT: '#1A2F49',
          light: '#324A68',
          dark: '#122133',
        },
        'blue-support': {
          DEFAULT: '#01619E',
          light: '#2B84B9',
          dark: '#014D7E',
        },
        brand: {
          DEFAULT: '#F65403',
          secondary: '#FF8901',
          highlight: '#FFBD28',
          grounded: '#736F26',
        },
        surface: {
          DEFAULT: '#F2F8FC',
          alt: '#E7F1F8',
        },

        // shadcn semantic palette
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Backward-compatible aliases
        orange: {
          DEFAULT: '#F65403',
          light: '#FFF2D4',
          dark: '#FF8901',
        },
        teal: {
          DEFAULT: '#01619E',
          light: '#2B84B9',
          dark: '#1A2F49',
        },
        cream: {
          DEFAULT: '#F2F8FC',
          light: '#FAFCFE',
          dark: '#E7F1F8',
        },
        charcoal: {
          DEFAULT: '#1A2F49',
          light: '#324A68',
          dark: '#122133',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'var(--font-heading)',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        heading: [
          'var(--font-heading)',
          'ui-serif',
          'Georgia',
          'serif',
        ],
      },
      backgroundImage: {
        'gradient-stripe':
          'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.charcoal.DEFAULT'),
            h1: {
              color: theme('colors.charcoal.DEFAULT'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.charcoal.DEFAULT'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.charcoal.DEFAULT'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.charcoal.DEFAULT'),
              fontWeight: '600',
            },
            strong: {
              color: theme('colors.charcoal.DEFAULT'),
              fontWeight: '600',
            },
            a: {
              color: theme('colors.brand.DEFAULT'),
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': {
                color: theme('colors.brand.secondary'),
                textDecorationThickness: '2px',
              },
            },
            blockquote: {
              borderLeftColor: theme('colors.brand.DEFAULT'),
              fontStyle: 'italic',
            },
            code: {
              color: theme('colors.brand.DEFAULT'),
              backgroundColor: theme('colors.cream.DEFAULT'),
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.charcoal.DEFAULT'),
              color: theme('colors.cream.DEFAULT'),
            },
            ul: {
              'li::marker': {
                color: theme('colors.brand.DEFAULT'),
              },
            },
            ol: {
              'li::marker': {
                color: theme('colors.brand.DEFAULT'),
              },
            },
          },
        },
      }),
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
