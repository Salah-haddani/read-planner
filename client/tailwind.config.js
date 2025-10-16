export const content = ["./src/**/*.{js,jsx,ts,tsx}"];

export const theme = {
  extend: {
    keyframes: {
      "fade-in-up": {
        "0%": {
          opacity: "0",
          transform: "translateY(10px)",
        },
        "100%": {
          opacity: "1",
          transform: "translateY(0)",
        },
      },
    },
    animation: {
      "fade-in-up": "fade-in-up 0.3s ease-out forwards",
    },
    colors: {
      primary: "#3b82f6",
      brown: {
        800: "#5C4D3D",
        900: "#3E3529",
      },
    },
    animation: {
      "gradient-x": "gradient-x 3s ease infinite",
      scroll: "scroll 30s linear infinite", // 👈 add this
    },
    keyframes: {
      "gradient-x": {
        "0%, 100%": {
          "background-size": "200% 200%",
          "background-position": "left center",
        },
        "50%": {
          "background-size": "200% 200%",
          "background-position": "right center",
        },
      },
      scroll: {
        // 👈 add this
        "0%": { transform: "translateX(0%)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
  },
};

export const plugins = [
  require("tailwindcss-animate"),
  require("@tailwindcss/aspect-ratio"),
];
