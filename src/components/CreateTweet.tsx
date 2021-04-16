import axios from "axios";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { mutate } from "swr";
import { useAuthState } from "../context/auth.context";
import { MdCancel } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
// import { WithContext as ReactTags } from "react-tag-input";

const CreateTweet: FunctionComponent<{}> = () => {
  const [picture, setPicture] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tweet, setTweet] = useState("");
  const ENDPOINT = "/api/posts";

  const { user } = useAuthState();

  // const { register, handleSubmit, reset, getValues } = useForm();

  const onChangePicture = (e: ChangeEvent<HTMLInputElement>) =>
    setPicture(URL.createObjectURL(e.target.files[0]));

  const handleTweet = async (e) => {
    e.preventDefault();
    if (!tweet) return;
    const formData = new FormData();
    formData.append("content", tweet);
    console.log({ tags });

    if (tags.length > 0)
      formData.append("tags", tags.join(",").replaceAll("#", ""));
    // if (data.attachment[0]) formData.append("attachment", data.attachment[0]);

    await axios(ENDPOINT, {
      method: "POST",
      data: formData,
    });

    mutate(ENDPOINT);

    setTweet("");
    setTags([]); // reset the form
    setPicture("");
  };

  const handleChange = (e) => {
    setTweet(e.target.value);
    const s = e.target.value;
    setTags(s.match(/#[a-z]+/gi) || []);
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
        <form onSubmit={handleTweet}>
          <div
            className={`border ${
              tweet.length < 100 ? "border-dark-100" : "border-red-500"
            }`}
          >
            <textarea
              // ref={register}
              className="w-full h-24 p-2 bg-transparent rounded-md resize-none focus:outline-none"
              placeholder={`Hey ${user?.username}, what's going on?`}
              name="text"
              value={tweet}
              onChange={handleChange}
            />
            <div className="my-1">
              {tags?.map((tag, i) => (
                <span key={i} className="p-1 mx-1 bg-blue-500 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
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
                <BiImageAdd className="w-10 h-10 text-blue-600 cursor-pointer " />
              </label>
              <input
                id="file-input"
                onChange={onChangePicture}
                type="file"
                name="attachment"
                className="hidden"
              />
            </div>
            <button
              className="px-4 py-1 ml-auto text-lg font-bold bg-blue-700 rounded-full focus:outline-none"
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
