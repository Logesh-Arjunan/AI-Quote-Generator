import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const languages = [
  { name: "English",  flag: "🇬🇧" },
  { name: "Tamil",    flag: "🇮🇳" },
  { name: "Hindi",    flag: "🇮🇳" },
  { name: "Spanish",  flag: "🇪🇸" },
  { name: "French",   flag: "🇫🇷" },
  { name: "German",   flag: "🇩🇪" },
];

const LanguageSelector = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang) => {
    onChange(lang);
    setIsOpen(false);
  };

  const selectedLang = languages.find((l) => l.name === selected);

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Language
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">{selectedLang ? selectedLang.flag : "🌐"}</span>
          <span className={selected ? "text-gray-800 dark:text-white" : "text-gray-400"}>
            {selected || "Select language"}
          </span>
        </span>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
          <div className="py-1">
            {languages.map(({ name, flag }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3 ${
                  selected === name
                    ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/10"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-base">{flag}</span>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;