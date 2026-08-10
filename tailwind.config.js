/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
          DEFAULT: '#F16F23',
          secondary: '#FF8901',
          highlight: '#FFBD28',
          grounded: '#736F26',
        },
        surface: {
          DEFAULT: '#F2F8FC',
          alt: '#E7F1F8',
          // Formerly cream.light. Sits above surface.DEFAULT, not below it, so
          // "bright" rather than "light".
          bright: '#FAFCFE',
        },
        // WhatsApp's own brand green. It existed only as a CSS variable, with no
        // Tailwind mapping, so callers either wrote bg-[var(--color-whatsapp)] or
        // pasted the hex, and the two hover values drifted: Navigation hardcoded
        // #20bd5a while the token said #128C7E. Mapped here so there is one source.
        whatsapp: {
          DEFAULT: 'var(--color-whatsapp)',
          dark: 'var(--color-whatsapp-hover)',
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
        /*
         * Orange, split by job rather than by shade.
         *
         * DEFAULT is the Orange Jelly brand orange, hsl(22 88% 54%). `dark` and
         * `darker` are the same hue and saturation stepped down in lightness, so
         * the whole ramp is one brand colour at three jobs rather than three
         * colours. Never substitute a Tailwind stock orange here: the numbers
         * below are what src/test/design-tokens.contrast.test.ts asserts, and it
         * fails the build if a change breaks them.
         *
         * DEFAULT  brand. 4.55:1 on the navy header, so it is the accent for text
         *          and figures on dark surfaces. It is 2.98:1 under white and
         *          2.79:1 on cream, so it must never sit behind white body text
         *          or act as text on a light surface. Borders, decorative fills
         *          and large display type on light surfaces are fine.
         * dark     the interactive orange: solid CTA fills with white text
         *          (5.74:1) and links on light surfaces (5.36:1 on cream). Also clears 4.5:1
         *          on the warm bg-orange/10 tints used by chips and ghost buttons.
         * darker   the hover partner for `dark`, 7.46:1 white and 6.96:1 on cream.
         *          A resting state already at the AA floor needs a hover that
         *          moves further into contrast, not back out of it.
         *
         * The direction reverses by surface. On cream you go darker to gain
         * contrast; on navy you go lighter. That is why `Link` carries both an
         * `orange` and an `orange-on-dark` colour rather than one.
         */
        orange: {
          light: '#FFF2D4',
          DEFAULT: '#F16F23',
          dark: '#AD460B',
          darker: '#903B09',
        },
        /*
         * `teal`, `cream` and `charcoal` used to live here as aliases, and all three
         * names lied about what they resolved to: `teal` was blue #01619E, `cream`
         * was pale blue #F2F8FC, `charcoal` was navy #1A2F49. They have been
         * retired in favour of the canonical names at the top of this block:
         *
         *   charcoal       -> brand-base           #1A2F49
         *   charcoal-light -> brand-base-light     #324A68
         *   charcoal-dark  -> brand-base-dark      #122133
         *   cream          -> surface              #F2F8FC
         *   cream-light    -> surface-bright       #FAFCFE
         *   cream-dark     -> surface-alt          #E7F1F8
         *   teal           -> blue-support         #01619E
         *   teal-light     -> blue-support-light   #2B84B9
         *   teal-dark      -> brand-base           #1A2F49  <- note
         *
         * That last one is the reason the aliases were worth removing rather than
         * just renaming: `teal-dark` never resolved to a dark teal at all, it
         * resolved to the navy base, so `bg-teal hover:bg-teal-dark` was a blue
         * button hovering to navy. blue-support.dark (#014D7E) is a different
         * colour and was never what those call sites rendered.
         *
         * They are deliberately not kept as deprecated aliases. Tailwind silently
         * drops an unknown colour rather than failing, so leaving both spellings
         * live is how a codebase ends up with two half-migrated palettes.
         */
      },
      // `--radius` was declared in globals.css but never mapped here, so it was a
      // dead token: 157 rounded-lg/rounded-md usages silently took Tailwind's
      // defaults and editing --radius changed nothing. Now it drives them.
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      /*
       * Control sizes.
       *
       * Every one of these existed already as a hardcoded arbitrary value:
       * `[44px]` 30 times, `[48px]` and `[56px]` a handful each. Naming them means
       * the accessibility floor has one definition instead of thirty, and a change
       * to --tap-target-size actually propagates.
       *
       * tap        44px, the iOS tap-target guideline this site already aimed at
       * control    48px, comfortable default for a primary control
       * control-lg 56px, hero-scale control
       */
      spacing: {
        tap: 'var(--tap-target-size)',
        control: '3rem',
        'control-lg': '3.5rem',
      },
      minHeight: {
        tap: 'var(--tap-target-size)',
        control: '3rem',
        'control-lg': '3.5rem',
      },
      minWidth: {
        tap: 'var(--tap-target-size)',
      },
      /*
       * Elevation, tinted rather than neutral.
       *
       * Tailwind's defaults shadow with pure black, which greys out against this
       * palette's blue-tinted surfaces. These use the brand navy (26 47 73) at
       * slightly higher alpha, since a tinted shadow reads lighter than a black one
       * at the same opacity. Geometry is kept identical to Tailwind's ramp so the
       * 69 existing shadow-* usages keep the elevation they were designed with and
       * only the hue changes.
       */
      boxShadow: {
        sm: '0 1px 2px 0 rgb(26 47 73 / 0.06)',
        DEFAULT: '0 1px 3px 0 rgb(26 47 73 / 0.10), 0 1px 2px -1px rgb(26 47 73 / 0.08)',
        md: '0 4px 6px -1px rgb(26 47 73 / 0.10), 0 2px 4px -2px rgb(26 47 73 / 0.08)',
        lg: '0 10px 15px -3px rgb(26 47 73 / 0.12), 0 4px 6px -4px rgb(26 47 73 / 0.10)',
        xl: '0 20px 25px -5px rgb(26 47 73 / 0.14), 0 8px 10px -6px rgb(26 47 73 / 0.10)',
        '2xl': '0 25px 50px -12px rgb(26 47 73 / 0.28)',
        inner: 'inset 0 2px 4px 0 rgb(26 47 73 / 0.06)',
        none: 'none',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-heading)', 'ui-serif', 'Georgia', 'serif'],
        heading: ['var(--font-heading)', 'ui-serif', 'Georgia', 'serif'],
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
  // tailwindcss-animate supplies animate-in/animate-out/fade-in/zoom-in/
  // slide-in-from-*, which ui/sheet, ui/navigation-menu, ui/tooltip, ui/dialog,
  // ui/select, MobileScrollPrompt and AlertAdapter all ship. Without the plugin
  // registered those class names generated no CSS at all (`animation-name: none`),
  // so every Radix enter/exit transition snapped instantly.
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
