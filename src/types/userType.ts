export interface IUserProfileExperience {
  id: string;
  position: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface IUserProfileSocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
  website: string;
}

export interface IUserProfile {
  profileImage?: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  company?: string;
  position?: string;
  education?: string;
  skills: string[];
  experiences: IUserProfileExperience[];
  socialLinks: IUserProfileSocialLinks;
}
