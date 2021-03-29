import axios from "axios";
import { FunctionComponent, useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuthState } from "../context/auth.context";

const TweetInput: FunctionComponent<{
  buttonText: string;
  placeholder: string;
  endpoint: string;
  mutationEndpoint?: string;
}> = ({ buttonText, placeholder, endpoint, mutationEndpoint = endpoint }) => {
  const [text, setText] = useState("");
  const { user } = useAuthState();

  const { data } = useSWR(endpoint);

  //TODO optimistic UI ***
  // const { comments } = data;
  // console.log(data);

  const handleTweet = async () => {
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

    await axios.post(endpoint, { content: text }); //? make the request
    mutate(mutationEndpoint); //? refetch the data and compare if everything is fine or anything goes wrong in the previous request
    // console.log("triggered");
    // mutate("/api/posts/",{content:tweet},axios.post())

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
        <textarea
          className="w-full h-24 p-2 bg-transparent border resize-none border-dark-100 focus:outline-none "
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="flex p-1 ">
          <button
            className="px-4 py-1 ml-auto font-bold tracking-wide bg-blue-700 rounded-md"
            onClick={handleTweet}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetInput;
