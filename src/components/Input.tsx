import { IoMdLock } from "react-icons/io";

export default function Input({ register, Icon, error, ...rest }) {
  return (
    <div>
      <div className="relative flex items-center py-1 ">
        <Icon
          className="absolute mr-2 text-white"
          size={20}
          style={{ left: "0.5rem" }}
        />

        <input
          {...rest}
          ref={register}
          className="w-full px-8 py-2 text-white bg-transparent border-2 border-gray-500 rounded-lg focus:outline-none focus:border-green"
        />
      </div>
      {error && <p className="m-0 text-sm text-red-600">{error?.message}</p>}
    </div>
  );
}
