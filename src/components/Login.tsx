import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillGoogleCircle } from "react-icons/ai";
import { BiLoaderAlt, BiUserCircle } from "react-icons/bi";
import { MdEmail, MdLock } from "react-icons/md";
// import axiosInstance from "../util/axiosInstance";

import Input from "./Input";

//TODO use yup for the validation, reuse server side code
export default function Register() {
  const { register, errors, handleSubmit } = useForm({
    mode: "onBlur",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  //TODO solve type any!
  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      await axios({
        method: "post",
        url: "/api/auth/login",
        data: data,
      });
      router.push("/");
    } catch (error) {
      console.log(error.response.data);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-10/12 md:w-6/12">
      <h1 className="text-2xl font-bold text-white">Sign up to Twitter</h1>
      <div className="bg-blue-700 flex justify-center items-center p-2 text-white rounded-md space-x-2">
        <AiFillGoogleCircle />
        <span>Sign up with Google</span>
      </div>
      <form
        className="flex flex-col space-y-3"
        onSubmit={handleSubmit(handleClick)}
      >
        {/* //TODO handler email or username in react hook form error */}
        <Input
          label="Email or Username"
          type="text"
          name="email"
          error={errors.email}
          register={register({
            required: { value: true, message: "Email or Username is Required" },
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
        <button className="bg-blue-700 flex items-center justify-center  p-2 text-white rounded-md text-lg font-bold">
          {!loading ? (
            "Sign In"
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
