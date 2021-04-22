import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useAuthState } from "../context/auth.context";
import { FUser } from "lib/types";
import { SiTwitter } from "react-icons/si";
import { useLayoutDispatch, useLayoutState } from "src/context/layout.context";
import { TOGGLE_NAVBAR } from "src/context/types";

const Navbar = () => {
  const { push } = useRouter();
  const { user } = useAuthState();
  const dispatch = useLayoutDispatch();
  // const [showResultsDiv, setShowResultsDiv] = useState(false);
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState(null);
  const [searchResults, setSearchResults] = useState<FUser[]>([]);
  const fetchResults = async (e: any) => {
    setQuery(e.target.value);
    if (e.target.value == "") {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await axios.get("/api/users/search", {
        params: {
          q: e.target.value,
        },
      });
      setSearchResults(data?.users);
    } catch (error) {
      console.log(error.message);
    }
  };
  //TODO add de duplication
  const goToUser = (uid: string) => {
    setQuery("");
    push(`/user/${uid}`);
  };
  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    searchSubs();
  }, [query]);

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await axios.get("/api/users/search", {
            params: {
              q: query,
            },
          });
          setSearchResults(data.users);
          // console.log(data);
        } catch (err) {
          console.log(err);
        }
      }, 250)
    );
  };

  return (
    <div className="sticky top-0 left-0 z-10 flex items-center justify-between p-3 space-x-4 bg-dark-600 text-dark-100 md:px-10 lg:px-16">
      <SiTwitter
        className="text-blue-600 cursor-pointer sm:hidden"
        size="24"
        onClick={() => dispatch({ type: TOGGLE_NAVBAR })}
      />

      <div className="relative flex items-center justify-center flex-1 px-3 py-1 space-x-3 bg-dark-700">
        <BiSearchAlt />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-dark-100 focus:outline-none"
          onClick={(e: any) => setQuery(e.target.value)}
          onChange={fetchResults}
          value={query}
        />
        {/* {showResultsDiv && ( */}
        <div
          className="absolute left-0 flex flex-col w-full space-y-1 rounded-sm top-8 bg-dark-600 "
          style={{ marginLeft: 0 }}
        >
          {searchResults?.map((user: FUser) => (
            <div
              className="flex items-center px-4 py-1 space-x-6 cursor-pointer bg-dark-700"
              onClick={() => goToUser(user._id)}
            >
              <img
                src={user?.profilePicture}
                alt=""
                className="rounded-full w-7 h-7 "
              />
              <div>
                <p>{user.name}</p>
                <p className="text-blue-700">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!user ? (
        // <div className="flex space-x-3">
        <button
          onClick={() => push("/auth")}
          className="p-1 text-blue-600 border border-blue-600"
        >
          Log in
        </button>
      ) : (
        // </div>
        <div
          className="flex items-center p-2 space-x-3 rounded-md cursor-pointer hover:bg-dark-700"
          onClick={() => push(`/user/${user._id}`)}
        >
          {<span className="hidden sm:block">Hey {user.username}!</span>}
          <img
            src={
              user?.profilePicture ||
              "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
            }
            alt=""
            className="w-8 h-8 rounded-full "
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
