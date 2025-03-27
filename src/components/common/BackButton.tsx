import { useNavigate } from "react-router-dom";

import { IoMdArrowBack } from "@/assets/icons";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 py-2 my-3 text-xl border-b-4 border-b-violet-600"
    >
      <IoMdArrowBack />
      <p className="text-sm font-boldonse ">back</p>
    </button>
  );
};

export default BackButton;
