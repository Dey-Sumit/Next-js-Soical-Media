import { useState } from "react";
import { useLayoutDispatch, useLayoutState } from "../context/layout.context";
import { HIDE_MODAL } from "../context/types";
import Login from "./Login";
import Register from "./Register";

const Modal = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { showModal } = useLayoutState();
  const dispatch = useLayoutDispatch();
  {
    /* //  TODO use DRY , create separate component:(  */
  }
  return showModal ? (
    <div
      className="absolute z-10 bg-opacity-70 bg-dark-700 grid place-items-center w-full h-screen"
      onClick={() =>
        dispatch({
          type: HIDE_MODAL,
        })
      }
    >
      <div
        className="bg-dark-700 rounded-lg p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLogin ? <Login /> : <Register />}
        <p className="text-center text-white tracking-wide my-2">
          {!isLogin ? "Already a member?" : " Don't have an account yet?"}
          <span
            className="cursor-pointer"
            onClick={() => setIsLogin((value) => !value)}
          >
            {!isLogin ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  ) : null;
};

export default Modal;
