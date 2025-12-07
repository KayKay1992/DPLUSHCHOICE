const Home = () => {
  return (
    <div className="flex justify-between h-screen p-2 bg-linear-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* left */}
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap gap-4 sm:gap-6 p-4 sm:p-6 justify-center">
          <div className="bg-white/20 backdrop-blur-lg h-40 w-40 sm:h-52 sm:w-52 shadow-2xl rounded-2xl flex flex-col items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="h-24 w-24 sm:h-32 sm:w-32 m-3 sm:m-5 border-6 sm:border-8 border-pink-400 rounded-full flex items-center justify-center bg-linear-to-br from-pink-100 to-purple-100 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                699
              </h2>
            </div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
              Orders
            </h3>
          </div>
          <div className="bg-white/20 backdrop-blur-lg h-40 w-40 sm:h-52 sm:w-52 shadow-2xl rounded-2xl flex flex-col items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="h-24 w-24 sm:h-32 sm:w-32 m-3 sm:m-5 border-6 sm:border-8 border-blue-400 rounded-full flex items-center justify-center bg-linear-to-br from-blue-100 to-cyan-100 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold bg-linear-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                699
              </h2>
            </div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
              Users
            </h3>
          </div>
          <div className="bg-white/20 backdrop-blur-lg h-40 w-40 sm:h-52 sm:w-52 shadow-2xl rounded-2xl flex flex-col items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
            <div className="h-24 w-24 sm:h-32 sm:w-32 m-3 sm:m-5 border-6 sm:border-8 border-emerald-400 rounded-full flex items-center justify-center bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                699
              </h2>
            </div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
              Product
            </h3>
          </div>
        </div>
        {/* tabel */}
      </div>
    </div>
  );
};

export default Home;
