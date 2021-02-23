import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';

// enhance theme for responsive font sizes
// read https://material-ui.com/customization/typography/#responsive-font-sizes
// read https://material-ui.com/customization/theming/#responsivefontsizes-theme-options-theme
const LightTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        light: '#4cb273',
        main: '#088247',
        dark: '#00541e',
        contrastText: '#fff',
      },
      secondary: {
        light: '#c25466',
        main: '#8e243c',
        dark: '#5b0017',
        contrastText: '#fff',
      },
    },
  })
);

const DarkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
    },
  })
);

export { LightTheme, DarkTheme };
