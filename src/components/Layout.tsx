import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Trends from "./Trends";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen  text-dark-100">
      {/* // wrapper 👆 */}

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
