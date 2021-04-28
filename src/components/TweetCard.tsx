import { BsClockHistory } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { FaCommentAlt, FaHeart, FaRegComment } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { GoComment } from "react-icons/go";
import { FunctionComponent, useState } from "react";
import { FPost } from "lib/types";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuthState } from "context/auth.context";
import timeSince from "lib/timeSince";
import { useLayoutDispatch } from "context/layout.context";
import { SHOW_MODAL } from "context/types";
import { MdDelete } from "react-icons/md";
import { mutate } from "swr";
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
    user: {
      _id: uid,
      name,
      username,
      profilePicture,
      noOfFollowers,
      noOfFollowing,
      bio,
    },
    likes,
    comments,
    attachmentURL,
    _id,
    createdAt,
    tags,
    clientOnly,
  },
}) => {
  const { user } = useAuthState();
  const dispatch = useLayoutDispatch();

  // const extractedTags = tags.map((tag) => tag.name);
  const { push } = useRouter();
  const [likesCount, setLikesCount] = useState<number>(
    likes ? likes.length : 0
  );
  const [likedByMe, setLikedByMe] = useState<boolean>(
    likes?.map((like) => like.user).includes(user?._id)
  );
  // console.log({likedByMe,likes,user});

  const [showCard, setShowCard] = useState(false);
  const handleLike = async (e: any) => {
    e.stopPropagation();
    if (!user) {
      dispatch({
        type: SHOW_MODAL,
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
          src={profilePicture}
          alt=""
          onClick={() => push(`/user/${uid}`)}
          onMouseEnter={() => setShowCard(true)}
          onMouseLeave={() => setShowCard(false)}
          className="w-10 h-10 rounded-full cursor-pointer "
        />
        {/* //TODO separate component */}
        {showCard && (
          <div className="absolute z-10 flex flex-col flex-shrink-0 p-2 space-y-3 border rounded-lg shadow-lg top-10 left-10 bg-dark-700 w-60">
            <img
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
        )}
      </div>

      <div
        className="flex-col w-full p-3 px-4 space-y-3 rounded-md shadow-sm cursor-pointer bg-dark-600"
        onClick={() => !clientOnly && push(`/tweet/${_id}`)}
      >
        {/* top */}
        <div className="flex items-center">
          <span className="text-white">{name}</span>
          <span className="ml-2 text-gray-400 cursor-pointer hover:text-blue-700">
            @{username}
          </span>
          {clientOnly && (
            <span className="w-3 h-3 ml-3 bg-blue-700 rounded-full animate-pulse"></span>
          )}
          <div className="flex items-center ml-auto space-x-2">
            <BsClockHistory size="14" />{" "}
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
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
