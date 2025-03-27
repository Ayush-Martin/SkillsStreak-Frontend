import { FC } from "react";
import { MdOutlineRefresh } from "@/assets/icons";

interface IRefreshDataProps {
  refreshHandler: () => void;
}

const RefreshData: FC<IRefreshDataProps> = ({ refreshHandler }) => {
  return (
    <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
      <MdOutlineRefresh />
    </button>
  );
};

export default RefreshData;
