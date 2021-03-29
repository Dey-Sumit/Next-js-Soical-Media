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
      router.back(); // redirect to the prev page(route)
    }
  }, [user]);

  return (
    <div className="grid h-screen grid-cols-8 text-white">
      {/* left part */}
      <div className="hidden col-span-3 p-4 bg-blue-700 md:grid place-items-center">
        <h1 className="mb-5 text-xl font-semibold">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit, ipsa!
        </h1>
        <img src="/image_3d.png" alt="" className="" />
      </div>

      {/* right part */}
      <div className="grid col-span-8 p-4 bg-dark-700 md:col-span-5 place-items-center">
        {isLogin ? <Login large /> : <Register />}
        <p className="text-lg tracking-wide text-center text-white">
          {!isLogin ? "Already a member?" : " Don't have an account yet?"}
          <span
            className="text-blue-700 cursor-pointer"
            onClick={() => setIsLogin((value) => !value)}
          >
            {!isLogin ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
