import { AnimatePresence, motion } from "framer-motion";
import { useLayoutDispatch } from "../context/layout.context";
import { HIDE_MODAL } from "../context/types";
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

const WithModal = (OriginalComponent) => {
  const NewCompoenent = () => {
    const dispatch = useLayoutDispatch();
    return (
      <AnimatePresence>
        {/* // TODO remove framer motion, replace with css animation */}
        <motion.div
          className="px-6 py-4 rounded-lg shadow-2xl bg-dark-700"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <OriginalComponent />
        </motion.div>
      </AnimatePresence>
    );
  };
  return NewCompoenent;
};

export default WithModal;
