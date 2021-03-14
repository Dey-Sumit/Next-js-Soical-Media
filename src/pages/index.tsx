import Navbar from "../components/Navbar";
import TweetCard from "../components/TweetCard";
import TweetInput from "../components/TweetInput";
import Trends from "../components/Trends";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="grid grid-cols-8 gap-x-8">
      {/* <div className="col-span-2">Sidebar</div> */}
      <div className="col-span-5 ">
        <TweetInput />
        <TweetCard />
        <TweetCard />
        <TweetCard />
        <TweetCard />
        <TweetCard />
      </div>
      <div className="col-span-3">
        <Trends />
      </div>
    </div>
  );
}
