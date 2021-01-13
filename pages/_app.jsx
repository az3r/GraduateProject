import * as React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { LightTheme, DarkTheme } from "../styles/themes";
import { AuthProvider } from "../hooks/auth";

function MainApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default MainApp;
