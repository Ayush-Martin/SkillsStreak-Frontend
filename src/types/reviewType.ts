export interface IReply {
  userId: { _id: string; username: string; profileImage: string };
  content: string;
  entityId: string;
  _id: string;
}

export interface IReview {
  _id: string;
  courseId: string;
  rating: number;
  content: string;
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  replies?: IReply[];
}
