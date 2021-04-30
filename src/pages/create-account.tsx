import React, { useEffect } from "react";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

interface ICreateAccountProps {
  loginFlg: boolean;
}

export const CreateAccount = () => {
  const history = useHistory();
  useEffect(() => {}, []);

  const makeUser = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword("giljoonsung87@gmail.com", "123456789")
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  };
  return (
    <div>
      <h1>CreateAccount</h1>
    </div>
  );
};
