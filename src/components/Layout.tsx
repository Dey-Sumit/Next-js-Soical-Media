import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Modal from "./Modal";

const Layout = ({ children }) => {
  return (
    <div className="flex text-dark-100">
      {/* // wrapper 👆 */}

      <Modal />
      {/* modal absolute position 👆 */}
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="px-2 py-4 lg:px-20">
          {/* // wrapper 👆 */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
