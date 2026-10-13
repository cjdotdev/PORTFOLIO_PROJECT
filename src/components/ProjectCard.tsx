import { useState } from "react";
import type { Project } from "../data";
import TechPill from "./TechPill";
import PREVIEWS from "./ProjectPreviews";
import type { Dict } from "../i18n";

function Modal({ project, onClose, t }: { project: Project; onClose: () => void; t: Dict }) {
  const Preview = PREVIEWS[project.preview as keyof typeof PREVIEWS];
  const copy = t.projects.items[project.id as keyof typeof t.projects.items];
  
  return (
    <div
      className="project-modal fixed inset-0 z-[60] flex items-center justify-center custom-scroll"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className=" custom-scroll relative w-[90%] max-w-lg rounded-2xl p-6"
        style={{ background: "rgb(var(--color-surface))", border: "1px solid rgba(217,119,87,0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
          {Preview ? <Preview /> : (
            <div className="flex items-center justify-center w-full h-full bg-gray-700">
              <span className="text-xs text-muted">{t.projects.previewMissing}</span>
            </div>
          )}
        </div>

        <h3 className="mb-2 font-serif text-2xl">{copy.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">{copy.longDesc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((t) => (
            <TechPill key={t.name} tag={t} />
          ))}
        </div>
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:scale-105"
              style={{
                background: "rgb(var(--color-github))",
                color: "white",
                border: "1px solid rgb(var(--color-line) / 0.1)"
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"/>
              </svg>
              {t.projects.github}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:scale-105"
              style={{
                background: "#D97757",
                color: "#ffffff",
                border: "1px solid rgb(var(--color-line) / 0.06)"
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              {t.projects.liveDemo}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({ project, t }: { project: Project; t: Dict }) {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const Preview = PREVIEWS[project.preview as keyof typeof PREVIEWS];
  const copy = t.projects.items[project.id as keyof typeof t.projects.items];

  return (
    <>
      <div
        className="flex flex-col transition-all duration-300 cursor-pointer project-card rounded-2xl"
        style={{ 
          background: "rgb(var(--color-surface))",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)"
        }}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Preview with padding, rounded corners, and not touching borders */}
        <div className="p-3 pb-0">
          <div className="relative w-full h-40 overflow-hidden bg-gray-800 rounded-xl group">
            <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
              {Preview ? <Preview /> : (
                <div className="flex items-center justify-center w-full h-full bg-gray-700">
                  <span className="text-xs text-muted">{t.projects.noPreview}</span>
                </div>
              )}
            </div>
            
            
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-medium mb-1.5" style={{ color: "rgb(var(--color-ink) / 0.92)" }}>
            {copy.title}
          </h3>
          <p className="flex-1 mb-3 text-sm leading-relaxed text-muted">{copy.desc}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 3).map((t) => (
              <TechPill key={t.name} tag={t} />
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] text-muted px-1.5 py-0.5 rounded-full bg-ink/5">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
          
          {/* Buttons for GitHub and Demo */}
          <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgb(var(--color-github))",
                  color: "white",
                  border: "1px solid rgb(var(--color-line) / 0.1)"
                }}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"/>
                </svg>
                {t.projects.code}
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: "#D97757",
                  color: "#ffffff",
                  border: "1px solid rgb(var(--color-line) / 0.06)"
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                {t.projects.demo}
              </a>
            )}
          </div>
        </div>
      </div>

      {open && <Modal project={project} onClose={() => setOpen(false)} t={t} />}
    </>
  );
}