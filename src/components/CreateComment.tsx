import axios from "axios";
import { FunctionComponent, useState } from "react";
import { mutate } from "swr";
import { useAuthState } from "../context/auth.context";
import { useForm } from "react-hook-form";
const CreateComment: FunctionComponent<{
  tid: string;
}> = ({ tid }) => {
  const { user } = useAuthState();
  const { register, handleSubmit, reset } = useForm();
  const handleTweet = async (data: { content: string }) => {
    if (data.content.length === 0) return;
    //use swr
    // mutate (change the data immediately -> optimistic UI)
    // mutate(endpoint, [...data, { content: text, user: {} }], false); //? OPTIMISTIC UI ; update the client side data immediately , revalidation false

    // mutate(
    //   endpoint,
    //   {
    //     ...data,
    //     comments: [...comments, { content: text, user: {} }],
    //   },
    //   false
    // ); //? OPTIMISTIC UI ; update the client side data immediately , revalidation false

    // console.log(data);

    // await axios.post(endpoint, { content: text }); //? make the request
    // mutate(mutationEndpoint); //? refetch the data and compare if everything is fine or anything goes wrong in the previous request
    // console.log("triggered");
    // mutate("/api/posts/",{content:tweet},axios.post())

    await axios(`/api/posts/${tid}/comments`, {
      method: "POST",
      data,
    });
    mutate(`/api/posts/${tid}`);

    reset();
  };
  return (
    <div className="flex p-2 space-x-2">
      <img
        src={
          user?.profilePicture 
                }
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
