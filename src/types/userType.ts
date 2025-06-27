export interface IProfile {
  username: string;
  email: string;
  profileImage: string;
  place: string;
  company: string;
  position: string;
  bio: string;
  socialLinks: {
    website: string;
    linkedin: string;
    github: string;
  };
}
