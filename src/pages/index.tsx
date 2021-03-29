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
import { GetServerSidePropsContext } from "next";

export default function Home({ user }) {
  const { push } = useRouter();
  // const { user } = useAuthState();

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const cookie = context.req.headers?.cookie;
  // console.log("inside");
  try {
    const cookie = context.req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");
    // await axios.get("/api/auth/me/");

    // it returns 401 if the user is not authenticated
    const res = await axios.get("/api/auth/me", { headers: { cookie } });
    console.log("executed :(");

    return { props: { user: res.data.user } };
  } catch (error) {
    return { props: { user: null } };
  }
}
