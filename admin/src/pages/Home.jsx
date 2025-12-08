// src/pages/Home.jsx or src/admin/Home.jsx
import LineChart from "../components/LineChart";

const Home = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,248",
      change: "+12.5%",
      color: "from-pink-500 to-rose-500",
      bg: "from-pink-500/10 to-rose-500/5",
      border: "border-pink-400/30",
      iconBg: "from-pink-100 to-rose-100",
      iconBorder: "border-pink-400",
    },
    {
      title: "Total Users",
      value: "892",
      change: "+8.2%",
      color: "from-blue-500 to-cyan-500",
      bg: "from-blue-500/10 to-cyan-500/5",
      border: "border-blue-400/30",
      iconBg: "from-blue-100 to-cyan-100",
      iconBorder: "border-blue-400",
    },
    {
      title: "Products",
      value: "156",
      change: "+4.1%",
      color: "from-emerald-500 to-teal-500",
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-400/30",
      iconBg: "from-emerald-100 to-teal-100",
      iconBorder: "border-emerald-400",
    },
    {
      title: "Revenue",
      value: "₦2.4M",
      change: "+23.8%",
      color: "from-purple-500 to-pink-500",
      bg: "from-purple-500/10 to-pink-500/5",
      border: "border-purple-400/30",
      iconBg: "from-purple-100 to-pink-100",
      iconBorder: "border-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Welcome back, Admin
          </h1>
          <p className="text-gray-300 mt-3 text-base sm:text-lg font-medium">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${stat.bg} border ${stat.border} backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-pink-500/25`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-gray-200 text-base font-semibold mb-1">
                    {stat.title}
                  </p>
                  <p
                    className={`text-4xl sm:text-5xl font-bold mt-2 bg-linear-to-r ${stat.color} bg-clip-text text-transparent leading-none`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-green-300 text-sm mt-3 flex items-center font-medium">
                    <span className="mr-1">↗</span> {stat.change} this month
                  </p>
                </div>

                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${stat.iconBg} border-4 ${stat.iconBorder} shadow-lg flex items-center justify-center`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl bg-linear-to-br ${stat.color} blur-xl absolute opacity-50`}
                  />
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-white/20 to-transparent rounded-full blur-3xl transform rotate-45 group-hover:rotate-12 transition-transform duration-1000" />
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Recent Transactions */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-white/10">
                <h2 className="text-3xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Latest Transactions
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-300 text-base border-b border-white/10">
                      <th className="pb-4 px-6 font-semibold">
                        Transaction ID
                      </th>
                      <th className="pb-4 px-6 font-semibold">Customer</th>
                      <th className="pb-4 px-6 font-semibold">Amount</th>
                      <th className="pb-4 px-6 font-semibold">Status</th>
                      <th className="pb-4 px-6 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {[
                      {
                        id: "TXN8901",
                        name: "Chioma Okeke",
                        amount: "₦45,000",
                        status: "completed",
                        date: "2 hours ago",
                      },
                      {
                        id: "TXN8899",
                        name: "Ahmed Yusuf",
                        amount: "₦128,500",
                        status: "pending",
                        date: "5 hours ago",
                      },
                      {
                        id: "TXN8897",
                        name: "Tolu Adebayo",
                        amount: "₦89,900",
                        status: "completed",
                        date: "1 day ago",
                      },
                      {
                        id: "TXN8895",
                        name: "Fatima Ali",
                        amount: "₦67,200",
                        status: "completed",
                        date: "2 days ago",
                      },
                    ].map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="py-5 px-6 font-mono text-pink-400 font-medium">
                          {tx.id}
                        </td>
                        <td className="py-5 px-6 text-gray-200 font-medium">
                          {tx.name}
                        </td>
                        <td className="py-5 px-6 font-semibold text-gray-200">
                          {tx.amount}
                        </td>
                        <td className="py-5 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.status === "completed"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            }`}
                          >
                            {tx.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-gray-300 text-sm font-medium">
                          {tx.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Revenue + Chart */}
          <div className="space-y-6">
            {/* Revenue Cards */}
            <div className="bg-linear-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-pink-400/30 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Total Revenue
              </h3>
              <p className="text-4xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                ₦2,480,000
              </p>
              <p className="text-green-400 text-sm mt-3 flex items-center">
                Up +23.8% from last month
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-xl rounded-3xl border border-emerald-400/30 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Active Users
              </h3>
              <p className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                892
              </p>
              <p className="text-green-400 text-sm mt-3">+127 new this week</p>
            </div>

            {/* Chart */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
              <h3 className="text-xl font-bold mb-6 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Sales Overview
              </h3>
              <div className="h-64 sm:h-80">
                <LineChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
