export interface ICourse {
  _id: string;
  title: string;
  price: number;
  skillsCovered: Array<string>;
  requirements: Array<string>;
  difficulty: "beginner" | "intermediate" | "advance";
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
