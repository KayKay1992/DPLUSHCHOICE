const AboutUs = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-6">
          About Us
        </h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-6 sm:p-10 text-gray-700 leading-relaxed space-y-4">
          <p>
            D&apos; Plush Choice is dedicated to helping you feel confident and
            refreshed through carefully selected beauty essentials and
            attractive scents.
          </p>
          <p>
            We focus on quality, authenticity, and customer satisfaction—making
            it easy to discover products you&apos;ll love.
          </p>
          <p>Thanks for shopping with us.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
