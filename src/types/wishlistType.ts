export interface IWishList {
  _id: string;
  course: {
    _id: string;
    title: string;
    price: number;
    thumbnail: string;
  };
}
