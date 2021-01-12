import { Box, Link as MaterialLink, Typography } from "@material-ui/core";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import FirebaseAuth from "../libs/firebase_client";
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
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
      signInSuccessUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "https://graduate-project.vercel.app/",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        FirebaseAuth.EmailAuthProvider.PROVIDER_ID,
        FirebaseAuth.GoogleAuthProvider.PROVIDER_ID,
        FirebaseAuth.FacebookAuthProvider.PROVIDER_ID,
        FirebaseAuth.GithubAuthProvider.PROVIDER_ID,
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
      const ui = new firebaseui.auth.AuthUI(FirebaseAuth());
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
