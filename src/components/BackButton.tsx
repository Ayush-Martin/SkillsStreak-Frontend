import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 my-3 text-lg sm:text-2xl"
    >
      <IoMdArrowBack />
      <p>back</p>
    </button>
  );
};

export default BackButton;
