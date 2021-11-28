import React, { useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import firebase from "./firebase";
const App = (e) => {
  const [state, setState] = useState({ mobile: "", otp: "" });
  // const [mobile, setMobile] = useState("");
  // const [otp, setOtp] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    setState((hi) => {
      return {
        ...hi,
        [name]: value,
      };
    });
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
          console.log("Recaptca verified");
        },
        defaultCountry: "IN",
      }
    );
  };
  const onSignInSubmit = (e) => {
    e.preventDefault();
    configureCaptcha();
    const phoneNumber = "+91" + state.mobile;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.log("SMS not sent");
      });
  };
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const code = state.otp;
    console.log(code);
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(JSON.stringify(user));
        alert("User is verified or move to main screen");
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      });
  };

  return (
    <div className="container mt-4">
      <div className="border border-dark p-3 mb-4" style={{ width: "400px" }}>
        <div
          className=" align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <h2>Login Form</h2>
          <form onSubmit={onSignInSubmit}>
            <div id="sign-in-button"></div>
            <input
              type="number"
              name="mobile"
              placeholder="Mobile number"
              required
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-danger btn-md btn-block ">
              Get OTP
            </button>
          </form>

          <h2>Enter OTP</h2>
          <form onSubmit={onSubmitOTP}>
            <input
              type="number"
              name="otp"
              placeholder="OTP Number"
              required
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-dark btn-md btn-block">
              Verify & Proceed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
