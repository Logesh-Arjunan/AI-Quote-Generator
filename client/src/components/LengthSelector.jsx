import { useState } from "react";
import { FaChevronDown, FaAlignLeft } from "react-icons/fa";

const lengths = ["Short", "Medium", "Long"];

const lengthDescriptions = {
  Short: "1-2 sentences",
  Medium: "2-3 sentences",
  Long: "4-6 sentences",
};

const LengthSelector = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (length) => {
    onChange(length);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Quote Length
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
      >
        <span className="flex items-center gap-2">
          <FaAlignLeft className="text-purple-500 text-sm" />
          <span className={selected ? "text-gray-800 dark:text-white" : "text-gray-400"}>
            {selected || "Select length"}
          </span>
        </span>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
          <div className="py-1">
            {lengths.map((length) => (
              <button
                key={length}
                type="button"
                onClick={() => handleSelect(length)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-between ${
                  selected === length
                    ? "text-purple-600 dark:text-purple-400 font-semibold bg-purple-50/50 dark:bg-purple-900/10"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaAlignLeft className="text-xs" />
                  {length}
                </span>
                <span className="text-xs text-gray-400">
                  {lengthDescriptions[length]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LengthSelector;