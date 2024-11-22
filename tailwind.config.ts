import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sansInter: ["var(--font-inter)"], // Add your Google Font here
        workSans: ["var(--font-workSans)"], // Add your Google Font here
        montserrat: ["var(--font-montserrat)"], // Add your Google Font here
      },
    },
  },
  plugins: [],
};
export default config;
