import TweetCard from "../components/TweetCard";
import Trends from "../components/Trends";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import React from "react";
import People from "components/People";
import Loader from "components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePaginatedPosts } from "lib/hooks";
import CreateTweet from "components/CreateTweet";
// TODO error

export default function Home({ user }) {
  const { push } = useRouter();

  // const { data, error } = useSWR<FPaginatedPosts>("/api/posts");
  const { error, posts, page, setPage, isReachingEnd } = usePaginatedPosts(
    !user ? "/api/posts" : "/api/posts/feed"
  );

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
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
        {error && <span>Could not load the post</span>}
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
          {posts?.map((tweet) => (
            <TweetCard tweet={tweet} key={tweet._id.toString()} />
          ))}
        </InfiniteScroll>
      </div>
      <div className="hidden col-span-8 space-y-4 md:col-span-3 md:block">
        {/* <Trends noOfElements={5} />
        <People noOfElements={5} /> */}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // Parse
    const cookie = context.req.headers.cookie;

    if (!cookie) throw new Error("Missing auth token cookie");
    // await axios.get("/api/auth/me/");

    // it returns 301 if the user is not authenticated

    const res = await axios.get(
      `${process.env.API_BASE_ENDPOINT}/api/auth/me`,
      {
        headers: { cookie },
      }
    );

    return { props: { user: res.data.user } };
  } catch (error) {
    console.log(error.message);

    return { props: { user: null } };
  }
}
