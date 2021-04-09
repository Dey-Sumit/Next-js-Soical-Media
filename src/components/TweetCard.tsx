import { BsClockHistory } from "react-icons/bs";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaCommentAlt, FaHeart } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { FunctionComponent, useState } from "react";
import { Post } from "lib/types";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuthState } from "../context/auth.context";
import timeSince from "../../lib/timeSince";
import { useLayoutDispatch } from "../context/layout.context";
import { SHOW_MODAL } from "../context/types";
import { MdDelete } from "react-icons/md";
import { mutate } from "swr";
// import Heart from "react-animated-heart";

const TweetCard: FunctionComponent<{ tweet: Post }> = ({
  tweet: {
    content,
    user: { _id: uid, name, username, profilePicture },
    likes,
    comments,
    attachmentURL,
    _id,
    createdAt,
    tags,
  },
}) => {
  const { user } = useAuthState();
  const dispatch = useLayoutDispatch();
  const extractedTags = tags.map((tag) => tag.name);
  const { push } = useRouter();
  const [likesCount, setLikesCount] = useState<number>(likes.length);
  const [likedByMe, setLikedByMe] = useState<boolean>(
    likes?.map((like) => like.user).includes(user?._id)
  );

  const [showCard, setShowCard] = useState(false);
  const handleLike = async (e: any) => {
    if (!user) {
      dispatch({
        type: SHOW_MODAL,
      });
      return;
    }
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
  const handleDelete = async (e: any) => {
    e.stopPropagation();

    await axios.delete(`/api/posts/${_id}/`);
    //TODO optimistic using SWR
    mutate("/api/posts/");
  };

  const handleTags = (e, tag: string) => {
    e.stopPropagation();

    push(`/tags/${tag}`);
  };
  // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIwP9FAQJOd8w7eHWWcjJyZnUwZN8ENSjFg&usqp=CAU

  return (
    <div className="flex p-2 space-x-3 ">
      <div className="relative">
        <img
          src={
            profilePicture ||
            "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
          }
          alt=""
          onClick={() => push(`/user/${uid}`)}
          onMouseEnter={() => setShowCard(true)}
          onMouseLeave={() => setShowCard(false)}
          className="w-10 h-10 rounded-full cursor-pointer"
        />
        {/* //TODO separate component */}
        {showCard && (
          <div className="absolute z-10 flex flex-col p-2 space-y-3 border rounded-lg shadow-lg top-10 left-10 bg-dark-700 w-60">
            <img
              src={
                profilePicture ||
                "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
              }
              alt=""
              onClick={() => push(`/user/${uid}`)}
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <p>
              {name} | @{username}
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
              modi!
            </p>
            <div className="flex p-1 space-x-2 ">
              <span>Followers : 13</span>
              <span>Followings : 56</span>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex-col w-full p-3 px-4 space-y-3 rounded-md shadow-sm cursor-pointer bg-dark-600"
        onClick={() => push(`/tweet/${_id}`)}
      >
        {/* top */}
        <div className="flex">
          <span className="text-white">{name}</span>
          <span className="ml-2 text-gray-400 cursor-pointer hover:text-blue-700">
            @{username}
          </span>
          <div className="flex items-center ml-auto space-x-1">
            <BsClockHistory size="14" />{" "}
            <span>{timeSince(new Date(createdAt))}</span>
          </div>
        </div>
        <div>{content}</div>
        <div className="flex space-x-3">
          {extractedTags.map((tag) => (
            <span
              className="p-1 bg-blue-500 rounded-sm"
              onClick={(e) => handleTags(e, tag)}
              key={tag}
            >
              #{tag}
            </span>
          ))}
        </div>
        <div>
          {attachmentURL && (
            <img
              src={attachmentURL}
              alt="attachment"
              className="object-contain w-full border rounded-xl h-72"
            />
          )}
        </div>
        <div className="flex justify-around ">
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaCommentAlt />
            <span>{comments.length}</span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLike}
          >
            {/* <Heart isClick={likedByMe}  /> */}
            <FaHeart className={likedByMe ? "text-red-600" : ""} />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <AiOutlineRetweet size={21} />
            <span>34</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <IoMdShareAlt size={22} />
          </div>
          {user?._id == uid && (
            <MdDelete
              size={22}
              className="text-red-500"
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
