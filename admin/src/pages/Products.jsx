import { DataGrid } from "@mui/x-data-grid";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";
import getImgUrl from "../utils/getImgUrl";

const Products = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await userRequest.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [location]);

  const handleDelete = async (id) => {
    try {
      await userRequest.delete(`/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product!");
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 80,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-blue-300 font-mono font-bold drop-shadow-sm">
          {params.value}
        </span>
      ),
    },
    {
      field: "product",
      headerName: "Product",
      width: 280,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center py-2">
            <img
              src={`${getImgUrl(params.row.img)}${params.row.img && !params.row.img.startsWith("http") ? "" : "?t=" + Date.now()}`}
              alt=""
              className="h-12 w-12 rounded-xl object-cover mr-3 border-2 border-white/40"
            />
            <div className="text-center">
              <div className="font-bold text-purple-200 text-sm leading-tight drop-shadow-sm">
                {params.row.title}
              </div>
              <div className="text-xs text-gray-300 truncate max-w-32 leading-tight">
                {params.row.desc}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "categories",
      headerName: "Category",
      width: 140,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-cyan-300 font-semibold drop-shadow-sm">
          {Array.isArray(params.value) ? params.value.join(", ") : params.value}
        </span>
      ),
    },
    {
      field: "originalPrice",
      headerName: "Original Price",
      width: 130,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-orange-300 font-bold drop-shadow-sm">
          ₦{params.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => (
        <span className="text-green-200 font-bold drop-shadow-sm">
          ₦{params.value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
            params.value > 50
              ? "bg-green-500/40 text-green-100 border-green-400/60"
              : params.value > 20
              ? "bg-yellow-500/40 text-yellow-100 border-yellow-400/60"
              : "bg-red-500/40 text-red-100 border-red-400/60"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "edit",
      headerName: "Actions",
      width: 120,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center space-x-2">
            <Link to={"/product/" + params.row._id}>
              <button className="bg-blue-500/40 hover:bg-blue-500/50 text-blue-100 hover:text-white p-2 rounded-lg transition-all duration-200 border-2 border-blue-400/50 hover:border-blue-300">
                <FaEdit className="text-sm" />
              </button>
            </Link>
            <button
              onClick={() => handleDelete(params.row._id)}
              className="bg-red-500/40 hover:bg-red-500/50 text-red-100 hover:text-white p-2 rounded-lg transition-all duration-200 border-2 border-red-400/50 hover:border-red-300"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="min-h-full bg-linear-to-br from-gray-950 via-purple-900/10 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-gray-300 mt-3 text-base sm:text-lg">
                Manage your product inventory and catalog
              </p>
            </div>

            <Link to="/new-product">
              <button className="group relative overflow-hidden bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center space-x-2">
                  <FaPlus className="text-sm" />
                  <span>Add New Product</span>
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* TOTAL PRODUCTS */}
          <div className="bg-linear-to-br from-pink-500/10 to-rose-500/5 border border-pink-400/30 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-100">
                  {products.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <span className="text-pink-400 text-xl">📦</span>
              </div>
            </div>
          </div>

          {/* TOTAL STOCK */}
          <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/5 border border-blue-400/30 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">In Stock</p>
                <p className="text-3xl font-bold text-gray-100">
                  {products.reduce((sum, i) => sum + i.stock, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-blue-400 text-xl">📊</span>
              </div>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-400/30 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-gray-100">
                  {new Set(products.flatMap((i) => i.categories || [])).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span className="text-emerald-400 text-xl">🏷️</span>
              </div>
            </div>
          </div>

          {/* REVENUE */}
          <div className="bg-linear-to-br from-purple-500/10 to-pink-500/5 border border-purple-400/30 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-gray-100">
                  ₦
                  {products
                    .reduce(
                      (sum, i) => sum + (i.discountPrice || 0) * (i.stock || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-purple-400 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE — CRISP AND CLEAR */}
        <div className="bg-slate-900 rounded-3xl border-2 border-purple-500/60 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b-2 border-purple-400/50 bg-linear-to-r from-purple-800 to-pink-700">
            <h2 className="text-3xl font-black text-white drop-shadow-lg">
              Product Inventory
            </h2>
            <p className="text-purple-100 text-sm mt-2 font-medium">
              All products • Real-time stock • Quick actions
            </p>
          </div>

          {/* DataGrid Container */}
          <div className="p-6 lg:p-8">
            <div className="min-h-[500px] w-full overflow-auto rounded-2xl bg-slate-800 border-2 border-purple-500/40">
              <DataGrid
                getRowId={(row) => row._id}
                rows={products}
                columns={columns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
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
                      backgroundColor: "#312e81",
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
                      background: "#0f172a",
                      borderRadius: "5px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "linear-gradient(135deg, #a855f7, #ec4899)",
                      borderRadius: "5px",
                      border: "1px solid #334155",
                      "&:hover": {
                        background: "linear-gradient(135deg, #9333ea, #db2777)",
                      },
                    },
                  },

                  // Menu and icons
                  "& .MuiDataGrid-menuIcon, & .MuiDataGrid-sortIcon": {
                    color: "#ffffff",
                  },

                  // Loading overlay
                  "& .MuiDataGrid-overlay": {
                    backgroundColor: "#0f172a",
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

export default Products;
