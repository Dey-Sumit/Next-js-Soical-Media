import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaShoppingBag } from "react-icons/fa";
import { useAuthState } from "../context/auth.context";
import { User } from "../types.frontend";

const Navbar = () => {
  const { push } = useRouter();
  const { user } = useAuthState();
  // const [showResultsDiv, setShowResultsDiv] = useState(false);
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
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
      console.log(data);
      setSearchResults(data?.users);
    } catch (error) {
      console.log(error.message);
    }
  };
  //TODO add deduplication
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
    <div className="flex items-center justify-between p-3 bg-dark-600 text-dark-100 md:px-10 lg:px-16 sticky top-0 left-0 space-x-4">
      {/* <div className="flex space-x-3">
        <span>About</span>
        <span>Help</span>
      </div> */}
      <div className="flex items-center space-x-3 bg-dark-700 px-3 py-1 justify-center flex-1 relative">
        <BiSearchAlt />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-dark-100 focus:outline-none w-full"
          onClick={(e: any) => setQuery(e.target.value)}
          onChange={fetchResults}
          value={query}
        />
        {/* {showResultsDiv && ( */}
        <div
          className="flex flex-col space-y-1 absolute w-full top-8 bg-dark-600  left-0 rounded-sm "
          style={{ marginLeft: 0 }}
        >
          {searchResults?.map((user: User) => (
            <div
              className="flex items-center space-x-6 bg-dark-700 px-4 py-1 cursor-pointer"
              onClick={() => goToUser(user._id)}
            >
              <img
                src={
                  user?.profilePicture ||
                  "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
                }
                alt=""
                className="w-7 h-7 rounded-full "
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
          className="border border-blue-600 p-1 text-blue-600"
        >
          Log in
        </button>
      ) : (
        // </div>
        <div
          className="flex space-x-3 items-center cursor-pointer hover:bg-dark-700 rounded-md p-2"
          onClick={() => push(`/user/${user._id}`)}
        >
          {<span>Hey {user.name}!</span>}
          <img
            src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
            alt=""
            className="w-8 h-8 rounded-full "
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
