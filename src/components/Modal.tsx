import { useAuthState } from "context/auth.context";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLayoutDispatch, useLayoutState } from "../context/layout.context";
import { HIDE_MODAL } from "../context/types";
import Login from "./Login";
import Register from "./Register";

const Modal = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { showModal } = useLayoutState();
  const dispatch = useLayoutDispatch();
  const { user } = useAuthState();
  // hide the modal automatically if the user logged in
  useEffect(() => {
    if (user)
      dispatch({
        type: HIDE_MODAL,
      });
  }, [user]);

  const variants = {
    initial: {
      scale: 0,
    },
    animate: {
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      scale: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {showModal ? (
        <div
          className="fixed z-10 grid w-full h-screen place-items-center bg-opacity-70 bg-dark-700"
          onClick={() =>
            dispatch({
              type: HIDE_MODAL,
            })
          }
        >
          // TODO remove framer motion, replace with css animation
          <motion.div
            className="px-6 py-4 rounded-lg shadow-2xl bg-dark-700"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
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
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
