import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { MdExplore, MdMoreHoriz, MdNotifications } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "../context/auth.context";
import { useRouter } from "next/router";
import axios from "axios";
import { LOG_OUT, TOGGLE_NAVBAR } from "../context/types";
import { AiOutlineUser } from "react-icons/ai";
import { useLayoutDispatch, useLayoutState } from "src/context/layout.context";
import { FunctionComponent, MouseEventHandler } from "react";
import { IconType } from "react-icons";
import { AnimatePresence, motion } from "framer-motion";

const SidebarItem: FunctionComponent<{
  Icon: IconType;
  text: string;
  handler?: MouseEventHandler<HTMLDivElement>;
}> = ({ Icon, text, handler }) => {
  return (
    <div className="navItem" onClick={handler}>
      <Icon size="24" />
      <span className="hidden lg:block">{text}</span>
    </div>
  );
};

const Sidebar = () => {
  const dispatch = useAuthDispatch();
  const layoutDispatch = useLayoutDispatch();
  const { user } = useAuthState();
  const { showNavbar } = useLayoutState();

  const router = useRouter();

  const logout = async () => {
    dispatch({ type: LOG_OUT }); // ?NOT NEEDED I guess
    router.push("/auth");
    await axios.post("/api/auth/logout");
  };
  const variants = {
    animate: {
      x: 0,
      transition: {
        duration: 2,
      },
    },
    exit: {
      x: -10,
      transition: {
        duration: 2,
      },
    },
  };
  return (
    <AnimatePresence>
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`bg-dark-700 fixed flex-col justify-between h-screen px-3 sm:px-6 py-8 pb-20 text-lg shadow-lg sm:flex z-10 sm:sticky sm:w-40  max-w-max ${
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
            </a>
          </Link>
        </div>
        <div
          className="flex flex-col space-y-5 "
          onClick={(e) => {
            e.stopPropagation();
            layoutDispatch({ type: TOGGLE_NAVBAR });
          }}
        >
          <SidebarItem
            Icon={IoMdHome}
            text="Home"
            handler={() => router.push("/")}
          />
          {/* <SidebarItem Icon={BsBookmark} text="Saved" /> */}

          {user && (
            <SidebarItem
              Icon={AiOutlineUser}
              text="Profile"
              handler={() => router.push(`/user/${user._id}`)}
            />
          )}
          <SidebarItem Icon={MdExplore} text="Explore" />
          {/* <SidebarItem Icon={MdNotifications} text="Notifications" /> */}

          {user && (
            <SidebarItem Icon={IoMdLogOut} text="LogOut" handler={logout} />
          )}
          <SidebarItem Icon={MdMoreHoriz} text="More" />
        </div>
        <div></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
