export type ICourseDifficulty = "beginner" | "intermediate" | "advance";
export type IPrice = "free" | "paid";
export type ISort =
  | "popularity"
  | "priceLowToHigh"
  | "priceHighToLow"
  | "aA-zZ"
  | "zZ-aA";

// export interface ICourse {
//   _id: string;
//   title: string;
//   price: number;
//   skillsCovered: Array<string>;
//   requirements: Array<string>;
//   difficulty: ICourseDifficulty;
//   thumbnail: string;
//   description: string;
//   categoryId: string;
// }

export interface IUserCourseData {
  _id: string;
  _trainerId: string;
  title: string;
  thumbnail: string;
  category: {
    _id: string;
    categoryName: string;
  };
  isListed: boolean;
  price: number;
  difficulty: "beginner" | "intermediate" | "advance";
  moduleCount: number;
  noOfEnrolled: number;
  averageRating: number;
}

export interface IUserCourseCardData {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  category: string;
  noOfEnrolled: number;
  noOfModules: number;
  averageRating: number;
}

export interface ITrainerLesson {
  _id: string;
  path: string;
  type: "pdf" | "video";
  description: string;
  title: string;
}

export interface ITrainerModule {
  _id: string;
  title: string;
  lessons: Array<ITrainerLesson>;
}

export interface IUserCourseDetails {
  _id: string;
  title: string;
  price: number;
  skillsCovered: string[];
  requirements: string[];
  difficulty: string;
  thumbnail: string;
  description: string;
  trainer: {
    _id: string;
    username: string;
    profileImage: string;
    about: string;
  };
  modules: Array<{
    _id: string;
    title: string;
    lessons: Array<{
      _id: string;
      title: string;
      type: "video" | "pdf";
    }>;
  }>;
  category: {
    _id: string;
    categoryName: string;
  };
  noOfEnrolled: number;
}

// export interface ILiveSession {
//   _id: string;
//   title: string;
//   thumbnail: string;
//   description: string;
//   isLive: string;
//   recordedSrc: string;
//   liveSrc: string;
//   isPublic: string;
//   courseId: string;
//   roomId: string;
// }

export interface ITrainerAssignment {
  _id: string;
  title: string;
  description: string;
  task: string;
}

export interface IAssignmentSubmission extends ITrainerAssignment {
  status: "pending" | "completed" | "verified" | "redo";
  type?: "pdf" | "text" | "image";
  path?: string;
  content?: string;
  assignmentSubmissionId?: string;
}

export interface IEnrolledCourseAssignmentSubmission
  extends IAssignmentSubmission {
  user: { _id: string; email: string };
  course: { _id: string; title: string };
}

export interface ILiveSession {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "live";
}

export interface IViewLiveSession extends ILiveSession {
  liveSrc?: string;
  recordedSrc?: string;
}

export interface ICourseRecordedSession {
  title: string;
  trainerId: string;
  modules: Array<{
    _id: string;
    title: string;
    lessons: Array<{
      _id: string;
      title: string;
      type: "video" | "pdf";
    }>;
  }>;
}

export interface IReply {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  content: string;
}

export interface IDiscussion {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  content: string;
}

export interface IAdminCourseDetail {
  _id: string;
  title: string;
  price: number;
  skillsCovered: string[];
  requirements: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  description: string;
  isListed: boolean;
  status: "pending" | "approved" | "rejected";
  modules: {
    _id: string;
    title: string;
    lessons: {
      _id: string;
      title: string;
      type: "video" | "pdf";
      path: string;
    }[];
  }[];
  liveSessions: {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    status: "live" | "upcoming" | "completed";
    liveSrc: string;
    recordedSrc: string;
  }[];
  assignments: {
    _id: string;
    title: string;
    description: string;
    task: string;
  }[];
  category: {
    _id: string;
    categoryName: string;
  };
  trainer: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
  };
}

export type ITop5Courses = Array<{
  title: string;
  enrolledCount: number;
  _id: string;
}>;
