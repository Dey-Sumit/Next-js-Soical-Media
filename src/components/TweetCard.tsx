import { BsClockHistory } from "react-icons/bs";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaCommentAlt, FaHeart } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { FunctionComponent, useEffect, useState } from "react";
import { Post } from "../types.frontend";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuthState } from "../context/auth.context";
import timeSince from "../../lib/timeSince";
// import Heart from "react-animated-heart";

const TweetCard: FunctionComponent<{ tweet: Post }> = ({
  tweet: {
    content,
    user: { _id: uid, name, username },
    likes,
    comments,
    _id,
    createdAt,
  },
}) => {
  const { user } = useAuthState();
  // console.log(user);
  console.log({ createdAt });

  const { push } = useRouter();
  const [likesCount, setLikesCount] = useState<number>(likes.length);
  const [likedByMe, setLikedByMe] = useState<boolean>(
    likes?.map((like) => like.user).includes(user._id)
  );

  const handleLike = async (e: any) => {
    e.stopPropagation();
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

  return (
    <div className="flex p-2 space-x-3 ">
      <img
        src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
        alt=""
        className="w-10 h-10 rounded-full cursor-pointer"
      />

      <div
        className="flex-col shadow-sm space-y-3 bg-dark-600 rounded-md p-3 px-4 w-full cursor-pointer"
        onClick={() => push(`/tweet/${_id}`)}
      >
        {/* top */}
        <div className="flex">
          <span className="text-white">{name}</span>
          <span className="ml-2 text-gray-400 cursor-pointer hover:text-blue-700">
            @{username}
          </span>
          <div className="ml-auto flex space-x-1 items-center">
            <BsClockHistory size="14" />{" "}
            <span>{timeSince(new Date(createdAt))}</span>
          </div>
        </div>
        <div>{content}</div>
        <div className="flex justify-around divide-x divide-dark-400">
          <div className="flex space-x-2 pl-5 items-center  cursor-pointer">
            <FaCommentAlt />
            <span>{comments.length}</span>
          </div>
          <div
            className="flex space-x-2 items-center pl-5  cursor-pointer"
            onClick={handleLike}
          >
            {/* <Heart isClick={likedByMe}  /> */}
            <FaHeart className={likedByMe ? "text-red-600" : ""} />
            <span>{likesCount}</span>
          </div>
          <div className="flex space-x-2 items-center pl-5  cursor-pointer">
            <AiOutlineRetweet />
            <span>34</span>
          </div>
          <div className=" cursor-pointerflex space-x-2 pl-5 items-center">
            <IoMdShareAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
