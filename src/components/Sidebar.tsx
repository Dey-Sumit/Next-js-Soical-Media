import { IoMdHome, IoMdLogOut, IoMdShareAlt } from "react-icons/io";
import { MdExplore, MdMoreHoriz, MdNotifications } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "../context/auth.context";
import { useRouter } from "next/router";
import axios from "axios";
import { LOG_OUT } from "../context/types";
import { AiOutlineUser } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
const Sidebar = () => {
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();

  const router = useRouter();

  const logout = async () => {
    //TODO use swr
    await axios.post("/api/auth/logout");
    router.push("/auth");
    dispatch({ type: LOG_OUT }); // ?NOT NEEDED I guess
  };
  return (
    <div className=" flex flex-col py-8 px-6 justify-between pb-20 text-lg shadow-lg h-screen sticky top-0 left-0 bottom-0">
      <div className="flex space-x-2 items-center font-medium justify-center">
        <Link href="/">
          <a>
            <SiTwitter className="text-blue-600 cursor-pointer " size="28" />
            {/* <span>Twitter</span> */}
          </a>
        </Link>
      </div>
      <div className="flex flex-col space-y-5 ">
        <div className="flex space-x-2 items-center cursor-pointer hover:bg-blue-light p-1 rounded-lg ">
          <IoMdHome size="24" />
          <span className="hidden lg:block">Home</span>
        </div>
        <div className="flex space-x-2 items-center cursor-pointer hover:bg-blue-light p-1 rounded-lg ">
          <BsBookmark size="24" />
          <span className="hidden lg:block">Saved</span>
        </div>
        {user && (
          <div
            className="flex space-x-2 items-center cursor-pointer hover:bg-blue-light p-1 rounded-lg "
            onClick={() => router.push(`/user/${user._id}`)}
          >
            <AiOutlineUser size="24" />
            <span className="hidden lg:block">Profile</span>
          </div>
        )}
        <div className="flex space-x-2 items-center cursor-pointer hover:bg-blue-light p-1 rounded-lg ">
          <MdExplore size="24" />
          <span className="hidden lg:block">Explore</span>
        </div>
        <div className="flex space-x-2 items-center cursor-pointer hover:bg-blue-light p-1 rounded-lg">
          <MdNotifications size="24" />
          <span className="hidden lg:block">Notifications</span>
        </div>
        {user && (
          <div
            className="flex space-x-2 items-center text-red-600 cursor-pointer hover:bg-blue-light p-1 rounded-lg"
            onClick={logout}
          >
            <IoMdLogOut size="24" />
            <span className="hidden lg:block">Log out</span>
          </div>
        )}
        <div className="flex space-x-2 items-center cursor-pointer hover:bg-blue-400">
          <MdMoreHoriz size="24" />
          <span className="hidden lg:block">More</span>
        </div>
      </div>
      <button
        className=" text-white tracking-wider text-lg px-3 py-1 rounded-sm"
        onClick={() => router.push("/")}
      >
        {user ? (
          "Tweet"
        ) : (
          <SiTwitter className="text-white cursor-pointer " size="28" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
