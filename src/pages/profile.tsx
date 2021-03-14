import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsLockFill } from "react-icons/bs";
import { MdDelete, MdSettings } from "react-icons/md";
import TweetCard from "../components/TweetCard";
import { useAuthState } from "../context/auth.context";

const profile = () => {
  const router = useRouter();
  const { user } = useAuthState();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user]);

  //TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid grid-cols-8 gap-x-8">
      <div className="col-span-3">
        {/* profile */}
        <div className="shadow-md flex flex-col space-y-2 items-center p-3 bg-dark-600 rounded-sm">
          <img
            src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
            alt=""
            className="w-28 h-28 rounded-full"
          />
          <h3 className="font-medium text-lg">Sumit Dey</h3>
          <h4>@username</h4>
          <h5>Kolkata, India</h5>
          <div className="flex space-x-6 divide-x divide-dark-500">
            <div className="flex flex-col pl-4 items-center">
              <span>Tweets</span>
              <span>45</span>
            </div>
            <div className="flex flex-col pl-4 items-center">
              <span>Followers</span>
              <span>78</span>
            </div>
            <div className="flex flex-col pl-4 items-center">
              <span>Following</span>
              <span>23</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-2">
          <div className="cursor-pointer  p-2 border border-dark-400 flex space-x-2 items-center justify-center rounded-sm">
            <MdSettings /> <span>Edit Profile</span>
          </div>
          <div className="cursor-pointer  p-2 border border-red-600 text-red-600 space-x-2 flex items-center justify-center rounded-sm">
            <BsLockFill /> <span>Change Password </span>
          </div>
          <div className="cursor-pointer  p-2 bg-red-600 text-white space-x-2 flex items-center justify-center rounded-sm">
            <MdDelete /> <span> Delete Account </span>
          </div>
        </div>
      </div>
      {/* <div className="col-span-2">Sidebar</div> */}
      <div className="col-span-5 bg-dark-500 rounded-sm">
        <div className="flex space-x-4 shadow-lg px-4 py-2 ">
          <span className="text-blue-600">Tweets</span>
          <span>Retweets</span>
          <span>Medias</span>
        </div>
        <div className="p-2">
          <TweetCard />
          <TweetCard />
          <TweetCard />
          <TweetCard />
          <TweetCard />
        </div>
      </div>
    </div>
  );
};

export default profile;
