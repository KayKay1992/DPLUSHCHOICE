import Product from "./Product";

const Products = () => {
  return (
    <section className="py-16 px-4 bg-linear-to-b from-pink-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-4">
            Our Products
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Explore our exclusive collection of luxury products designed to
            elevate your lifestyle.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
        </div>
      </div>
    </section>
  );
};

export default Products;
