module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 50s linear infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bazar: {
          primary: "#14784a",
          "primary-content": "#ffffff",
          secondary: "#f2a31b",
          "secondary-content": "#2b1d00",
          accent: "#e4572e",
          neutral: "#14261c",
          "neutral-content": "#e8f1ea",
          "base-100": "#ffffff",
          "base-200": "#f1f5f1",
          "base-300": "#dce5dd",
          "base-content": "#14261c",
          success: "#15803d",
          error: "#e11d48",
        },
      },
    ],
  },
};
