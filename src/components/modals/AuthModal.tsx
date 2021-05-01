import axios from "axios";
import Login from "components/Login";
import Overlay from "components/Overlay";
import Register from "components/Register";
import WithModal from "components/WithModal";
import { useAuthState } from "context/auth.context";
import { useLayoutDispatch, useLayoutState } from "context/layout.context";
import { HIDE_MODAL } from "context/types";
import { AnimatePresence, motion } from "framer-motion";
import { popUp } from "lib/animations";
import { useEffect, useState } from "react";
import { mutate } from "swr";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { showAuthModal, showDeleteModal } = useLayoutState();
  const dispatch = useLayoutDispatch();
  const { user } = useAuthState();
  // hide the modal automatically if the user logged in
  //   useEffect(() => {
  //     if (user)
  //       dispatch({
  //         type: HIDE_MODAL,
  //       });
  //   }, [user]);
  // TODO after HIDE MODAL after login and reg or create separate hide modal type
  return (
    <AnimatePresence>
      {showAuthModal ? (
        <Overlay>
          <motion.div
            className="px-6 py-4 rounded-lg shadow-2xl bg-dark-700"
            variants={popUp}
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
        </Overlay>
      ) : null}
    </AnimatePresence>
  );
};

export default AuthModal;
