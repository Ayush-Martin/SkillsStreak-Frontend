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
      {/* Heart Icon */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="mt-1 text-xl sm:text-2xl text-white hover:text-app-accent transition-colors duration-200"
      >
        {open ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      {/* Wishlist Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute right-0 top-14 w-full sm:w-[420px] bg-[#0a0d17]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 max-h-[520px] overflow-y-auto
      transition-all duration-300 transform origin-top
      ${
        open
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      >
        <h2 className="text-lg text-center text-white font-semibold mb-3">
          Wishlist
        </h2>

        {wishlist.length > 0 ? (
          wishlist.map(({ _id, course }) => (
            <div
              key={_id}
              className="relative flex items-center p-3 bg-gradient-to-r from-[#1a1d2c]/80 to-[#1f2235]/80 rounded-xl border border-white/10 hover:shadow-lg transition-all duration-200 gap-3"
            >
              {/* Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-sm"
              />

              {/* Course Info */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium line-clamp-2">
                  {course.title}
                </h3>
                <Button
                  variant="v1"
                  size="sm"
                  className="mt-2 w-36 text-sm"
                  onClick={() => handleEnroll(course._id)}
                >
                  Enroll ₹{course.price ? course.price.toString() : "Free"}
                </Button>
              </div>

              {/* Delete Icon */}
              <span
                onClick={() => deleteFromWishlist(_id)}
                className="text-red-500 text-xl cursor-pointer hover:text-red-400 select-none"
              >
                <MdDelete />
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-white/50 text-sm py-20">
            No courses added to wishlist
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
