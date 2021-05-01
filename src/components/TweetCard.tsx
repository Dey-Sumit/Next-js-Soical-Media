import { BsClockHistory } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { FunctionComponent, useState } from "react";
import { FPost } from "lib/types";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuthState } from "context/auth.context";
import timeSince from "lib/timeSince";
import { useLayoutDispatch } from "context/layout.context";
import {
  SHOW_DELETE_MODAL,
  SHOW_AUTH_MODAL,
  SHOW_CONFIRMATION_MODAL,
  HIDE_MODAL,
} from "context/types";
import { MdDelete } from "react-icons/md";
import { mutate } from "swr";
import Image from "next/image";
import { usePaginatedPosts } from "lib/hooks";
// import Heart from "react-animated-heart";

const Hash: FunctionComponent<{ children: string }> = ({ children }) => {
  const { push } = useRouter();

  return (
    <span
      className="text-blue-600"
      onClick={() => push(`/tags/${children.slice(1)}`)}
    >
      {children}{" "}
    </span>
  );
};

const TweetCard: FunctionComponent<{ tweet: FPost }> = ({
  tweet: {
    content,
    user: { _id: uid, name, username, profilePicture },
    likes,
    comments,
    attachmentURL,
    _id,
    createdAt,
    tags,
    clientOnly,
  },
}) => {
  const { pathname } = useRouter();

  const { user } = useAuthState();
  const dispatch = useLayoutDispatch();
  // const { showDeleteModal, postId } = useLayoutState();
  const { mutate: paginatedPostsMutate } = usePaginatedPosts("/api/posts/feed");

  // const extractedTags = tags.map((tag) => tag.name);
  const { push } = useRouter();
  const [likesCount, setLikesCount] = useState<number>(
    likes ? likes.length : 0
  );
  const [likedByMe, setLikedByMe] = useState<boolean>(
    likes?.map((like) => like.user).includes(user?._id)
  );
  // console.log({likedByMe,likes,user});

  const handleLike = async (e: any) => {
    e.stopPropagation();
    if (!user) {
      dispatch({
        type: SHOW_AUTH_MODAL,
      });
      return;
    }
    setLikedByMe((value) => !value);
    if (!likedByMe) {
      setLikesCount(likesCount + 1);
      await axios.put(`/api/posts/${_id}/rate`, { rate: 1 });
    } else {
      setLikesCount(likesCount - 1);
      await axios.put(`/api/posts/${_id}/rate`, { rate: 0 });
    }
    //TODO optimistic using SWR
  };
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    await axios.delete(`/api/posts/${_id}/`);
    paginatedPostsMutate();
    dispatch({
      type: HIDE_MODAL,
    });

    if (pathname === "/tweet/[tid]") {
      push("/");
    }
  };
  const showModal = async (e: any) => {
    e.stopPropagation();
    dispatch({
      type: SHOW_CONFIRMATION_MODAL,
      // TODO ts on payload intellisense
      payload: {
        subTitle: `This can’t be undone `,
        handleConfirmation: handleDelete,
        buttonText: "Delete",
      },
    });
  };

  // const handleTags = (e, tag: string) => {
  //   e.stopPropagation();

  //   push(`/tags/${tag}`);
  // };
  // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIwP9FAQJOd8w7eHWWcjJyZnUwZN8ENSjFg&usqp=CAU

  return (
    <div className="flex p-2 space-x-3 ">
      {/* <div className="relative"> */}
      <Image
        width={44}
        height={44}
        layout="fixed"
        objectFit="cover"
        quality={100}
        src={profilePicture}
        alt=""
        onClick={() => push(`/user/${uid}`)}
        className="rounded-full cursor-pointer "
      />
      {/* //TODO separate component, remove this feature ; don't need this in the course */}
      {/* {showCard && (
          <div className="absolute z-10 flex flex-col flex-shrink-0 p-2 space-y-3 border rounded-lg shadow-lg top-10 left-10 bg-dark-700 w-60">
            <Image
              width={10}
              height={10}
              src={profilePicture}
              alt=""
              onClick={() => push(`/user/${uid}`)}
              className="w-10 h-10 rounded-full cursor-pointer "
            />
            <p className="">
              {name} | @{username}
            </p>
            {bio && <p>{bio}</p>}
            <div className="flex p-1 space-x-2 ">
              <span>Followers : {noOfFollowers}</span>
              <span>Followings : {noOfFollowing}</span>
            </div>
          </div>
        )} */}
      {/* </div> */}

      <div
        className="flex-col w-full p-3 px-4 space-y-3 rounded-md shadow-sm cursor-pointer bg-dark-600"
        onClick={() => !clientOnly && push(`/tweet/${_id}`)}
      >
        {/* top */}
        <div className="flex items-center">
          <span className="flex-shrink-0 text-white">{name}</span>
          <span className="flex-shrink-0 ml-2 overflow-hidden text-gray-400 cursor-pointer overflow-ellipsis flex-grow-1 whitespace-nowrap hover:text-blue-700 ">
            @{username}
          </span>
          {clientOnly && (
            <span className="w-3 h-3 ml-3 bg-blue-700 rounded-full animate-pulse"></span>
          )}
          <div className="flex items-center flex-shrink-0 ml-auto space-x-2">
            <BsClockHistory size="14" className="hidden md:block" />{" "}
            <span>{timeSince(new Date(createdAt))}</span>
          </div>
        </div>
        <div className="text-lg whitespace-pre-wrap">
          {content.split(" ").map((word, i) => {
            return word[0] !== "#" ? (
              <span key={i}>{word} </span>
            ) : (
              <Hash key={i}>{word}</Hash>
            );
          })}
        </div>
        {/* <div className="flex space-x-3">
          {extractedTags.map((tag) => (
            <span
              className="p-1 bg-blue-500 rounded-sm"
              onClick={(e) => handleTags(e, tag)}
              key={tag}
            >
              #{tag}
            </span>
          ))}
        </div> */}

        {attachmentURL && (
          // TODO image sizing, rounded border
          <div className="relative w-9/12 h-32 mx-auto md:h-64">
            {/* //! Next image does not support blob */}
            {clientOnly ? (
              <img
                src={attachmentURL}
                alt="attachment"
                className="object-cover w-full h-full border rounded-xl"
              />
            ) : (
              <Image
                layout="fill"
                quality={100}
                objectFit="contain"
                src={attachmentURL}
                alt="attachment"
                className="rounded-xl"
              />
            )}
          </div>
        )}

        <div className="flex justify-around ">
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaRegComment
              size={34}
              className="p-2 rounded-full hover:bg-blue-600 hover:bg-opacity-30 hover:text-blue-600"
            />
            {/*// for optimistic UI 👇 */}
            <span>{comments ? comments.length : 0}</span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLike}
          >
            {/* <Heart isClick={likedByMe}  /> */}
            {!likedByMe ? (
              <AiOutlineHeart
                className="p-2 rounded-full hover:bg-red-700 hover:bg-opacity-30 hover:text-red-600"
                size={35}
              />
            ) : (
              <FaHeart size={35} className="p-2 text-red-600" />
            )}

            <span>{likesCount}</span>
          </div>
          {/* <div className="flex items-center space-x-2 cursor-pointer">
            <AiOutlineRetweet size={21} />
            <span>34</span>
          </div> */}
          {/* <div className="flex items-center space-x-2 cursor-pointer">
            <IoMdShareAlt size={22} />
          </div> */}
          {user?._id == uid && (
            <MdDelete
              size={35}
              className="p-2 text-red-500 rounded-full hover:bg-red-600 hover:bg-opacity-30 hover:text-red-600"
              onClick={showModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
