import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Trends from "components/Trends";
import TweetCard from "components/TweetCard";
import { Post } from "../lib/types.model";
interface IData {
  posts: Post[];
  name: string;
}
const index: NextPage<{ data: IData }> = ({ data }) => {
  console.log(data);

  if (!data.posts) {
    return <h1>{`There are no posts under ${data.name}`}</h1>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      {/* <div className="col-span-2">Sidebar</div> */}
      <Head>
        <title>{data.name || "Tweeter Clone"}</title>
      </Head>
      <div className="col-span-8 md:col-span-5">
        <div className="flex p-2 justify-between">
          <span>#{data.name}</span> <span> {data.posts.length} Tweets</span>{" "}
        </div>
        {data?.posts?.map((tweet) => (
          <TweetCard tweet={tweet} key={tweet._id} />
        ))}
      </div>
      <div className="col-span-8 md:col-span-3">
        <Trends />
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { tag } = ctx.query;

  // TODO check if relative URL works or not in axios server side
  let posts;
  try {
    const { data } = await axios.get(
      `${process.env.VERCEL_URL}/api/tags/${tag}`
    );

    posts = data.posts;
    if (!posts) {
      posts = {
        name: tag,
      };
    }
    posts = JSON.parse(JSON.stringify(posts));
  } catch (error) {
    posts = {
      name: tag,
    };
  }

  return {
    props: {
      data: posts,
    },
  };
};

export default index;
