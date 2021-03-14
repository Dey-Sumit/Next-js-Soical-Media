import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useAuthState } from "../context/auth.context";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      router.back();
    }
  }, [user]);

  //TODO font-serif globally | search better font
  return (
    <div className="grid grid-cols-8  text-white h-screen">
      <div className="bg-blue-700 col-span-3 p-4 md:grid place-items-center hidden">
        <div className="">
          <h1 className="text-xl font-semibold mb-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit,
            ipsa!
          </h1>
          <img src="/image_3d.png" alt="" className="" />
        </div>
      </div>
      <div className="bg-dark-700 col-span-8 md:col-span-5 p-4 grid place-items-center">
        {isLogin ? <Login /> : <Register />}
        <p className="text-center text-white tracking-wide">
          {!isLogin ? "Already a member?" : " Don't have an account yet?"}
          <span
            className="cursor-pointer text-green"
            onClick={() => setIsLogin((value) => !value)}
          >
            {!isLogin ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
