import { FUser } from "lib/types";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loader from "./Loader";

const People = () => {
  const { push } = useRouter();

  const { data: users, error } = useSWR<FUser[]>("/api/users");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="p-1 text-xl font-bold text-white">People you may like</h3>
      {error && <h4 className="text-lg ">Could not load</h4>}
      {users ? (
        users.map((user) => (
          <div
            className="flex items-center p-1 pt-2 space-x-3 cursor-pointer"
            onClick={() => push(`/user/${user._id}`)}
          >
            <img
              src={user.profilePicture}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col space-y-1">
              <span className="text-lg text-white">{user.username}</span>
              <span className="">Followers : {user.noOfFollowers}</span>
            </div>
          </div>
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default People;
