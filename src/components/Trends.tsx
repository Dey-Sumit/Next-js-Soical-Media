import { useRouter } from "next/router";
import useSWR from "swr";
import { Tag } from "lib/types";

const Trends = () => {
  const { push } = useRouter();

  const { data }: { data?: { tags: Tag[] } } = useSWR("/api/tags");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="text-lg font-medium">Trends For You</h3>
      {data?.tags.map((tag) => (
        <div
          className="flex flex-col pt-2 cursor-pointer"
          onClick={() => push(`/tags/${tag.name.substring(1)}`)}
        >
          <span className="text-white">#{tag.name}</span>
          <span>{data.tags.length} Tweets</span>
        </div>
      ))}
    </div>
  );
};

export default Trends;
