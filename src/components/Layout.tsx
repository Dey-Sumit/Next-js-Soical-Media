import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import NextNprogress from "nextjs-progressbar";
const Layout = ({ children }) => {
  return (
    <div className="flex text-dark-100">
      <NextNprogress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        options={{ showSpinner: false }}
      />
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
// sm->640
export default Layout;
