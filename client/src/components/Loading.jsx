const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Generating your quote...
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          AI is crafting something inspiring
        </p>
      </div>
    </div>
  );
};

export default Loading;