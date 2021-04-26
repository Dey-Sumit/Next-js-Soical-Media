import { useRouter } from "next/router";
import useSWR from "swr";
import { Tag } from "lib/types";
import { FunctionComponent } from "react";
import Loader from "./Loader";

const Trends: FunctionComponent<{ noOfElements?: number }> = ({
  noOfElements = 10,
}) => {
  const { push } = useRouter();

  const { data: tags } = useSWR<Tag[]>("/api/tags");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="px-3 py-1 text-xl font-bold text-white">Trends For You</h3>
      {tags ? (
        tags.slice(0, noOfElements).map((tag, i) => (
          <div
            key={i}
            className="flex flex-col px-3 pt-2 cursor-pointer"
            onClick={() => push(`/tags/${tag.name}`)}
          >
            <span className="text-white">#{tag.name}</span>
            <span>{tag.length} Tweets</span>
          </div>
        ))
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Trends;
