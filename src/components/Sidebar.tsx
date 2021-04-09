import { IoMdHome, IoMdLogOut, IoMdShareAlt } from "react-icons/io";
import { MdExplore, MdMoreHoriz, MdNotifications } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "../context/auth.context";
import { useRouter } from "next/router";
import axios from "axios";
import { LOG_OUT, TOGGLE_NAVBAR } from "../context/types";
import { AiOutlineUser } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { useLayoutDispatch, useLayoutState } from "src/context/layout.context";
const Sidebar = () => {
  const dispatch = useAuthDispatch();
  const layoutDispatch = useLayoutDispatch();
  const { user } = useAuthState();
  const { showNavbar } = useLayoutState();

  const router = useRouter();

  const logout = async () => {
    //TODO use swr
    await axios.post("/api/auth/logout");
    router.push("/auth");
    dispatch({ type: LOG_OUT }); // ?NOT NEEDED I guess
  };
  return (
    <div
      className={`bg-dark-700 absolute top-0 bottom-0 left-0 flex-col justify-between h-screen px-3 sm:px-6 py-8 pb-20 text-lg shadow-lg sm:flex z-10 sm:sticky  ${
        showNavbar ? " flex" : " hidden"
      }`}
    >
      <div className="flex items-center justify-center space-x-2 font-medium ">
        <Link href="/">
          <a>
            <SiTwitter
              className="text-blue-600 cursor-pointer "
              size="28"
              onClick={() => layoutDispatch({ type: TOGGLE_NAVBAR })}
            />
            {/* <span>Twitter</span> */}
          </a>
        </Link>
      </div>
      <div className="flex flex-col space-y-5 ">
        <div className="navItem">
          <IoMdHome size="24" />
          <span className="hidden lg:block">Home</span>
        </div>
        <div className="navItem">
          <BsBookmark size="24" />
          <span className="hidden lg:block">Saved</span>
        </div>
        {user && (
          <div
            className="navItem "
            onClick={() => router.push(`/user/${user._id}`)}
          >
            <AiOutlineUser size="24" />
            <span className="hidden lg:block">Profile</span>
          </div>
        )}
        <div className="navItem">
          <MdExplore size="24" />
          <span className="hidden lg:block">Explore</span>
        </div>
        <div className="navItem">
          <MdNotifications size="24" />
          <span className="hidden lg:block">Notifications</span>
        </div>
        {user && (
          <div className="navItem" onClick={logout}>
            <IoMdLogOut size="24" />
            <span className="hidden lg:block">Log out</span>
          </div>
        )}
        <div className="flex items-center justify-center space-x-2 cursor-pointer sm:justify-start hover:bg-blue-400">
          <MdMoreHoriz size="24" />
          <span className="hidden lg:block">More</span>
        </div>
      </div>
      <button
        className="px-3 py-1 text-lg tracking-wider text-white rounded-sm "
        onClick={() => router.push("/")}
      >
        {user ? (
          "Tw"
        ) : (
          <SiTwitter className="text-white cursor-pointer " size="28" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
