import { useLayoutDispatch } from "context/layout.context";
import { HIDE_MODAL } from "context/types";
import AuthModal from "./modals/AuthModal";

const Overlay = () => {
  const dispatch = useLayoutDispatch();

  return (
    <div
      className="fixed z-10 grid w-full h-screen place-items-center bg-opacity-70 bg-dark-700"
      onClick={() => {
        dispatch({
          type: HIDE_MODAL,
        });
      }}
    ></div>
  );
};

export default Overlay;
