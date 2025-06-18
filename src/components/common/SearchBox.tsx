import { FC, useState } from "react";

import { Button, Input } from "@/components/ui";
import { IoMdSearch } from "@/assets/icons/icons";
import { Search } from "lucide-react";

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
    // <div className="flex justify-center">
    //   <form
    //     onSubmit={handleSearch}
    //     className="flex gap-2 w-full px-0 sm:px-10 md:px-0 md:w-[350px] lg:w-[600px] xl:w-[700px] items-center"
    //   >
    //     <Input
    //       placeholder={placeholder}
    //       className="border-2 bg-transparent border-app-border rounded-full"
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //     />
    //     <button className="hover:bg-app-secondary bg-transparent border-2 border-app-border text-white rounded-full p-2 text-xl">
    //       <IoMdSearch />
    //     </button>
    //   </form>
    // </div>
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
