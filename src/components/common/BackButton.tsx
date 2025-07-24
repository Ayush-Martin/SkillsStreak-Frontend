import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "@/assets/icons";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors duration-200 shadow-md"
    >
      <IoMdArrowBack className="w-5 h-5 text-violet-500" />
      <span className="text-sm font-semibold tracking-wide uppercase">
        Back
      </span>
    </button>
  );
};

export default BackButton;
