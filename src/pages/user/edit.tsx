import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsImageFill } from "react-icons/bs";
import useSWR, { mutate } from "swr";

import Input from "components/Input";
import { useAuthState } from "context/auth.context";
import { FUser } from "lib/types";
import Loader from "components/Loader";

const profile = () => {
  const { push } = useRouter();
  const { user: authUser } = useAuthState();
  const [picture, setPicture] = useState("");

  const { register, handleSubmit, errors } = useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  const ENDPOINT = authUser && `/api/users/${authUser._id}`;
  const { data: profileData } = useSWR<FUser>(ENDPOINT);

  const onChangePicture = (e: any) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  //TODO validation using yup
  const onSubmit = async (data) => {
    // TODO show loader for is updating
    if (isUpdating) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("bio", data.bio);
    if (data.profilePicture[0]) {
      formData.append("profilePicture", data.profilePicture[0]);
    }
    setIsUpdating(true);
    // Display the values
    // for (var value of formData.values()) {
    //   console.log(value);
    // }
    await axios(ENDPOINT, {
      method: "PUT",
      data: formData,
      // "content-type": "multipart/form-data",
    });

    mutate(ENDPOINT);

    setIsUpdating(false);
  };
  // useEffect(() => {
  //   if (!authUser) {
  //     push("/auth");
  //   }
  // }, [authUser]);

  // useEffect(() => {
  //   setPicture(picture || profileData?.user.profilePicture);
  // }, [picture]);

  //   const { data, error }: { data?: { user: User }; error?: any } = useSWR(
  //     `/api/users/${query?.uid}`
  //   );
  //  console.log(data);
  // const profileData = data?.user;
  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid grid-cols-8 gap-8 ">
      <div className="col-span-12 p-2">
        <form
          className="flex flex-col w-full mx-auto mt-5 space-y-3 md:w-6/12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl">Edit Profile</h1>
          {profileData ? (
            <>
              <div className="relative">
                <img
                  src={picture || profileData?.profilePicture}
                  alt="profile picture"
                  className="w-40 h-40 mx-auto border rounded-full border-3 inset-1/2 "
                />
                {/* <Input
                register={register}
                type="file"
                name="profilePicture"
                label="profilePicture"
                className="absoulte"
              /> */}
                <label htmlFor="file-input">
                  <BsImageFill
                    size="20"
                    className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 border inset-1/2 "
                  />
                </label>
                <input
                  id="file-input"
                  ref={register}
                  onChange={onChangePicture}
                  type="file"
                  name="profilePicture"
                  className="hidden"
                />
              </div>
              <div className="flex flex-col space-y-3 ">
                <Input
                  register={register}
                  name="name"
                  label="Name"
                  defaultValue={profileData?.name}
                  placeholder="name"
                  error={errors.name}
                />
                <Input
                  register={register}
                  name="bio"
                  label="Bio"
                  defaultValue={profileData?.bio}
                  placeholder="bio"
                  error={errors.name}
                />
                <Input
                  register={register}
                  name="username"
                  label="Username"
                  defaultValue={profileData?.username}
                  placeholder="username"
                  error={errors.username}
                />
              </div>
              {/* uploadImage */}

              <button
                type="submit"
                className="p-2 space-x-2 bg-blue-600 border border-blue-700 rounded-sm cursor-pointer hover:bg-transparent hover:text-blue-600"
              >
                Update Profile{" "}
              </button>
            </>
          ) : (
            <Loader />
          )}
        </form>
      </div>
    </div>
  );
};

export default profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const cookie = context.req.headers.cookie;

    if (!cookie) throw new Error("Missing auth token cookie");

    // it returns 401 if the user is not authenticated
    await axios.get("/api/auth/me", { headers: { cookie } });
    console.log("alright");

    return { props: {} };
  } catch (error) {
    console.log({ E: error.message });

    return {
      redirect: {
        destination: "/auth",
        statusCode: 302,
      },
    };
  }
}
