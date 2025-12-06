/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at top, rgba(244,114,182,0.2), transparent 55%), radial-gradient(circle at bottom, rgba(52,211,153,0.15), transparent 55%)",
      },
    },
  },
};
