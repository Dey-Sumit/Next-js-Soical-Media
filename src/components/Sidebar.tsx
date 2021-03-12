import { IoMdHome, IoMdShareAlt } from "react-icons/io";
import { MdNotifications } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
const Sidebar = () => {
  return (
    <div className=" flex flex-col py-8 px-6 justify-between pb-20 text-lg shadow-lg ">
      <div className="flex space-x-2 items-center font-medium justify-center">
        <SiTwitter className="text-blue-600" size="28" />
        {/* <span>Twitter</span> */}
      </div>
      <div className="flex flex-col space-y-4 ">
        <div className="flex space-x-2 items-center ">
          <IoMdHome size="24" />
          <span className="hidden lg:block">Home</span>
        </div>
        <div className="flex space-x-2 items-center ">
          <IoMdHome size="24" />
          <span className="hidden lg:block">Messages</span>
        </div>
        <div className="flex space-x-2 items-center ">
          <IoMdHome size="24" />
          <span className="hidden lg:block">Messages</span>
        </div>

        <div className="flex space-x-2 items-center ">
          <IoMdHome size="24" />
          <span className="hidden lg:block">Explore</span>
        </div>
        <div className="flex space-x-2 items-center ">
          <MdNotifications size="24" />
          <span className="hidden lg:block">Notifications</span>
        </div>
        <div className="flex space-x-2 items-center ">
          <MdNotifications size="24" />
          <span className="hidden lg:block">More</span>
        </div>
      </div>
      <button className="bg-blue-600 text-white tracking-wider text-lg px-2">
        Tweet
      </button>
    </div>
  );
};

export default Sidebar;
