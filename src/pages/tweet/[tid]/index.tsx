import { useRouter } from "next/router";
import useSWR from "swr";
import CommentCard from "../../../components/CommentCard";
import Trends from "../../../components/Trends";
import TweetCard from "../../../components/TweetCard";
import TweetInput from "../../../components/TweetInput";
import { Post } from "../../../types.frontend";

const index = () => {
  const router = useRouter();
  const { tid } = router.query;
  const { data, error }: { data?: Post; error?: any } = useSWR(
    `/api/posts/${tid}`
  );
  console.log(data);

  if (!data) {
    return <h3>Loading...</h3>;
  }
  if (error) {
    return <h3>Opps Error!!!S</h3>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <div className="sm:col-span-5 col-span-8">
        <TweetCard tweet={data} />
        {/* Comment */}

        <TweetInput
          placeholder="What's your opinion on this post? "
          buttonText="Add Comment"
          endpoint={`/api/posts/${tid}/comments`}
          mutationEndpoint={`/api/posts/${tid}`}
        />

        <div className="pl-14">
          {data?.comments.map((comment) => (
            <CommentCard key={comment._id} data={comment} />
          ))}
        </div>
      </div>

      <div className="col-span-8 sm:col-span-3">
        <Trends />
      </div>
    </div>
  );
};

export default index;
