import { useState } from "react";
import Navbar from "./Navbar";
import Register from "./Register";
import Login from "./Login";
import Sidebar from "./Sidebar";
import Trends from "./Trends";
import { useLayoutDispatch, useLayoutState } from "../context/layout.context";
import { HIDE_MODAL } from "../context/types";
import Modal from "./Modal";

const Layout = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { showModal } = useLayoutState();
  const dispatch = useLayoutDispatch();
  return (
    <div className="flex  text-dark-100">
      {/* // wrapper 👆 */}

      <Modal />
      {/* modal absolute position 👆 */}
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="px-2 lg:px-20 py-4">
          {/* // wrapper 👆 */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
