// ─── Portfolio Data ────────────────────────────────────────────────
// Edit this file to update your personal info, jobs, projects, etc.

export const PERSONAL = {
  name: "Joel CODJA(K-O-J-A)",
  initials: "AC",
  company: "Humanforce",
  email: "gide749@gmail.com",
  github: "https://github.com/cjdotdev",
  githubUsername: "cjdotdev",
  linkedin: "https://www.linkedin.com/in/joel-codja-4356a2361/",
  twitter: "https://x.com/Gide749Gide",
  hashnode: "https://blog-cjdevcom.hashnode.dev",
};

export const SKILLS = [
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "Tailwind", icon: "https://cdn.simpleicons.org/tailwindcss" },
];

export interface Tag {
  name: string;
  icon?: string;
}

export interface Project {
  id: string;
  tags: Tag[];
  github?: string;
  demo?: string;
  preview: "jobportal" | "kanban" | "crypto" | "desktop" | "auction" | "arduino" | "itaja";
}

export const PROJECTS: Project[] = [
  {
    id: "itaja",
    tags: [
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "REST APIs" },
      { name: "Fintech" },
    ],
    demo: "https://getitaja.com",
    preview: "itaja",
  },
  {
    id: "auction",
    tags: [
      { name: "Next JS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss" },
         { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    ],
    github: "https://github.com/alpha1207vj/CHECKERCONTRASTOWCAG",
    demo: "https://codja.vercel.app",
    preview: "auction",
  },
  {
  id: "arduino",
  tags: [
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss" },
  ],
  github: "https://github.com/alpha1207vj/MYPORTFOLIO",
 
  preview: "arduino",
},
];

export interface Experience {
  id: string;
  company: string;
  site?: string;
  start: string;
  end?: string;
  current?: boolean;
}

export const EXPERIENCE: Experience[] = [
  {
    id: "lixali",
    company: "Lixali Studio",
    site: "https://lixalistudio.tech",
    start: "Apr 2026",
    current: true,
  },
];

export interface Post {
  title: string;
  tag: string;
  date: string;
  href: string;
}

export const POSTS: Post[] = [];