import { toast } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa";

const useConfirm = () => {
  function confirmDelete(message: string, handler: () => void) {
    toast(
      ({ closeToast }) => (
        <div className="relative w-full max-w-md mx-auto rounded-2xl backdrop-blur-xl bg-[#0a0d17]/80 border border-purple-500/20 shadow-2xl p-6 text-white animate-fadeIn">
          {/* Icon & Message */}
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-400 text-xl mt-1 shrink-0" />
            <p className="text-sm leading-relaxed text-purple-100">{message}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                handler();
                closeToast();
              }}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-tr from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-red-500/30 transition-all"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600/50 shadow-inner transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        position: "top-center",
        theme: "dark",
      }
    );
  }

  return confirmDelete;
};

export default useConfirm;
