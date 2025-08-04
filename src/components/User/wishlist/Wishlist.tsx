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
    if (open) {
      fetchWishlist();
    }
  }, [open]);

  const deleteFromWishlist = (id: string) => {
    confirm("Are you shure you want to delete", () => {
      removeWishlist(id);
    });
  };

  return (
    <div className="sm:relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="mt-1 text-xl text-white sm:text-2xl hover:text-app-accent"
      >
        {open ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
      {open && (
        <div
          className="absolute  w-full  left-0 right-0  sm:left-auto max-h-[500px] backdrop-blur-md backdrop-saturate-150 bg-green-500/10 border-green-500/20 shadow-green-500/10
 rounded-md sm:w-[500px] top-14  px-7 py-5 "
          ref={dropdownRef}
        >
          <h1 className="text-2xl text-center text-white">Wishlist</h1>

          <div className="flex flex-col gap-2 overflow-y-auto h-[400px] mt-7 ">
            {wishlist.length > 0 ? (
              wishlist.map(({ _id, course }) => (
                <div
                  className="flex px-10 py-5 rounded bg-app-primary bg-opacity-60 full backdrop-blur-md backdrop-saturate-150"
                  key={_id}
                >
                  <div className="w-11/12 flex gap-7">
                    <img src={course.thumbnail} alt="" className="w-1/3" />
                    <div className="">
                      <h1 className="text-lg mb-2">{course.title}</h1>
                      <Button
                        variant={"v1"}
                        size={"sm"}
                        className="w-44"
                        onClick={() => handleEnroll(course._id)}
                      >
                        Enroll course for ₹
                        {course.price ? course.price.toString() : "free"}
                      </Button>
                    </div>
                  </div>
                  <button
                    className="w-1/12 text-2xl text-red-500"
                    onClick={() => deleteFromWishlist(_id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-white">
                No course added to wishlist
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
