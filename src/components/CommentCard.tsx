import { BsClockHistory } from "react-icons/bs";
import { FunctionComponent } from "react";
import { Comment } from "../types.frontend";
import { useRouter } from "next/router";

const CommentCard: FunctionComponent<{ data: Comment }> = ({
  data: {
    content,
    user: { name, username },
    _id,
  },
}) => {
  const { push } = useRouter();

  return (
    <div className="flex p-2 space-x-3 ">
      <img
        src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
        alt=""
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={() => push(`/user/${username}`)}
      />

      <div className="flex-col shadow-sm space-y-3 bg-dark-600 rounded-md p-3 px-4 w-full cursor-pointer">
        {/* top */}
        <div className="flex">
          <span className="text-white">{name}</span>
          <span className="ml-2 text-gray-400 cursor-pointer hover:text-blue-700">
            @{username}
          </span>
          <div className="ml-auto flex space-x-1 items-center">
            <BsClockHistory size="14" /> <span>5 hours</span>
          </div>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default CommentCard;
