import { useClickOutside } from "@/hooks";
import { IWishList } from "@/types/wishlistType";
import { FC, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdDelete } from "@/assets/icons";
import { Button } from "@/components";
import { useConfirm } from "@/hooks";

interface IWishListProps {
  wishlist: Array<IWishList>;
  fetchWishlist: () => void;
  removeWishlist: (wishlistId: string) => void;
  handleEnroll: (courseId: string) => void;
}

const Wishlist: FC<IWishListProps> = ({
  fetchWishlist,
  removeWishlist,
  wishlist,
  handleEnroll,
}) => {
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  useEffect(() => {
    if (open) fetchWishlist();
  }, [open]);

  const deleteFromWishlist = (id: string) => {
    confirm("Are you sure you want to delete?", () => {
      removeWishlist(id);
    });
  };

  return (
    <div className="sm:relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="mt-1 text-xl text-white sm:text-2xl hover:text-app-accent transition-colors duration-200"
      >
        {open ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-14 w-full sm:w-[500px] bg-green-500/50 backdrop-blur-md rounded-lg shadow-lg p-6 flex flex-col gap-5 max-h-[500px] overflow-y-auto"
        >
          <h2 className="text-xl text-center text-white font-semibold mb-4">
            Wishlist
          </h2>

          {wishlist.length > 0 ? (
            wishlist.map(({ _id, course }) => (
              <div
                key={_id}
                className="flex flex-col sm:flex-row justify-between items-start p-5 bg-app-primary bg-opacity-90 rounded-xl hover:bg-opacity-95 transition duration-200 gap-4"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full sm:w-1/3 h-24 sm:h-28 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex flex-col justify-between flex-1">
                  <h3 className="text-white text-lg font-medium mb-2">
                    {course.title}
                  </h3>
                  <Button
                    variant="v1"
                    size="sm"
                    className="w-44 mt-2 sm:mt-auto"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll for ₹
                    {course.price ? course.price.toString() : "Free"}
                  </Button>
                </div>
                <span
                  onClick={() => deleteFromWishlist(_id)}
                  className="text-red-500 text-2xl cursor-pointer hover:text-red-400 select-none mt-2 sm:mt-0"
                >
                  <MdDelete />
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-white/70 text-base py-20">
              No courses added to wishlist
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
