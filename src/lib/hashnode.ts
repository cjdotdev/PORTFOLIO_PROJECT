export interface BlogPost {
  title: string;
  url: string;
  brief: string;
  date: string;
}

const POSTS: BlogPost[] = [
  {
    title: "Implementing AES-256-GCM Encryption at Rest in Node.js",
    url: "https://blog-cjdevcom.hashnode.dev/implementing-aes-256-gcm-encryption-at-rest-in-nodejs",
    brief:
      "Key management, IV generation and authenticated encryption for data at rest in a Node.js service.",
    date: "2026-07-15",
  },
  {
    title: "Clean Architecture in Flutter: Why It Matters",
    url: "https://blog-cjdevcom.hashnode.dev/clean-architecture-in-flutter-why-it-matters",
    brief:
      "The principles of Clean Architecture in Flutter, and why they make an app easier to test and change.",
    date: "2026-07-05",
  },
  {
    title: "Building a Robust Flutter Todo App: MVC Architecture and Offline-First Approach",
    url: "https://blog-cjdevcom.hashnode.dev/building-a-robust-flutter-todo-app",
    brief: "An MVC Flutter app that keeps working offline, with its data persisted in Hive.",
    date: "2026-06-29",
  },
];

/** Newest first. Posts are written in English, whatever the page's language. */
export function getBlogPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}
