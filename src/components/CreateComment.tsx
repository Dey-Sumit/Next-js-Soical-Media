import axios from "axios";
import { FunctionComponent, useState } from "react";
import { mutate } from "swr";
import { useAuthState } from "../context/auth.context";
import { useForm } from "react-hook-form";
import { FComment } from "lib/types";
const CreateComment: FunctionComponent<{
  tid: string;
}> = ({ tid }) => {
  const { user } = useAuthState();

  const { register, handleSubmit, reset } = useForm();

  const handleTweet = async (data: { content: string }) => {
    if (data.content.length === 0) return;

    const FAKE_COMMENT: FComment = {
      user,
      _id: Math.floor(Math.random()).toString(),
      content: data.content,
      clientOnly: true,
    };
    mutate(
      `/api/posts/${tid}`,
      (existingData) => {
        // [1,2,3].map()
        // console.log({ existingData });
        const existingComments = existingData.comments;
        const newComments = {
          ...existingData,
          comments: [FAKE_COMMENT, ...existingComments],
        };

        return newComments;
      },
      false
    );
    reset();

    await axios(`/api/posts/${tid}/comments`, {
      method: "POST",
      data,
    });

    mutate(`/api/posts/${tid}`);
  };
  return (
    <div className="flex p-2 space-x-2">
      <Image
        src={user?.profilePicture}
        alt=""
        className="w-10 h-10 rounded-full "
      />
      <div className="flex-1">
        <form onSubmit={handleSubmit(handleTweet)}>
          <textarea
            ref={register}
            className="w-full h-24 p-2 bg-transparent border rounded-md resize-none border-dark-100 focus:outline-none"
            placeholder="what's your opinion on this post?"
            name="content"
          />

          <div className="flex p-1 ">
            <button
              className="px-4 py-1 ml-auto font-bold tracking-wide bg-blue-700 rounded-md focus:outline-none"
              type="submit"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComment;
