import TweetCard from "../components/TweetCard";
import TweetInput from "../components/TweetInput";
import Trends from "../components/Trends";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth.context";

export default function Home() {
  const { push } = useRouter();
  const { user } = useAuthState();
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      {/* <div className="col-span-2">Sidebar</div> */}
      <div className="sm:col-span-5 col-span-8">
        {user ? (
          <TweetInput />
        ) : (
          <div>
            {" "}
            <p>Sign to talk to the world 😉</p>
            <button
              onClick={() => push("/auth")}
              className="border border-blue-600 p-1 bg-blue-600"
            >
              Sign up / Sign in
            </button>
          </div>
        )}
        <TweetCard />
        <TweetCard />
        <TweetCard />
        <TweetCard />
        <TweetCard />
      </div>
      <div className="col-span-8 sm:col-span-3">
        <Trends />
      </div>
    </div>
  );
}
