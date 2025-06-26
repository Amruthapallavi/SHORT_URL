import { Link } from "react-router-dom";
import { LinkIcon } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#494E6B] via-[#3d4159] to-[#2a2d42] text-white flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-xl sm:max-w-2xl">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-6">
          <div className="p-3 bg-gradient-to-br from-[#98878F] to-[#847379] rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <LinkIcon className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-extrabold bg-gradient-to-r from-[#98878F] to-[#b8a8af] bg-clip-text text-transparent select-none">
            ShortLink
          </span>
        </Link>

        <p className="text-[#b8a8af] mb-10 text-lg sm:text-xl leading-relaxed">
          Simplify your long links and track performance effortlessly with our
          stylish and secure URL shortener.
        </p>

        <div className="flex justify-center gap-8 mb-14">
          <Link
            to="/signup"
            className="bg-gradient-to-r from-[#494E6B] to-[#98878F] hover:from-[#3d4159] hover:to-[#847379] px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="border border-[#98878F] text-white hover:bg-[#98878F]/30 px-8 py-3 rounded-lg font-medium transition-shadow shadow-md hover:shadow-lg"
          >
            Log In
          </Link>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-[#98878F]/30 rounded-xl px-8 py-6 text-left text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-semibold mb-3 text-[#98878F]">
            About ShortLink
          </h2>
          <p className="text-[#c4c0c2]">
            ShortLink is a modern, fast, and secure URL shortening service built
            for creators, businesses, and everyday users. Generate short links,
            track clicks, and manage your links from a personalized dashboard.
            Whether you're sharing on social media, emails, or SMS — we've got
            your links covered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
