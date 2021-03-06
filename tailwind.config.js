module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
       height: {
      "10v": "10vh",
      "20v": "20vh",
      "30v": "30vh",
      "40v": "40vh",
      "50v": "50vh",
      "60v": "60vh",
      "70v": "70vh",
      "80v": "80vh",
      "90v": "90vh",
      "100v": "100vh",
      "10%" : "10%",
      "35%" : "35%",
      "55%" : "55%",
      "90%" : "90%",
    }},
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
      '600px': '600px',
     }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
