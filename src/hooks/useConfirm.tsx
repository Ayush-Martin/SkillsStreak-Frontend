import { toast } from "react-toastify";

export const useConfirm = () => {
  function confirmDelete(message: string, handler: () => void) {
    toast(
      ({ closeToast }) => (
        <div className="text-white">
          <p>{message}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                handler();
                closeToast();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
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
        position: "top-center",
        theme: "dark", // ✅ Enable dark theme
      }
    );
  }

  return confirmDelete;
};
