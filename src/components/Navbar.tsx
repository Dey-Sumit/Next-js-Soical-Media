import { useRouter } from "next/router";
import { BiSearchAlt } from "react-icons/bi";
import { FaShoppingBag } from "react-icons/fa";

const Navbar = () => {
  const { push } = useRouter();

  return (
    <div className="flex items-center justify-between p-3 bg-dark-600 text-dark-100 md:px-10 lg:px-16">
      <div className="flex space-x-3">
        <span>About</span>
        <span>Help</span>
      </div>
      <div className="flex items-center space-x-3 bg-dark-700 px-3 py-1 justify-center lg:w-96 w-72">
        <BiSearchAlt />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-dark-100 focus:outline-none w-full"
        />
      </div>
      <div className="flex space-x-3 items-center">
        <span>Hey Sumit!</span>
        <img
          src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
          alt=""
          className="w-8 h-8 rounded-full "
        />
      </div>
    </div>
  );
};

export default Navbar;
