import { FaHeart, FaGithub } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/20 dark:border-gray-700/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <HiSparkles className="text-white text-sm" />
              </div>
              <span className="font-bold text-gray-800 dark:text-white">
                AI Quote Generator
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Generate unique, inspiring quotes powered by Google Gemini AI.
              Choose your category, language, and length to create the perfect
              quote.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#generate"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  Generate Quotes
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Motivation", "Success", "Life", "Happiness"].map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 flex items-center gap-1">
            &copy; {currentYear} AI Quote Generator. Made with{" "}
            <FaHeart className="text-red-400 text-xs" /> and Gemini AI.
          </p>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaGithub className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;