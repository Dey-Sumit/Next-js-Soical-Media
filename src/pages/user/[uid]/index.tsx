import { useRouter } from "next/router";
import { HiOutlineEmojiSad } from "react-icons/hi";
import useSWR from "swr";
import TweetCard from "components/TweetCard";
import { useAuthState } from "context/auth.context";
import Loader from "components/Loader";
import { usePaginatedPosts } from "lib/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import UserCard from "components/UserCard";
import { useState } from "react";
import { FUser } from "lib/types";
import ProfileCard from "components/ProfileCard";

const profile = () => {
  const { query } = useRouter();
  const { data: profileData, error: profileDataError } = useSWR<FUser>(
    `/api/users/${query?.uid}`
  );

  const [currentTab, setCurrentTab] = useState("posts");

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

  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <>
      <div className="grid gap-8 md:grid-cols-8 ">
        <div className="col-span-8 lg:col-span-3">
          {/* profile */}
          {!profileDataError ? (
            <ProfileCard profileData={profileData} />
          ) : (
            <h3 className="flex items-center justify-center customText-h3 ">
              <HiOutlineEmojiSad className="mr-3 text-lg" /> Server Error on
              Profile Data
            </h3>
          )}
        </div>
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
            {currentTab === "posts" &&
              (posts?.length === 0 ? (
                <h3 className=" customText-h3">
                  You don't have any posts yet, create one!
                </h3>
              ) : (
                <InfiniteScroll
                  dataLength={posts.length} //This is important field to render the next data
                  next={() => setPage(page + 1)}
                  hasMore={!isReachingEnd}
                  loader={<Loader />}
                  endMessage={<p className="cutomText-h3">No More Posts</p>}
                >
                  {posts?.map((tweet, i) => (
                    <TweetCard tweet={tweet} key={i} />
                  ))}
                  {/* key={tweet._id.toString()}  */}
                </InfiniteScroll>
              ))}

            {currentTab === "followers" &&
              (!followers ? (
                <Loader />
              ) : followers.length === 0 ? (
                <h1 className="customText-h3">You don't have any followers</h1>
              ) : (
                followers.map((user) => (
                  <UserCard user={user} showFollowButton={true} />
                ))
              ))}

            {currentTab === "following" &&
              (!following ? (
                <Loader />
              ) : following.length === 0 ? (
                <h1 className="customText-h3">You are not following anyone</h1>
              ) : (
                following.map((user) => (
                  <UserCard user={user} showFollowButton={true} />
                ))
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default profile;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // const cookie = context.req.headers?.cookie;
//   // console.log("inside");
//   try {
//     const cookie = context.req.headers.cookie;
//     if (!cookie) throw new Error("Missing auth token cookie");
//     // const res = await axios.get("/api/auth/me/");

//     // it returns 401 if the user is not authenticated
//     const { data: user } = await axios.get(
//       `${process.env.API_BASE_ENDPOINT}/api/auth/me`,
//       {
//         headers: { cookie },
//       }
//     );

//     return {
//       props: {
//         sameUser: user._id == context.query.uid,
//       },
//     };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: "/auth",
//         statusCode: 302,
//       },
//     };
//   }
// }
