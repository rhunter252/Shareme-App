import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { gapi } from "gapi-script";
import jwt_decode from "jwt-decode";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    const name = response.profileObj;
    const googleId = response.profileObj;
    const imageUrl = response.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  }
  useEffect(() => {
    const initClient = () => {
      gapi.auth2.init({
        clientId: import.meta.env.VITE_APP_GOOGLE_API_TOKEN,
        callback: handleCallbackResponse,
        scopes: "https://www.googleapis.com/auth/cloud-platform.read-only	",
      });
    };
    gapi.load("client:auth2", initClient);
    // google.accounts.id.renderButton(document.getElementById("signinDiv"), {
    //   theme: "outline",
    //   size: "large",
    // });
  }, []);
  // google.accounts.id.initialize({
  //   client_id: import.meta.env.VITE_APP_GOOGLE_API_TOKEN,
  //   callback: handleCallbackResponse,
  // });

  return (
    <div
      className="flex
  justify-start items-center flex-col h-screen"
    >
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="h-full w-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleOAuthProvider>
              <GoogleLogin
                client_id={import.meta.env.VITE_APP_GOOGLE_API_TOKEN}
                render={(renderProps) => (
                  <button
                    type="button"
                    className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className="mr-4" /> Sign in with google
                  </button>
                )}
                onSuccess={handleCallbackResponse}
                onFailure={handleCallbackResponse}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
