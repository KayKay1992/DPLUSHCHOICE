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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderIdQuery, setOrderIdQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultOrder, setSearchResultOrder] = useState(null);

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

  const isMongoObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(value);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = orderIdQuery.trim();

    setSearchResultOrder(null);
    if (!q) return;

    // If user typed a full ObjectId, try to fetch that exact order.
    if (isMongoObjectId(q)) {
      const localMatch = orders.find((o) => o?._id === q);
      if (localMatch) {
        setSearchResultOrder(localMatch);
        return;
      }

      setIsSearching(true);
      try {
        const res = await userRequest.get(`/orders/${q}`);
        setSearchResultOrder(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Order not found (check the Order ID)");
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleClearSearch = () => {
    setOrderIdQuery("");
    setSearchResultOrder(null);
  };

  const displayedOrders = useMemo(() => {
    if (searchResultOrder) return [searchResultOrder];

    const q = orderIdQuery.trim().toLowerCase();
    if (!q) return orders;

    // Partial ID search (filters already-loaded orders)
    return orders.filter((o) =>
      String(o?._id || "")
        .toLowerCase()
        .includes(q)
    );
  }, [orders, orderIdQuery, searchResultOrder]);

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

  const deliveredCount = displayedOrders.filter(
    (o) => Number(o.status) === 1
  ).length;
  const pendingCount = displayedOrders.filter(
    (o) => Number(o.status) !== 1
  ).length;

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

            <form
              onSubmit={handleSearchSubmit}
              className="w-full sm:w-auto flex flex-col sm:flex-row gap-3"
            >
              <input
                value={orderIdQuery}
                onChange={(e) => setOrderIdQuery(e.target.value)}
                placeholder="Search by Order ID"
                className="w-full sm:w-[320px] px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/60 outline-hidden focus:border-white/25"
              />
              <button
                type="submit"
                disabled={isSearching}
                className={`px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold transition-colors ${
                  isSearching ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 font-semibold transition-colors"
              >
                Clear
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-pink-500/15 to-rose-500/10 border border-pink-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-semibold mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-white">
                  {displayedOrders.length}
                </p>
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

          <div className="bg-linear-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-semibold mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-white">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500/30 to-amber-500/30 rounded-xl flex items-center justify-center border border-yellow-400/30">
                <FaClock className="text-yellow-300 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-red-500/15 to-rose-500/10 border border-red-400/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm font-semibold mb-1">
                  Cancelled
                </p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="w-12 h-12 bg-linear-to-br from-red-500/30 to-rose-500/30 rounded-xl flex items-center justify-center border border-red-400/30">
                <FaTimesCircle className="text-red-300 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="h-[520px] w-full">
            <DataGrid
              rows={displayedOrders}
              columns={columns}
              loading={loading || isSearching}
              getRowId={(row) => row._id}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              sx={{
                border: 0,
                color: "rgba(255,255,255,0.92)",
                backgroundColor: "rgba(0,0,0,0.22)",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgba(0,0,0,0.35)",
                  color: "rgba(255,255,255,0.92)",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "rgba(0,0,0,0.45)",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.95)",
                },
                "& .MuiDataGrid-cell": {
                  borderColor: "rgba(255,255,255,0.10)",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "rgba(0,0,0,0.18)",
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: "rgba(0,0,0,0.12)",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderColor: "rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(0,0,0,0.28)",
                },
                "& .MuiTablePagination-root": {
                  color: "rgba(255,255,255,0.88)",
                },
                "& .MuiDataGrid-iconSeparator": {
                  color: "rgba(255,255,255,0.18)",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
