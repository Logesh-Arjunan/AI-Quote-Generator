import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const categories = [
  "Motivation",
  "Success",
  "Education",
  "Friendship",
  "Leadership",
  "Business",
  "Life",
  "Happiness",
  "Sports",
  "Technology",
  "Creativity",
  "Discipline",
  "Self Confidence",
  "Entrepreneurship",
];

const CategoryDropdown = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Category
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
      >
        <span className={selected ? "text-gray-800 dark:text-white" : "text-gray-400"}>
          {selected || "Select a category"}
        </span>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelect(category)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                  selected === category
                    ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/10"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;