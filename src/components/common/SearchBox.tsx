import { FC, useState } from "react";

import { Button, Input } from "@/components/ui";
import { IoMdSearch } from "@/assets/icons/icons";

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
    <div className="flex justify-center">
      <form
        onSubmit={handleSearch}
        className="flex gap-2 w-full px-0 sm:px-10 md:px-0 md:w-[350px] lg:w-[600px] xl:w-[700px] items-center"
      >
        <Input
          placeholder={placeholder}
          className="border-2 bg-transparent border-app-border rounded-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="hover:bg-app-secondary bg-transparent border-2 border-app-border text-white rounded-full p-2 text-xl">
          <IoMdSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
