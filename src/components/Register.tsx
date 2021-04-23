import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillGoogleCircle } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";

import { registrationSchema } from "../../lib/schemaValidation";
import { useAuthDispatch } from "../context/auth.context";
import { AUTH_SUCCESS } from "../context/types";
// import axiosInstance from "../util/axiosInstance";

import Input from "./Input";

//TODO use yup for the validation, re use server side code
export default function Register() {
  const { register, errors, handleSubmit } = useForm({
    mode: "onTouched",
    resolver: yupResolver(registrationSchema),
  });

  const {push} = useRouter()

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAuthDispatch();

  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      const res = await axios({
        method: "POST",
        url: "/api/auth/signup",
        data: data,
      });
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
    
      <form
        className="flex flex-col space-y-3"
        onSubmit={handleSubmit(handleClick)}
      >
        {/* // wrapper of the form 👆*/}
        <div className="flex space-x-4">
          <Input
            label="Name"
            type="text"
            register={register}
            name="name"
            error={errors.name}
          />
          <Input
            label="Username"
            type="text"
            register={register}
            name="username"
            error={errors.username}
          />
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          error={errors.email}
          register={register}
        />
        <Input
          label="Password"
          type="password"
          placeholder="6+ Characters"
          name="password"
          error={errors.password}
          register={register}
        />

        <button className="flex items-center justify-center p-2 text-lg font-bold text-white bg-blue-700 rounded-md focus:outline-none">
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
        <div className="p-1 text-center text-red-600 border border-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
