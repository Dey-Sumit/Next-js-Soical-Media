import { FUser } from "lib/types";
import { useRouter } from "next/router";
import useSWR from "swr";

const People = () => {
  const { push } = useRouter();

  //   const { data }: { data?: { users: FUser[] } } = useSWR("/api/tags");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="text-xl font-semibold">People you may like</h3>
      {/* {data?.users.map((tag) => (
        <div
          className="flex flex-col pt-2 cursor-pointer"
          onClick={() => push(`/tags/${tag.name.substring(1)}`)}
        >
          <span className="text-white">#{tag.name}</span>
          <span>{data.users.length} Tweets</span>
        </div>
      ))} */}
    </div>
  );
};

export default People;
