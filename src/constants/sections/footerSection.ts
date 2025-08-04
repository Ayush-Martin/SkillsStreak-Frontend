import { FaGithub, FaLinkedin } from "@/assets/icons";

export const FOOTER_SECTION = {
  links: [
    {
      title: "Home",
      to: "/",
    },
    {
      title: "Courses",
      to: "/courses",
    },
    {
      title: "Dashboard",
      to: "/user",
    },
    {
      title: "Profile",
      to: "/user/profile",
    },
    {
      title: "Enrolled Courses",
      to: "/user/enrolledCourses",
    },
    {
      title: "Certificates",
      to: "/user/certificates",
    },
    {
      title: "Transactions",
      to: "/user/transactions",
    },
    {
      title: "Trainer Dashboard",
      to: "/trainer",
    },
  ],

  contact: {
    email: "ayushmartin06@gmail.com",
  },

  socialMedia: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ayush-martin-sabu-440438304/",
      icon: FaLinkedin,
    },
    {
      name: "GitHub",
      url: "https://github.com/Ayush-Martin",
      icon: FaGithub,
    },
  ],

  about:
    "SkillStreak is an online platform offering expert-led courses to help learners excel in their careers. With interactive features like AI chat, live streams, and trainer support, SkillStreak is designed to make learning accessible and engaging.",

  copyright: "© 2025 SkillStreak. All rights reserved.",
};
