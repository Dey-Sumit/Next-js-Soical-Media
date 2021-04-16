import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  CreateComment,
  TweetCard,
  Trends,
  CommentCard,
} from "components/index";
import { FPost } from "lib/types";
import Loader from "components/Loader";

const index = () => {
  const router = useRouter();
  const { tid } = router.query;
  const { data, error } = useSWR<FPost>(tid ? `/api/posts/${tid}` : null);

  if (error) {
    return <h3>Opps Error!!!</h3>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <Head>
        <title>{data?.content}</title>
      </Head>
      <div className="col-span-8 sm:col-span-5">
        {/* Comment */}
        {!data ? (
          <Loader />
        ) : (
          <>
            <TweetCard tweet={data} />
            <CreateComment tid={tid?.toString()} />
            <div className="pl-14">
              {data.comments?.map((comment) => (
                <CommentCard key={comment._id} data={comment} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="col-span-8 sm:col-span-3">
        <Trends />
      </div>
    </div>
  );
};

export default index;
