import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      //  Light Mode
      l_onBackground: {
        100: "#211d1a",
        200: "#332d29",
      },
      l_background: {
        100: "#f3f2ff",
        200: "#e2e1ed",
      },
      l_primary: {
        100: "#CCDAD1",
      },
      l_secondary: {
        100: "#86B1F3",
      },
      l_accent1: {
        100: "#83bcff",
      },
      l_accent2: {
        100: "#e71d36",
      },
      l_accent3: {
        100: "#45cb85",
      },
      l_accent4: {
        100: "#745296",
      },
      //  Dark mode
      d_onBackground: {
        100: "#f3f2ff",
        200: "#e2e1ed",
      },
      d_background: {
        100: "#211d1a",
        200: "#332d29",
      },
      d_primary: {
        100: "#243229",
      },
      d_secondary: {
        100: "#0C3779",
      },
      d_accent1: {
        100: "#4C4E76",
      },
      d_accent2: {
        100: "#7f2b28",
      },
      d_accent3: {
        100: "#32583F",
      },
      d_accent4: {
        100: "#493754",
      },
    },
    extend: {},
  },
  plugins: [],
} satisfies Config

