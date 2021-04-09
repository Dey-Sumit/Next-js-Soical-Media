import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import CommentCard from "../../../components/CommentCard";
import Trends from "../../../components/Trends";
import TweetCard from "../../../components/TweetCard";
import CreateComment from "../../../components/CreateComment";
import { Post } from "../../lib/types.model";

const index = () => {
  const router = useRouter();
  const { tid } = router.query;
  const { data, error }: { data?: Post; error?: any } = useSWR(
    `/api/posts/${tid}`
  );

  if (!data) {
    return <h3>Loading...</h3>;
  }
  if (error) {
    return <h3>Opps Error!!!S</h3>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <Head>
        <title>
          {data.content} | {data.user.username}
        </title>
      </Head>
      <div className="col-span-8 sm:col-span-5">
        <TweetCard tweet={data} />
        {/* Comment */}

        <CreateComment tid={tid.toString()} />

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
