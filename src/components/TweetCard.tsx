import { BsClockHistory } from "react-icons/bs";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaCommentAlt, FaHeart } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";

const TweetCard = () => {
  return (
    <div className="flex p-2 space-x-3 ">
      <img
        src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
        alt=""
        className="w-10 h-10 rounded-full cursor-pointer"
      />

      <div className="flex-col shadow-sm space-y-3 bg-dark-500 rounded-md p-3 px-4 ">
        {/* top */}
        <div className="flex">
          <span>Jack Sheldon</span>
          <span className="ml-2 text-gray-400 cursor-pointer hover:text-blue-700">
            @Jack
          </span>
          <div className="ml-auto flex space-x-1 items-center">
            <BsClockHistory size="14" /> <span>5 hours</span>
          </div>
        </div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolor
          optio fugit!
        </div>
        <div className="flex justify-around">
          <div className="flex space-x-2 items-center cursor-pointer">
            <FaCommentAlt />
            <span>8</span>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            <FaHeart className="text-red-600" />
            <span>17</span>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            <AiOutlineRetweet />
            <span>34</span>
          </div>
          <div className=" cursor-pointerflex space-x-2 items-center">
            <IoMdShareAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
