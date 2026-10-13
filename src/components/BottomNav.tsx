import { useEffect, useState } from "react";
import type { Dict } from "../i18n";

const NAV_ITEMS = [
  {
    id: "home",
    href: "#home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  
  {
    id: "github",
    href: "https://github.com/cjdotdev",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
  id: "linkedin",
  href: "https://www.linkedin.com/in/joel-codja-4356a2361/", // replace with your actual LinkedIn URL
  external: true,
  icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
},
  {
    id: "twitter",
    href: "https://x.com/Gide749Gide",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

const SECTION_IDS = ["home", "projects", "github", "blog", "contact"];

export default function BottomNav({ t }: { t: Dict }) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Call once to set initial active state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer */}
     
      
      <nav
        className="bottom-nav fixed bottom-0 left-0 right-0 z-50 w-full md:w-auto md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-full"
        style={{
          background: "rgb(var(--color-surface) / 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.12)",
          borderTop: "1px solid rgb(var(--color-line) / 0.08)",
        }}
      >
        <div  className="flex items-center justify-around w-full px-2 py-2 sm:justify-center sm:gap-6 md:gap-4 md:px-6 md:py-3 md:rounded-full">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`
                md:hover:-translate-y-0.5 hover:text-accent
                relative flex flex-col items-center gap-0.5 font-mono no-underline transition-all duration-200
                hover:opacity-100 min-w-[44px] sm:min-w-0 sm:px-3 py-1 rounded-lg
                ${active === item.id ? "text-ink" : "text-ink/60"}
              `}
              style={{
                opacity: active === item.id ? 1 : 0.75,
              }}
            >
              {item.icon}
              <span className="text-[10px] sm:text-xs capitalize">
                {t.nav[item.id as keyof typeof t.nav]}
              </span>
              {active === item.id && (
                <span className="absolute hidden w-1 h-1 -translate-x-1/2 bg-ink rounded-full -bottom-1 left-1/2 sm:block" />
              )}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}