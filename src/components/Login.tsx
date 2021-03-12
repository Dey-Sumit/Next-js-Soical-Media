import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { MdEmail, MdLock } from "react-icons/md";
import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

import axios from "axios";
import Input from "./Input";

export default function Login() {
  // const { signIn } = useAuth()
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    mode: "onBlur",
  });

  //TODO solve type any!
  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      // await signIn(data)
      const res = await axios({
        method: "post",
        url: "http://localhost:3000/api/auth/login",
        data,
      });
      router.push("/");
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <form
        className="flex flex-col space-y-2"
        onSubmit={handleSubmit(handleClick)}
      >
        <Input
          register={register({
            required: { value: true, message: "Email is Required" },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Email is not valid",
            },
          })}
          Icon={MdEmail}
          type="email"
          name="email"
          placeholder="Email"
          error={errors.email}
        />
        <Input
          register={register({
            required: { value: true, message: "Password is Required" },
            minLength: {
              value: 6,
              message: "Password Length must be at least 6",
            },
          })}
          Icon={MdLock}
          name="password"
          placeholder="Password"
          type="password"
          error={errors.password}
        />

        {/* //TODO create a separate component for the button and the loader */}

        {!loading ? (
          <button
            type="submit"
            className="p-2 text-base font-medium text-white rounded-lg bg-yellow"
          >
            Login
          </button>
        ) : (
          <button
            type="submit"
            className="flex items-center justify-center p-2 text-base font-medium text-white rounded-lg bg-yellow"
          >
            <BiLoaderAlt className="mr-2 animate-spin" /> Processing
          </button>
        )}
      </form>

      {/* //! add in next version :) 😂😂😂 */}
      {/* <p className="my-4 text-center text-gray-400">or continue with</p>

      <button
        className="w-full p-2 text-base font-medium text-white bg-gray-600 rounded-lg"
        onClick={() => {}}
      >
        Google
      </button> */}
    </div>
  );
}
