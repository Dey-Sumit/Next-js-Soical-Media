import { FUser } from "lib/types";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import Loader from "./Loader";
import UserCard from "./UserCard";

const People: FunctionComponent<{ noOfElements?: number }> = ({
  noOfElements,
}) => {
  const { data: users, error } = useSWR<FUser[]>("/api/users");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="px-3 py-1 text-xl font-bold text-white">
        People you may like
      </h3>
      {error && <h4 className="text-lg ">Could not load</h4>}
      {users ? (
        users
          .slice(0, noOfElements)
          .map((user) => <UserCard user={user} showFollowButton={false} />)
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default People;
