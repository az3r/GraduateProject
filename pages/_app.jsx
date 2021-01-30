import * as React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { LightTheme, DarkTheme } from "../styles/themes";
import "../styles/global.css";

function MainApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={LightTheme}>
      <CssBaseline>
        <Component {...pageProps} />
      </CssBaseline>
    </ThemeProvider>
  );
}

export default MainApp;
