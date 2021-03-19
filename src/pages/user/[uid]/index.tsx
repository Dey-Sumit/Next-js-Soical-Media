import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsLockFill } from "react-icons/bs";
import { MdDelete, MdSettings } from "react-icons/md";
import useSWR, { mutate } from "swr";
import TweetCard from "../../../components/TweetCard";
import { useAuthState } from "../../../context/auth.context";
import { Post, User } from "../../../types.frontend";

const profile = () => {
  const { push, query } = useRouter();
  const { user: authUser } = useAuthState();
  const { data, error }: { data?: { user: User }; error?: any } = useSWR(
    `/api/users/${query?.uid}`
  );
  const {
    data: posts,
    error: postsError,
  }: { data?: { posts: Post[] }; error?: any } = useSWR(
    `/api/posts?uid=${query?.uid}`
  );
  console.log(posts);

  console.log(data);
  const profileData = data?.user;
  const [isFollowing, setIsFollowing] = useState(
    profileData?.followers.includes(authUser._id)
  );

  useEffect(() => {
    if (!authUser) {
      push("/auth");
    }
  }, [authUser]);
  console.log(query.uid);
  //TODO refactor these function , make one 👇
  const handleFollow = async () => {
    setIsFollowing(true);
    await axios.put(`api/users/${profileData._id}/follow`); //? make the request
    mutate(`api/users/${profileData._id}/follow`); //? refetch the data and compare if everything is fine or anything goes wrong in the previous request
  };
  const handleUnFollow = async () => {
    setIsFollowing(false);
    await axios.put(`api/users/${profileData._id}/unfollow`); //? make the request
    mutate(`api/users/${profileData._id}/unfollow`); //? refetch the data and compare if everything is fine or anything goes wrong in the previous request
  };

  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid grid-cols-8 gap-8 ">
      <div className="col-span-8 md:col-span-3">
        {/* profile */}
        <div className="flex flex-col items-center p-3 space-y-2 rounded-sm shadow-md bg-dark-600">
          <img
            src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
            alt=""
            className="rounded-full w-28 h-28"
          />
          <h3 className="text-lg font-medium">{profileData?.name}</h3>
          <h4>@{profileData?.username}</h4>
          <h5>Kolkata, India</h5>
          <div className="flex space-x-6 divide-x divide-dark-500">
            <div className="flex flex-col items-center pl-4">
              <span>Tweets</span>
              <span>45</span>
            </div>
            <div className="flex flex-col items-center pl-4">
              <span>Followers</span>
              <span>{profileData?.followers.length}</span>
            </div>
            <div className="flex flex-col items-center pl-4">
              <span>Following</span>
              <span>{profileData?.following.length}</span>
            </div>
          </div>
          {authUser?._id !== profileData?._id && (
            <>
              {!isFollowing ? (
                <button
                  className=" p-1 space-x-2 border rounded-sm cursor-pointer border-blue-600 bg-blue-600 hover:bg-transparent hover:text-blue-600"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              ) : (
                <button
                  className=" p-1 space-x-2 border rounded-sm cursor-pointer border-blue-500 bg-blue-500 hover:bg-transparent hover:text-blue-500"
                  onClick={handleUnFollow}
                >
                  UnFollow
                </button>
              )}
            </>
          )}
        </div>
        {authUser?._id === profileData?._id && (
          <div className="flex flex-col mt-2 space-y-2">
            <Link href="/user/edit">
              <a>
                <div className="flex items-center justify-center p-2 space-x-2 border rounded-sm cursor-pointer border-dark-400">
                  <MdSettings /> <span>Edit Profile</span>
                </div>
              </a>
            </Link>

            <div className="flex items-center justify-center p-2 space-x-2 text-red-600 border border-red-600 rounded-sm cursor-pointer">
              <BsLockFill /> <span>Change Password </span>
            </div>

            <div className="flex items-center justify-center p-2 space-x-2 text-white bg-red-600 rounded-sm cursor-pointer">
              <MdDelete /> <span> Delete Account </span>
            </div>
          </div>
        )}{" "}
      </div>
      {/* <div className="col-span-2">Sidebar</div> */}
      <div className="col-span-8 rounded-sm md:col-span-5 bg-dark-500">
        <div className="flex px-4 py-2 space-x-4 shadow-lg ">
          <span className="text-blue-600">Tweets</span>
          <span>Retweets</span>
          <span>Follwers</span>
          <span>Save</span>
        </div>
        <div className="p-2">
          {posts?.posts.map((tweet) => (
            <TweetCard tweet={tweet} key={tweet._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default profile;

// export const getServerSi
