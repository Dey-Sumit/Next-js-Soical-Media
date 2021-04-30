import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsLockFill } from "react-icons/bs";
import { MdDelete, MdSettings } from "react-icons/md";
import useSWR, { mutate } from "swr";
import TweetCard from "components/TweetCard";
import { useAuthState } from "context/auth.context";
import { FUser } from "lib/types";
import Head from "next/head";
import Loader from "components/Loader";
import Followers from "components/Followers";
import { usePaginatedPosts } from "lib/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import UserCard from "components/UserCard";
import Image from "next/image";

const profile = ({ sameUser }) => {
  const { push, query } = useRouter();
  const { user: authUser } = useAuthState();

  const { data: profileData, error } = useSWR<FUser>(
    `/api/users/${query?.uid}`
  );
  const {
    error: getPostsError,
    posts,
    page,
    setPage,
    isReachingEnd,
  } = usePaginatedPosts(`/api/posts?${query?.uid}`);

  const { data: following, error: getFollowingsError } = useSWR<FUser[]>(
    `/api/users/${query?.uid}/following`
  );

  const { data: followers, error: getFollowersError } = useSWR<FUser[]>(
    `/api/users/${query?.uid}/followers`
  );

  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [currentTab, setCurrentTab] = useState<string>("posts");

  useEffect(() => {
    const temp = authUser && profileData?.followers.includes(authUser._id);

    setIsFollowing(temp);
  }, [profileData, authUser]);

  const handleFollow = async (type: "follow" | "unfollow") => {
    // TODO fix this
    const ENDPOINT = `/api/users/${profileData._id}/${type}`;
    await axios.put(ENDPOINT); //? make the request
    setIsFollowing((value) => !value);
    mutate(ENDPOINT); //? refetch the data and compare if everything is fine or anything goes wrong in the previous request
    mutate(`/api/users/${query?.uid}`); // update the profile data
    mutate(`/api/users/${profileData._id}/followers`);
  };

  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid gap-8 md:grid-cols-8 ">
      <Head>
        <title>{profileData ? profileData.username : "Profile"}</title>
      </Head>
      <div className="col-span-8 lg:col-span-3">
        {/* profile */}
        <div className="flex flex-col items-center p-3 space-y-2 rounded-sm shadow-md bg-dark-600">
          {profileData && (
            <Image
              width={112}
              height={112}
              src={profileData.profilePicture}
              // src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
              alt=""
              className="rounded-full w-28 h-28"
            />
          )}
          <h3 className="text-lg font-semibold">{profileData?.name}</h3>
          <h4>@{profileData?.username}</h4>
          <h4>{profileData?.bio}</h4>
          <div className="flex space-x-6 divide-x divide-dark-500">
            <div className="flex flex-col items-center pl-4">
              <span className="text-gray-400">Tweets</span>
              <span>{profileData?.noOfPosts}</span>
            </div>
            <div className="flex flex-col items-center pl-4">
              <span className="text-gray-400">Followers</span>
              <span>{profileData?.noOfFollowers}</span>
            </div>
            <div className="flex flex-col items-center pl-4">
              <span className="text-gray-400">Following</span>
              <span>{profileData?.noOfFollowing}</span>
            </div>
          </div>
          {!profileData && <Loader />}
          {!sameUser && (
            <>
              {!isFollowing ? (
                <button
                  className="p-1 space-x-2 bg-blue-600 border border-blue-600 rounded-sm cursor-pointer hover:bg-transparent hover:text-blue-600"
                  onClick={() => handleFollow("follow")}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="p-1 space-x-2 bg-blue-500 border border-blue-500 rounded-sm cursor-pointer hover:bg-transparent hover:text-blue-500"
                  onClick={() => handleFollow("unfollow")}
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

            {/* <div className="flex items-center justify-center p-2 space-x-2 text-red-600 border border-red-600 rounded-sm cursor-pointer">
              <BsLockFill /> <span>Change Password </span>
            </div> */}

            <button className="flex items-center justify-center p-2 space-x-2 text-white bg-red-600 rounded-sm cursor-pointer">
              <MdDelete /> <span> Delete Account </span>
            </button>
          </div>
        )}
      </div>
      {/* <div className="col-span-2">Sidebar</div> */}
      <div className="col-span-8 rounded-sm lg:col-span-5 bg-dark-500">
        <div className="flex px-4 py-2 space-x-4 shadow-lg ">
          <span
            className={`${
              currentTab === "posts" ? "text-blue-600 " : ""
            } cursor-pointer`}
            onClick={() => setCurrentTab("posts")}
          >
            Tweets
          </span>
          <span
            className={`${
              currentTab === "followers" ? "text-blue-600 " : ""
            } cursor-pointer`}
            onClick={() => setCurrentTab("followers")}
          >
            Followers
          </span>
          <span
            className={`${
              currentTab === "following" ? "text-blue-600 " : ""
            } cursor-pointer`}
            onClick={() => setCurrentTab("following")}
          >
            Followings
          </span>
        </div>
        <div className="max-h-screen p-2 overflow-y-auto">
          {currentTab === "posts" && (
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
          )}

          {currentTab === "followers" &&
            (!followers ? (
              <Loader />
            ) : followers.length === 0 ? (
              <h1 className="text-xl font-semibold text-center mt -3">
                You don't have any followers
              </h1>
            ) : (
              followers.map((user) => (
                <UserCard user={user} showFollowButton={true} />
              ))
            ))}

          {currentTab === "following" &&
            (!following ? (
              <Loader />
            ) : following.length === 0 ? (
              <h1 className="text-xl font-semibold text-center mt -3">
                You are not following anyone
              </h1>
            ) : (
              following.map((user) => (
                <UserCard user={user} showFollowButton={true} />
              ))
            ))}
        </div>
      </div>
    </div>
  );
};

export default profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const cookie = context.req.headers?.cookie;
  // console.log("inside");
  try {
    const cookie = context.req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");
    // const res = await axios.get("/api/auth/me/");

    // it returns 401 if the user is not authenticated
    const { data } = await axios.get(
      `${process.env.API_BASE_ENDPOINT}/api/auth/me`,
      {
        headers: { cookie },
      }
    );

    return {
      props: {
        sameUser: data.user._id == context.query.uid,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/auth",
        statusCode: 302,
      },
    };
  }
}
