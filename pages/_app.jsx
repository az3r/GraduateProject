/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { CookiesProvider } from 'react-cookie';
import Head from 'next/head';
import SnackBarProvider from '@hooks/snackbar';
import { LightTheme } from '../styles/themes';
import AuthProvider from '../hooks/auth';
import '../styles/edit.css';
import '../styles/ckeditor.css';

function MainApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={LightTheme}>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
      <CssBaseline>
        <AuthProvider>
          <CookiesProvider>
            <SnackBarProvider>
              <Component {...pageProps} />
            </SnackBarProvider>
          </CookiesProvider>
        </AuthProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default MainApp;
