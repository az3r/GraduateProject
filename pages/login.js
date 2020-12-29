import React from "react";
import Head from "next/head";
import firebase from "../libs/firebase";
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
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
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      tosUrl: "https://www.example.com",
      // Privacy policy url.
      privacyPolicyUrl: "https://www.example.com",
    };
  }
  componentDidMount() {
    const firebaseui = require("firebaseui");
    if (!this.ui) this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  }
  render() {
    return (
      <div>
        <Head>
          <link
            type="text/css"
            rel="stylesheet"
            href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css"
          />
        </Head>
        <h1>Welcome to My Awesome App</h1>
        <button
          onClick={() => {
            this.ui.start("#firebaseui-auth-container", this.uiConfig);
          }}
        >
          Sign in with prebuild firebaseui
        </button>
        <div id="firebaseui-auth-container" />
        <div id="loader">Loading...</div>
      </div>
    );
  }
}
