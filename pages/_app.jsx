/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { CookiesProvider } from 'react-cookie';
import { LightTheme } from '../styles/themes';
import AuthProvider from '../hooks/auth';
import '../styles/edit.css';

function MainApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={LightTheme}>
      <CssBaseline>
        <AuthProvider>
          <CookiesProvider>
            <Component {...pageProps} />
          </CookiesProvider>
        </AuthProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default MainApp;
