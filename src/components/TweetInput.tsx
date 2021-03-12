const TweetInput = () => {
  return (
    <div className="flex space-x-2 p-2">
      <img
        src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"
        alt=""
        className="w-10 h-10 rounded-full "
      />
      <div className="flex-1">
        <textarea
          className="w-full h-24 bg-transparent border-dark-100 border p-2 focus:outline-none resize-none "
          placeholder="Hey Sumit! What's on your mind ?"
        />
        <div className=" p-1 flex">
          <button className="bg-blue-700 px-4 py-1 rounded-md ml-auto font-bold tracking-wide">
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetInput;
