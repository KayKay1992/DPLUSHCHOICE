import { Typewriter } from 'react-simple-typewriter';

export default function Announcement() {
  return (
    <div className="w-full py-3 px-4 bg-linear-to-r from-fuchsia-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg rounded-b-xl">
      <span className="mr-3 text-white text-2xl animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6h13M9 6l-2 2m2-2l2 2" />
        </svg>
      </span>
      <span className="text-white text-lg font-semibold tracking-wide">
        <Typewriter
          words={[
            "Welcome to D' Plush Choice!",
            "Luxury for every level.",
            "Enjoy exclusive offers and new arrivals!",
          ]}
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={60}
          deleteSpeed={40}
          delaySpeed={2000}
        />
      </span>
    </div>
  );
}