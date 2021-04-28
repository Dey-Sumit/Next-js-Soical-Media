import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Login, Register } from "components/index";
// import { useAuthState } from "context/auth.context";

export default function Auth() {
  // const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const { push } = useRouter();
  // const { user } = useAuthState();

  // useEffect(() => {
  //   if (user) {

  //     router.back(); // redirect to the prev page(route)
  //   }
  // }, [user]);

  return (
    <div className="grid h-screen grid-cols-8 text-white">
      {/* left part */}
      <div className="hidden col-span-3 p-4 bg-blue-700 md:grid place-items-center">
        <h1 className="mb-5 text-3xl font-semibold">
          Tweety helps you connect and share with the people in your life.{" "}
        </h1>
        <img src="/image_3d.png" alt="" className="" />
      </div>

      {/* right part */}
      <div className="grid col-span-8 p-4 bg-dark-700 md:col-span-5 place-items-center">
        {isLogin ? <Login large /> : <Register />}
        <div>
          <p className="text-lg tracking-wide text-center text-white">
            {!isLogin ? "Already a member?" : " Don't have an account yet?"}
            <span
              className="text-blue-700 cursor-pointer"
              onClick={() => setIsLogin((value) => !value)}
            >
              {!isLogin ? " Sign In" : " Sign Up"}
            </span>
          </p>

          <p
            className="p-1 text-sm tracking-wide text-center text-white border-2 border-blue-500 cursor-pointer"
            onClick={() => push("/")}
          >
            Skip Auth for now
          </p>
        </div>
      </div>
    </div>
  );
}
