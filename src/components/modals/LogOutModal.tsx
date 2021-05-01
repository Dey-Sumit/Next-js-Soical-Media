import axios from "axios";
import Overlay from "components/Overlay";
import { useAuthDispatch } from "context/auth.context";
import { useLayoutDispatch, useLayoutState } from "context/layout.context";
import { HIDE_MODAL, LOG_OUT } from "context/types";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { popUp } from "lib/animations";
import { useRouter } from "next/router";

const LogOutModal = () => {
  const { showLogoutModal } = useLayoutState();
  const authDispatch = useAuthDispatch();
  const router = useRouter();

  const dispatch = useLayoutDispatch();

  const handleLogout = async (e: any) => {
    e.stopPropagation();
    authDispatch({ type: LOG_OUT }); // ?NOT NEEDED I guess
    router.push("/auth");
    Cookies.remove("user");
    await axios.post("/api/auth/logout");
  };
  return (
    <AnimatePresence>
      {showLogoutModal ? (
        <Overlay>
          <motion.div
            className="px-6 py-4 rounded-lg shadow-2xl bg-dark-700"
            variants={popUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col items-center p-2 space-y-6 rounded-2xl">
              <h1 className="text-2xl font-semibold">Are you sure?</h1>
              <p className="w-7/12">
                Good Decision!!! Never ever use social media, focus on your real
                life
              </p>
              <div className="flex flex-row text-lg space-x-7">
                <button
                  className="p-2 px-4 rounded-full bg-dark-500"
                  onClick={() => {
                    dispatch({
                      type: HIDE_MODAL,
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-2 px-4 bg-pink-700 rounded-full"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        </Overlay>
      ) : null}
    </AnimatePresence>
  );
};

export default LogOutModal;
