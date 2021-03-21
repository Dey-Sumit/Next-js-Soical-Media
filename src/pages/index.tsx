import TweetCard from "../components/TweetCard";
import TweetInput from "../components/TweetInput";
import Trends from "../components/Trends";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth.context";
import axios from "axios";
import useSWR from "swr";
import { Post } from "../types.frontend";
import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const { push } = useRouter();
  const { user } = useAuthState();

  // useEffect(() => {
  //   if (!user) {
  //     push("/auth");
  //   }
  // }, [user]);

  const { data }: { data?: { posts: Post[] } } = useSWR("/api/posts");
  // console.log(data);

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      {/* <div className="col-span-2">Sidebar</div> */}
      <Head>
        <title>Twitter Clone</title>
      </Head>
      <div className="md:col-span-5 col-span-8">
        {user ? (
          <TweetInput
            placeholder="Hey Sumit! What's on your mind ?"
            buttonText="Tweet"
            endpoint="/api/posts"
          />
        ) : (
          <div className="text-center p-3">
            {" "}
            <p>Sign in to talk to the world 😉</p>
            <button
              onClick={() => push("/auth")}
              className="border border-blue-600 p-1 bg-blue-600 my-3"
            >
              Sign up / Sign in
            </button>
          </div>
        )}
        {data?.posts.map((tweet) => (
          <TweetCard tweet={tweet} key={tweet._id} />
        ))}
      </div>
      <div className="col-span-8 md:col-span-3">
        <Trends />
      </div>
    </div>
  );
}
