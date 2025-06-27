import { FC, useState } from "react";

import { Search } from "lucide-react";
import { Input } from "../ui";

interface ISearchBoxProps {
  search: string;
  searchHandler: (search: string) => void;
  placeholder: string;
}

const SearchBox: FC<ISearchBoxProps> = ({
  search,
  placeholder,
  searchHandler,
}) => {
  const [input, setInput] = useState(search);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchHandler(input);
  };
  return (
    <div className={`flex justify-center`}>
      <form
        onSubmit={handleSearch}
        className="relative flex w-full max-w-2xl items-center"
      >
        <div className="relative w-full">
          <Input
            placeholder={placeholder}
            className="h-12 rounded-full border-2 border-gray-700 bg-gray-800/50 pl-12 pr-16 text-white placeholder:text-gray-400 focus:border-purple-500 focus:bg-gray-800 transition-all duration-300 backdrop-blur-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3 text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <Search className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
