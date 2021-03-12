const Trends = () => {
  return (
    <div className="flex flex-col space-y-3 p-2 bg-dark-600 rounded-md shadow-sm divide-y divide-dark-500">
      <h3 className="text-lg font-medium">Trends For You</h3>
      <div className="flex flex-col pt-2 ">
        <span className="text-white">#ModiJobDo</span>
        <span>4.3m Tweets</span>
      </div>
      <div className="flex flex-col pt-2">
        <span className="text-white">#ModiJobDo</span>
        <span>4.3m Tweets</span>
      </div>
      <div className="flex flex-col pt-2">
        <span className="text-white">#ModiJobDo</span>
        <span>4.3m Tweets</span>
      </div>
      <div className="text-center py-2">SEE MORE</div>
    </div>
  );
};

export default Trends;
