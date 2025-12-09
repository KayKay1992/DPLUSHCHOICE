import { DataGrid } from "@mui/x-data-grid";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCheck,
} from "react-icons/fa";
const Orders = () => {
  const columns = [
    {
      field: "_id",
      headerName: "Order ID",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-blue-300 font-mono font-bold drop-shadow-sm">
          {params.value}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Customer Name",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-purple-200 font-semibold drop-shadow-sm">
          {params.value}
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-cyan-300 font-semibold drop-shadow-sm">
          {params.value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
              params.row.status === "1"
                ? "bg-green-500/40 text-green-100 border-green-400/60"
                : "bg-red-500/40 text-red-100 border-red-400/60"
            }`}
          >
            {params.row.status === "1" ? "Delivered" : "Pending"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center">
            {params.row.status === "0" && (
              <button className="bg-green-500/40 hover:bg-green-500/50 text-green-100 hover:text-white p-2 rounded-lg transition-all duration-200 border-2 border-green-400/50 hover:border-green-300">
                <FaCheck className="text-sm" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
  const data = [
    { _id: "o101", name: "John Doe", email: "john@example.com", status: "1" },
    { _id: "o102", name: "Jane Smith", email: "jane@example.com", status: "0" },
    { _id: "o103", name: "Bob Jones", email: "bob@example.com", status: "1" },
    {
      _id: "o104",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      status: "0",
    },
    { _id: "o105", name: "Mike Brown", email: "mike@example.com", status: "1" },
    {
      _id: "o106",
      name: "Emily Davis",
      email: "emily@example.com",
      status: "0",
    },
    {
      _id: "o107",
      name: "David Wilson",
      email: "david@example.com",
      status: "1",
    },
    {
      _id: "o108",
      name: "Olivia Johnson",
      email: "olivia@example.com",
      status: "0",
    },
  ];
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Orders
              </h1>
              <p className="text-gray-200 mt-3 text-base sm:text-lg font-medium">
                Manage customer orders and track deliveries
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-pink-500/15 to-rose-500/10 border border-pink-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-semibold mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-white">{data.length}</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-pink-500/30 to-rose-500/30 rounded-xl flex items-center justify-center border border-pink-400/30">
                <FaShoppingCart className="text-pink-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500/15 to-emerald-500/10 border border-green-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-semibold mb-1">
                  Delivered
                </p>
                <p className="text-3xl font-bold text-white">
                  {data.filter((order) => order.status === "1").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border border-green-400/30">
                <FaCheckCircle className="text-green-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-yellow-500/15 to-orange-500/10 border border-yellow-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-semibold mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-white">
                  {data.filter((order) => order.status === "0").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-xl flex items-center justify-center border border-yellow-400/30">
                <FaClock className="text-yellow-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500/15 to-cyan-500/10 border border-blue-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-semibold mb-1">
                  Processing
                </p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
                <FaTimesCircle className="text-blue-300 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/12 backdrop-blur-xl rounded-3xl border border-white/25 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-white/15">
            <h2 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Order Management
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            <div className="min-h-[400px] max-h-[calc(100vh-400px)] w-full overflow-auto rounded-xl">
              <DataGrid
                getRowId={(row) => row._id}
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                checkboxSelection
                disableSelectionOnClick
                sx={{
                  border: 0,
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "Inter, system-ui, sans-serif",

                  // Header — Solid, high-contrast colors
                  "& .MuiDataGrid-columnHeaders": {
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    borderBottom: "3px solid #ffffff",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "magenta",
                    textAlign: "center",
                    padding: "16px 12px",
                  },

                  // Column header text — Bold and clear
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 800,
                    color: "#ffffff",
                    fontSize: "13px",
                    backgroundColor: "#1e293b",
                    padding: "6px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#312e81",
                    },
                  },

                  // Rows — Solid backgrounds
                  "& .MuiDataGrid-row": {
                    backgroundColor: "#1e293b",
                    borderBottom: "1px solid #334155",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#312e81",
                      borderBottom: "1px solid #8b5cf6",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#0f172a",
                    },
                  },

                  // Cells — High contrast, clear text
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #334155",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:focus": {
                      outline: "2px solid #8b5cf6",
                      outlineOffset: "-2px",
                    },
                  },

                  // Footer — Clean and readable
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "#0f172a",
                    borderTop: "2px solid #8b5cf6",
                    color: "#ffffff",
                    fontWeight: 600,
                    padding: "16px",
                  },

                  // Checkbox — High contrast
                  "& .MuiCheckbox-root": {
                    color: "#ffffff",
                    "&.Mui-checked": {
                      color: "#a855f7",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                    },
                  },

                  // Pagination text — Clear and readable
                  "& .MuiTablePagination-root": {
                    color: "#ffffff",
                    fontWeight: 600,
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                      {
                        color: "#ffffff",
                        fontWeight: 600,
                      },
                    "& .MuiSelect-select": {
                      color: "#ffffff",
                      fontWeight: 600,
                    },
                  },

                  // Selection indicator
                  "& .MuiDataGrid-selectedRowCount": {
                    color: "#a855f7",
                    fontWeight: 700,
                  },

                  // Scrollbar — Clean and functional
                  "& .MuiDataGrid-virtualScroller": {
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: "10px",
                      height: "10px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "5px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "linear-gradient(135deg, #a855f7, #ec4899)",
                      borderRadius: "5px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #9333ea, #db2777)",
                      },
                    },
                  },

                  // Menu and icons
                  "& .MuiDataGrid-menuIcon, & .MuiDataGrid-sortIcon": {
                    color: "#ffffff",
                    opacity: 0.8,
                  },

                  // Loading overlay
                  "& .MuiDataGrid-overlay": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
