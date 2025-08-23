import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "@/assets/icons";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group inline-flex items-center gap-2 px-5 py-2.5 
                 rounded-full bg-[#0f111a]/70 backdrop-blur-sm 
                 text-zinc-200 hover:text-white 
                 transition-all duration-300 border border-white/10"
    >
      {/* Icon with slide effect */}
      <IoMdArrowBack className="w-5 h-5 text-violet-400 group-hover:-translate-x-1 transition-transform duration-300" />

      {/* Text with underline animation */}
      <span className="text-sm font-semibold tracking-wide uppercase relative">
        Back
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-violet-500 group-hover:w-full transition-all duration-300"></span>
      </span>
    </button>
  );
};

export default BackButton;
