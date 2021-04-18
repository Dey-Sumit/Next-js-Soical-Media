import { useRouter } from "next/router";
import useSWR from "swr";
import { Tag } from "lib/types";

const Trends = () => {
  const { push } = useRouter();

  const { data: tags } = useSWR<Tag[]>("/api/tags");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="text-xl font-semibold text-white">Trends For You</h3>
      {tags?.map((tag, i) => (
        <div
          key={i}
          className="flex flex-col pt-2 cursor-pointer"
          onClick={() => push(`/tags/${tag.name}`)}
        >
          <span className="text-white">#{tag.name}</span>
          <span>{tag.length} Tweets</span>
        </div>
      ))}
    </div>
  );
};

export default Trends;
