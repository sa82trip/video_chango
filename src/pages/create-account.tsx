import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface ICreateAccountFormInput {
  email: string;
  password: string;
}

export const CreateAccount = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {}, []);

  const makeUser = (email: string, password: string) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
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
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ICreateAccountFormInput>({ mode: "onChange" });
  console.log(watch());
  const createAccountSubmitHandler = ({
    email,
    password,
  }: ICreateAccountFormInput) => {
    makeUser(email, password);
    console.log(email, password);
  };
  return (
    <div className="mt-52 mx-auto max-w-sm flex flex-col">
      <h1 className="font-semibold text-2xl text-white bg-gray-800 text-center">
        Welcome To VC
      </h1>
      <span className="text-white font-semibold bg-gray-700 text-center">
        Create Account
      </span>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(createAccountSubmitHandler)}
      >
        <input
          placeholder="email"
          className="formInput"
          type="email"
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
          type="password"
          placeholder="password"
          className="formInput"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && "please check password"}
        <button className={`btn bg-red-100 px-5 my-1 text-black`} type="submit">
          Create Account
        </button>
        <Link
          to="/"
          className={`btn bg-gray-500 text-white font-bold px-5 my-1 text-center`}
        >
          Login
        </Link>
      </form>
    </div>
  );
};
