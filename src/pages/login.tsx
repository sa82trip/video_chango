import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { CreateAccount } from "./create-account";
import firebase from "firebase";
import { UserContext } from "../components/App";

export interface ILoginFormInput {
  email: string;
  password: string;
  loginHandler: () => void;
}

const loggedOutRoutes = {
  path: "/create-accout",
  component: <CreateAccount />,
};

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILoginFormInput>({ mode: "onChange" });

  const appCtx = useContext(UserContext);

  const history = useHistory();
  console.log(watch());

  useEffect(() => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log(user);
            appCtx?.setLoggedIn((prev) => !prev);
          }
        });
      });
  });

  const loginHandler = (data: ILoginFormInput) => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            appCtx?.setLoggedIn(true);
          } else {
            firebase
              .auth()
              .signInWithEmailAndPassword(data.email, data.password)
              .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log(user);
                //localStorage.setItem("key", user!.uid);
                // ...
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
              });
          }
        });
      });
  };
  return (
    <div className="mt-52 mx-auto max-w-sm flex flex-col">
      <h1 className="font-semibold text-2xl text-white bg-gray-800 text-center rounded-sm">
        Welcome To VC
      </h1>
      <span className="text-white font-semibold bg-gray-700 text-center">
        Login
      </span>
      <form className="flex flex-col" onSubmit={handleSubmit(loginHandler)}>
        <input
          placeholder="email"
          className="formInput"
          {...register("email", {
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
        {errors.email && (
          <h3 className="text-red-400 font-semibold">Email is required</h3>
        )}

        {errors.email?.type === "pattern" && (
          <h3 className="text-red-400 font-semibold">put valid email</h3>
        )}
        <input
          placeholder="password"
          className="formInput"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && "please check password"}
        <button className={`bg-red-100 btn my-1 text-black`} type="submit">
          Login
        </button>
        <Link
          className={`btn bg-gray-500 my-1 text-white font-bold text-center`}
          to="/create-account"
        >
          CreateAccount
        </Link>
      </form>
    </div>
  );
};