import { Box, Link as MaterialLink, Typography } from "@material-ui/core";
import React from "react";
import firebase from "../libs/firebase_client";
import Head from "next/head";
import Link from "next/link";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById("loader").style.display = "none";
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      signInSuccessUrl: "https://graduate-project.vercel.app/",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      tosUrl: "https://www.example.com",
      // Privacy policy url.
      privacyPolicyUrl: "https://www.example.com",
    };
  }
  componentDidMount() {
    const firebaseui = require("firebaseui");
    if (firebaseui.auth.AuthUI.getInstance()) {
      const ui = firebaseui.auth.AuthUI.getInstance();
      ui.start("#firebaseui-auth-container", this.uiConfig);
    } else {
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", this.uiConfig);
    }
  }
  render() {
    return (
      <Box
        style={{
          paddingTop: "2em",
        }}
      >
        <Head>
          <title>Login</title>
          <meta property="og-title" content="Login" />
        </Head>
        <Typography align="center" variant="h4">
          Sign into your account
        </Typography>
        <Box id="firebaseui-auth-container" />
        <Box id="loader">Loading...</Box>
        <Typography align="center">
          Does not have an account?
          <Box style={{ marginLeft: "0.5em" }}>
            <Link href="/register">
              <MaterialLink underline="hover" href="/register">
                Register now!
              </MaterialLink>
            </Link>
          </Box>
        </Typography>
      </Box>
    );
  }
}
Box;
