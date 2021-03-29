import axios from "axios";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillGoogleCircle } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import classNames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuthDispatch } from "../context/auth.context";
import { AUTH_SUCCESS } from "../context/types";

import Input from "./Input";
import { loginSchema } from "../../lib/schemaValidation";

// interface loginData {
//   email?: string;
//   username?: string;
//   password: string;
// }

const Login: FunctionComponent<{
  large: Boolean;
}> = ({ large }) => {
  const { register, errors, handleSubmit } = useForm({
    mode: "onTouched", // when to execute the validation first time
    resolver: yupResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const dispatch = useAuthDispatch();

  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      const res = await axios({
        method: "POST",
        url: "/api/auth/login",
        data: data,
      });
      // 2. set the global state
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data.user,
      });
      // 3. redirect to home page
      router.push("/");
    } catch (error) {
      console.log(error.response.data);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={classNames("flex flex-col space-y-4", {
        "w-10/12 md:w-6/12": large,
      })}
    >
      <h1 className="text-2xl font-bold text-white">Sign in to Twitter</h1>
      <div className="flex items-center justify-center p-2 space-x-2 text-white bg-blue-700 rounded-md">
        <AiFillGoogleCircle />
        <span>Sign up with Google</span>
      </div>
      <form
        className="flex flex-col space-y-3"
        onSubmit={handleSubmit(handleClick)}
      >
        <Input
          label="Username"
          type="text"
          name="username"
          error={errors.username}
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
            "Sign In"
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
};
export default Login;
