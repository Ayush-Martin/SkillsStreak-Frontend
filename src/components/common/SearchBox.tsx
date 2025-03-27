import { FC, useState } from "react";

import { Button, Input } from "@/components/ui";

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
  return (
    <div className="flex justify-center">
      <div className="flex gap-2 w-full px-0 sm:px-10 md:px-0 md:w-[350px] lg:w-[600px] xl:w-[700px]">
        <Input
          placeholder={placeholder}
          className="bg-app-border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant={"v3"}
          onClick={() => searchHandler(input)}
          className="hover:bg-app-secondary"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
