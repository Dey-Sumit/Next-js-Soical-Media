import axios from "axios";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { mutate } from "swr";
import { useAuthState } from "../context/auth.context";
import { MdCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { BiImage } from "react-icons/bi";

const CreateTweet: FunctionComponent<{}> = () => {
  const [picture, setPicture] = useState("");
  const { user } = useAuthState();

  const { register, handleSubmit, reset, getValues } = useForm();

  const onChangePicture = (e: ChangeEvent<HTMLInputElement>) =>
    setPicture(URL.createObjectURL(e.target.files[0]));

  const ENDPOINT = "/api/posts";

  const handleTweet = async (data: { text: string; attachment?: string }) => {
    if (!data.text) return;
    const formData = new FormData();
    formData.append("content", data.text);
    if (data.attachment[0]) formData.append("attachment", data.attachment[0]);

    await axios(ENDPOINT, {
      method: "POST",
      data: formData,
    });

    mutate(ENDPOINT);

    reset(); // reset the form
    setPicture("");
  };
  return (
    <div className="flex p-2 space-x-2">
      <img
        src={
          user?.profilePicture ||
          "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
        }
        alt="avatar"
        className="w-10 h-10 rounded-full "
      />
      <div className="flex-1">
        <form onSubmit={handleSubmit(handleTweet)}>
          <textarea
            ref={register}
            className="w-full h-24 p-2 bg-transparent border rounded-md resize-none border-dark-100 focus:outline-none"
            placeholder={`Hey ${user?.username}, what's going on?`}
            name="text"
          />
          {picture && (
            <div className="relative">
              <img
                src={picture}
                alt=" attachment"
                className="h-48 mx-auto border rounded-xl"
              />
              <MdCancel
                className="absolute w-8 h-8 text-gray-600 transform -translate-x-1/2 cursor-pointer inset-x-1/2 bottom-3"
                onClick={() => setPicture("")}
              />
            </div>
          )}
          <div className="flex p-1 ">
            <div>
              <label htmlFor="file-input">
                <BiImage className="w-10 h-10 text-blue-700 cursor-pointer " />
              </label>
              <input
                id="file-input"
                onChange={onChangePicture}
                type="file"
                name="attachment"
                className="hidden"
                ref={register}
              />
            </div>
            <button
              className="px-4 py-1 ml-auto font-bold tracking-wide bg-blue-700 rounded-md focus:outline-none"
              type="submit"
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTweet;
