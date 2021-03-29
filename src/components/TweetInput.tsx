import axios from "axios";
import { FunctionComponent, useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuthState } from "../context/auth.context";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
// TODO refactor for COMMENT INPUT
const TweetInput: FunctionComponent<{
  buttonText: string;
  placeholder: string;
  endpoint: string;
  mutationEndpoint?: string;
}> = ({ buttonText, placeholder, endpoint, mutationEndpoint = endpoint }) => {
  const [text, setText] = useState("");
  const [picture, setPicture] = useState("");

  const { user } = useAuthState();

  const { register, handleSubmit, errors } = useForm();

  const { data } = useSWR(endpoint);
  const onChangePicture = (e) => {
    // console.log('picture: ', picture);
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  const ENDPOINT = "/api/posts";
  //TODO optimistic UI ***
  // const { comments } = data;
  // console.log(data);

  const handleTweet = async (data) => {
    console.log(data);

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
    const formData = new FormData();
    formData.append("content", data.text);
    if (data.attachment[0]) {
      formData.append("attachment", data.attachment[0]);
    }

    // await axios.post(endpoint, { content: text }); //? make the request
    // mutate(mutationEndpoint); //? refetch the data and compare if everything is fine or anything goes wrong in the previous request
    // console.log("triggered");
    // mutate("/api/posts/",{content:tweet},axios.post())

    await axios(ENDPOINT, {
      method: "POST",
      data: formData,
      // "content-type": "multipart/form-data",
    });
    mutate(ENDPOINT);

    // setIsUpdating(false);
    // console.log(profileData);

    setText("");
  };
  return (
    <div className="flex p-2 space-x-2">
      <img
        src={
          user?.profilePicture ||
          "https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
        }
        alt=""
        className="w-10 h-10 rounded-full "
      />
      <div className="flex-1">
        <form onSubmit={handleSubmit(handleTweet)}>
          <textarea
            ref={register}
            className="w-full h-24 p-2 bg-transparent border resize-none border-dark-100 focus:outline-none rounded-md"
            placeholder={placeholder}
            // onChange={(e) => setText(e.target.value)}
            // value={text}
            name="text"
          />
          {picture && (
            <div className="relative">
              <img
                src={picture}
                alt=" attachement"
                className=" mx-auto h-48 rounded-xl border"
              />
              <MdCancel
                className="absolute w-10 h-10 text-gray-600 cursor-pointer transform -translate-x-1/2 inset-x-1/2 bottom-3"
                onClick={() => setPicture("")}
              />
            </div>
          )}
          <div className="flex p-1 ">
            <div>
              {/* <HiOutlinePhotograph size="20" className="" /> */}
              <label htmlFor="file-input">
                <HiOutlinePhotograph className=" w-10 h-10 text-blue-700 cursor-pointer" />
              </label>
              <input
                id="file-input"
                // ref={register}

                onChange={onChangePicture}
                type="file"
                name="attachment"
                className="hidden"
                ref={register}
              />
            </div>
            <button
              className="px-4 py-1 ml-auto font-bold tracking-wide bg-blue-700 rounded-md"
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetInput;
