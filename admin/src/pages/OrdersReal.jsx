import { DataGrid } from "@mui/x-data-grid";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCheck,
  FaUndo,
} from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

// Deprecated: kept temporarily for compatibility.
// The maintained Orders page is now in Orders.jsx.
const OrdersReal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await userRequest.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (amount) => {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const getTotalItems = (products) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((sum, p) => sum + (Number(p?.quantity) || 0), 0);
  };

  const handleSetStatus = async (orderId, nextStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await userRequest.put(`/orders/${orderId}`, {
        status: nextStatus,
      });

      const updatedOrder = res.data?.updatedOrder;
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? updatedOrder || { ...o, status: nextStatus } : o
        )
      );

      toast.success(
        nextStatus === 1
          ? "Order marked as delivered"
          : "Order marked as pending"
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "_id",
        headerName: "Order ID",
        width: 220,
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
        width: 260,
        headerAlign: "center",
        renderCell: (params) => (
          <span className="text-cyan-300 font-semibold drop-shadow-sm">
            {params.value}
          </span>
        ),
      },
      {
        field: "items",
        headerName: "Items",
        width: 110,
        headerAlign: "center",
        valueGetter: (_, row) => getTotalItems(row?.products),
        renderCell: (params) => (
          <span className="text-gray-200 font-semibold drop-shadow-sm">
            {params.value}
          </span>
        ),
      },
      {
        field: "total",
        headerName: "Total",
        width: 170,
        headerAlign: "center",
        renderCell: (params) => (
          <span className="text-green-200 font-bold drop-shadow-sm">
            {formatPrice(params.value)}
          </span>
        ),
      },
      {
        field: "createdAt",
        headerName: "Date",
        width: 210,
        headerAlign: "center",
        renderCell: (params) => (
          <span className="text-gray-200 font-medium drop-shadow-sm">
            {formatDateTime(params.value)}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        headerAlign: "center",
        renderCell: (params) => {
          const normalized = Number(params.row.status);
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                normalized === 1
                  ? "bg-green-500/40 text-green-100 border-green-400/60"
                  : "bg-red-500/40 text-red-100 border-red-400/60"
              }`}
            >
              {normalized === 1 ? "Delivered" : "Pending"}
            </span>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        headerAlign: "center",
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const normalized = Number(params.row.status);
          const disabled = updatingOrderId === params.row._id;

          return (
            <div className="flex items-center justify-center">
              {normalized === 0 ? (
                <button
                  onClick={() => handleSetStatus(params.row._id, 1)}
                  disabled={disabled}
                  className={`bg-green-500/40 hover:bg-green-500/50 text-green-100 hover:text-white p-2 rounded-lg transition-all duration-200 border-2 border-green-400/50 hover:border-green-300 ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Mark delivered"
                >
                  <FaCheck className="text-sm" />
                </button>
              ) : (
                <button
                  onClick={() => handleSetStatus(params.row._id, 0)}
                  disabled={disabled}
                  className={`bg-yellow-500/40 hover:bg-yellow-500/50 text-yellow-100 hover:text-white p-2 rounded-lg transition-all duration-200 border-2 border-yellow-400/50 hover:border-yellow-300 ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Mark pending"
                >
                  <FaUndo className="text-sm" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [updatingOrderId]
  );

  const deliveredCount = orders.filter((o) => Number(o.status) === 1).length;
  const pendingCount = orders.filter((o) => Number(o.status) !== 1).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-pink-500/15 to-rose-500/10 border border-pink-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-semibold mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-white">{orders.length}</p>
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
                  {deliveredCount}
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
                <p className="text-3xl font-bold text-white">{pendingCount}</p>
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
                rows={orders}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                checkboxSelection
                disableSelectionOnClick
                loading={loading}
                sx={{
                  border: 0,
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "Inter, system-ui, sans-serif",
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
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersReal;
