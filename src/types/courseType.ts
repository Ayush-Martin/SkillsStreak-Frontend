export type ICourseDifficulty = "beginner" | "intermediate" | "advance";

export interface ICourse {
  _id: string;
  title: string;
  price: number;
  skillsCovered: Array<string>;
  requirements: Array<string>;
  difficulty: ICourseDifficulty;
  thumbnail: string;
  description: string;
  categoryId: string;
}

export interface ModuleType {
  _id: string;
  title: string;
  lessons: Array<{
    _id: string;
    path: string;
    type: "pdf" | "video";
    description: string;
    title: string;
  }>;
}

export interface ICourseDetails {
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
}

