import Login from "components/Login";
import Register from "components/Register";
import { useLayoutState } from "context/layout.context";
import { useState } from "react";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { showAuthModal } = useLayoutState();

  // TODO after HIDE MODAL after login and reg or create separate hide modal type
  return (
    <div
      className={`${
        showAuthModal ? "scale-100 " : "scale-0 "
      } px-6 py-4 rounded-lg shadow-2xl bg-dark-700 transition-all duration-300 transform fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
      onClick={(e) => e.stopPropagation()}
    >
      {isLogin ? <Login large={false} /> : <Register />}
      <p className="my-2 tracking-wide text-center text-white">
        {!isLogin ? "Already a member?" : " Don't have an account yet?"}
        <span
          className="cursor-pointer"
          onClick={() => setIsLogin((value) => !value)}
        >
          {!isLogin ? " Sign In" : " Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default AuthModal;
