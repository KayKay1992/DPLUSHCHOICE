

const Users = () => {
  return (
    <div className="p-5 w-[70vw]">
        <div className="flex items-center justify-between m-[30px]">
            <h1 className="text-3xl font-semibold m-5">All Users</h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add New Product</button>
        </div>
        <div className="m-[30px]">
            {/* Product list or table would go here */}
            <DataGrid getRowId={(row) => row._id} rows={data} columns={columns} checkboxSelection/>
        </div>
    </div>
  )
}

export default Users