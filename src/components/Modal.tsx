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
      className="absolute z-10 grid w-full h-screen bg-opacity-70 bg-dark-700 place-items-center"
      onClick={() =>
        dispatch({
          type: HIDE_MODAL,
        })
      }
    >
      <div
        className="p-4 rounded-lg shadow-2xl bg-dark-700"
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
    </div>
  ) : null;
};

export default Modal;
