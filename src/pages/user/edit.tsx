import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import { BsLockFill } from "react-icons/bs";
// import { MdDelete, MdSettings } from "react-icons/md";
// import useSWR from "swr";
import Input from "../../components/Input";
import { useAuthState } from "../../context/auth.context";
// import { User } from "../../types.frontend";

const profile = () => {
  const { push, query } = useRouter();
  const { user: authUser } = useAuthState();

  useEffect(() => {
    if (!authUser) {
      push("/auth");
    }
  }, [authUser]);
  console.log(query.uid);

  //   const { data, error }: { data?: { user: User }; error?: any } = useSWR(
  //     `/api/users/${query?.uid}`
  //   );
  //  console.log(data);
  // const profileData = data?.user;
  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid grid-cols-8 gap-8 ">
      <div className="col-span-12">
        <form className="mx-auto mt-5 w-6/12 flex flex-col space-y-3">
          <h1 className="text-lg font-semibold ">Edit Profile</h1>
          <div className="flex space-x-3">
            <Input name="name" label="Name" placeholder="Name" />
            <Input name="username" label="Username" placeholder="username" />
          </div>
          {/* uploadImage */}
          <Input type="file" name="profilePicture" label="profilePicture" />
          <button
            type="submit"
            className=" p-2 space-x-2 border rounded-sm cursor-pointer border-blue-700 bg-blue-600 hover:bg-transparent hover:text-blue-600"
          >
            Update Profile{" "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const cookie = context.req.headers?.cookie;
  // console.log("inside");
  try {
    const cookie = context.req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");

    // it returns 401 if the user is not authenticated
    await axios.get("/api/auth/me", { headers: { cookie } });

    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: "/auth",
        statusCode: 302,
      },
    };
  }
}
