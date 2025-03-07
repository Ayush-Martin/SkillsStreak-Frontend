import { FC, useState } from "react";

import { IoCloseCircle } from "@/assets/icons";
import { Button, Input } from "@/components/ui";

interface IAddModuleParams {
  close: () => void;
  addModule: (module: string) => void;
}

const AddModule: FC<IAddModuleParams> = ({ close, addModule }) => {
  const [input, setInput] = useState("");

  return (
    <div className="flex justify-center">
      <div className="absolute top-0   bg-opacity-30 bg-white rounded-md backdrop-blur-sm  m-auto  w-[3 00px] h-[90px]">
        <div className="flex justify-end pt-3 pr-5">
          <button onClick={close} className="text-2xl text-app-accent">
            <IoCloseCircle />
          </button>
        </div>
        <div className="flex gap-2 mx-10 my-3">
          <Input
            placeholder="input"
            value={input}
            className="outline-none text-app-primary bg-app-neutral placeholder:text-app-highlight"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => addModule(input)}>Add</Button>
        </div>
      </div>
    </div>
  );
};

export default AddModule;
