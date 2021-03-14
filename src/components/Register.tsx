import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillGoogleCircle } from "react-icons/ai";
import { BiLoaderAlt, BiUserCircle } from "react-icons/bi";
import { MdEmail, MdLock } from "react-icons/md";
import { useAuthDispatch } from "../context/auth.context";
import { AUTH_SUCCESS } from "../context/types";
// import axiosInstance from "../util/axiosInstance";

import Input from "./Input";

//TODO use yup for the validation, reuse server side code
export default function Register() {
  const { register, errors, handleSubmit } = useForm({
    mode: "onBlur",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAuthDispatch();

  //TODO solve type any!
  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: "/api/auth/signup",
        data: data,
      });
      // console.log(res);
      dispatch({ type: AUTH_SUCCESS, payload: res.data.user });
      router.push("/");
    } catch (error) {
      console.log(error.response.data);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold text-white">Sign up to Twitter</h1>
      <div className="bg-blue-700 flex justify-center items-center p-2 text-white rounded-md space-x-2">
        <AiFillGoogleCircle />
        <span>Sign up with Google</span>
      </div>
      <form
        className="flex flex-col space-y-3"
        onSubmit={handleSubmit(handleClick)}
      >
        {/* // wrapper of the form 👆*/}
        <div className="flex space-x-4">
          <Input
            label="Name"
            type="text"
            register={register({
              required: { value: true, message: "Name is Required" },
            })}
            name="name"
            error={errors.name}
          />
          <Input
            label="Username"
            type="text"
            register={register({
              required: { value: true, message: "Username is Required" },
            })}
            name="username"
            error={errors.username}
          />
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          error={errors.email}
          register={register({
            required: { value: true, message: "Email is Required" },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Email is not valid",
            },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="6+ Characters"
          name="password"
          error={errors.password}
          register={register({
            required: { value: true, message: "Password is Required" },
            minLength: {
              value: 6,
              message: "Password Length must be at least 6",
            },
          })}
        />

        <button className="bg-blue-700  justify-center flex items-center p-2 text-white rounded-md text-lg font-bold">
          {!loading ? (
            "Sign Up"
          ) : (
            <>
              <BiLoaderAlt className="mr-2 animate-spin" /> Processing
            </>
          )}
        </button>
      </form>
      {errorMessage && (
        <div className="border p-1 text-center border-red-600 text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
