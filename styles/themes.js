import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

// enhance theme for responsive font sizes
// read https://material-ui.com/customization/typography/#responsive-font-sizes
// read https://material-ui.com/customization/theming/#responsivefontsizes-theme-options-theme
const LightTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: "light",
    },
  })
);

const DarkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: "dark",
    },
  })
);

export { LightTheme, DarkTheme };
