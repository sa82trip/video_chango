module.exports = {
  important: true,
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        200: "100vh",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
