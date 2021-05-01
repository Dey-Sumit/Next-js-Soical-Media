import axios from "axios";
import Overlay from "components/Overlay";
import { useLayoutDispatch, useLayoutState } from "context/layout.context";
import { HIDE_MODAL } from "context/types";
import { AnimatePresence, motion } from "framer-motion";
import { popUp } from "lib/animations";
import { usePaginatedPosts } from "lib/hooks";
import { FunctionComponent, MouseEventHandler } from "react";

const ConfirmationModal = () => {
  const {
    showConfirmationModal,

    modalData,
  } = useLayoutState();

  const dispatch = useLayoutDispatch();

  return (
    <motion.div
      className={`${
        showConfirmationModal ? "scale-100  " : "scale-0  "
      }  text-center p-4 rounded-lg shadow-2xl bg-dark-600 transition-all duration-300 transform fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
    >
      <div className="flex flex-col items-center p-2 space-y-6 rounded-2xl">
        <h1 className="text-2xl font-semibold">Are you sure?</h1>
        <p>{modalData?.subTitle}</p>
        <div className="flex flex-row text-lg space-x-7">
          <button
            className="p-2 px-4 rounded-full bg-dark-500"
            onClick={(e) => {
              dispatch({
                type: HIDE_MODAL,
              });
            }}
          >
            Cancel
          </button>
          <button
            className="p-2 px-4 bg-pink-700 rounded-full"
            onClick={modalData?.handleConfirmation}
          >
            {modalData?.buttonText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationModal;
