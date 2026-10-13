export interface BlogPost {
  title: string;
  url: string;
  brief: string;
  cover?: string;
  date: string;
}

const POSTS: BlogPost[] = [
  {
    title: "Implementing AES-256-GCM Encryption at Rest in Node.js",
    url: "https://blog-cjdevcom.hashnode.dev/implementing-aes-256-gcm-encryption-at-rest-in-nodejs",
    brief:
      "Learn how to implement AES-256-GCM encryption for data at rest in Node.js applications, covering key management, IV generation, and authenticated encryption patterns.",
    date: "2026-07-15",
  },
  {
    title: "Building a Robust Flutter Todo App: MVC Architecture and Offline-First Approach",
    url: "https://blog-cjdevcom.hashnode.dev/building-a-robust-flutter-todo-app",
    brief:
      "A comprehensive guide to building a production-ready Flutter todo application using MVC architecture with offline-first data persistence using Hive.",
    date: "2026-06-29",
  },
  {
    title: "Clean Architecture in Flutter: Why It Matters",
    url: "https://blog-cjdevcom.hashnode.dev/clean-architecture-in-flutter-why-it-matters",
    brief:
      "Explore the principles of Clean Architecture in Flutter applications and learn why it leads to more maintainable, testable, and scalable codebases.",
    date: "2026-07-05",
  },
];

export function getBlogPosts(): BlogPost[] {
  return POSTS;
}
