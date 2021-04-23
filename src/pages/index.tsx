import TweetCard from "../components/TweetCard";
import Trends from "../components/Trends";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import React from "react";
import CreateTweet from "components/CreateTweet";
import People from "components/People";
import Loader from "components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePaginatedPosts } from "lib/hooks";
// TODO error

export default function Home({ user }) {
  console.log({user});
  
  const { push } = useRouter();

  // const { data, error } = useSWR<FPaginatedPosts>("/api/posts");
  const { error, posts, page, setPage, isReachingEnd } = usePaginatedPosts(
    !user ? "/api/posts" : "/api/posts/feed"
  );
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      {/* <div className="col-span-2">Sidebar</div> */}
      <Head>
        <title>Twitty</title>
      </Head>
      <div className="col-span-8 md:col-span-5">
        {user ? (
          <CreateTweet />
        ) : (
          <div className="p-3 text-center">
            {" "}
            <p>Sign in to talk to the world 😉</p>
            <button
              onClick={() => push("/auth")}
              className="p-1 my-3 bg-blue-600 border border-blue-600"
            >
              Sign up / Sign in
            </button>
          </div>
        )}
        {/* {!error && !data && <Loader />} */}
        {error && <span>Opps! Try again</span>}
        <InfiniteScroll
          dataLength={posts.length} //This is important field to render the next data
          next={() => setPage(page + 1)}
          hasMore={!isReachingEnd}
          loader={<Loader />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>No more posts</b>
            </p>
          }
        >
          {posts?.map((tweet, i) => (
            <TweetCard tweet={tweet} key={i} />
          ))}
          {/* key={tweet._id.toString()}  */}
        </InfiniteScroll>
      </div>
      <div className="col-span-8 space-y-4 md:col-span-3">
        <Trends />
        <People />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const cookie = context.req.headers?.cookie;
  console.log("inside-------------");
  try {
    const cookie = context.req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");
    console.clear()
    // await axios.get("/api/auth/me/");
console.log({axios});

    // it returns 301 if the user is not authenticated
    const res = await axios.get("/api/auth/me", { headers: { cookie } });
    // const res1 = await axios.get(`${process.env.VERCEL_URL}/api/auth/me`, { headers: { cookie } });
console.log("RES-------",res.data.user);
// console.log("RES1-------",res1.data.user);

    return { props: { user: res.data.user } };
  } catch (error) {
    console.log("got error in api/auth/me",error.message);
    
    return { props: { user: null } };
  }
}
