import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { PERSONAL } from "../data";
import type { Dict } from "../i18n";

export default function ContactForm({ t }: { t: Dict }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.SubmitEvent) {
      e.preventDefault();
  setStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID!,
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY! }
      );
      setStatus("sent");
      formRef.current?.reset();
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <section id="contact" className="py-12 reveal" style={{ borderTop: "1px solid rgba(217,119,87,0.30)" }}>
      <h2 className="mb-2 font-serif text-2xl sm:text-3xl">{t.contact.title}</h2>
      <p className="mb-6 text-xs sm:text-sm text-ink/60">
        {t.contact.introBefore}{" "}
        <a href={`mailto:${PERSONAL.email}`} className="text-accent hover:underline">
          {PERSONAL.email}
        </a>{" "}
        {t.contact.introAfter}
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs tracking-widest text-ink/60">{t.contact.name}</label>
          <input
            type="text"
            name="from_name"
            required
            placeholder={t.contact.namePlaceholder}
            className="rounded-lg px-3.5 py-2.5 text-sm outline-none text-ink placeholder:text-ink/30 transition-colors"
            style={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-accent) / 0.3)" }}
            onFocus={(e) => (e.target.style.borderColor = "#D97757")}
            onBlur={(e) => (e.target.style.borderColor = "rgb(var(--color-accent) / 0.3)")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs tracking-widest text-ink/60">{t.contact.email}</label>
          <input
            type="email"
            name="from_email"
            required
            placeholder={t.contact.emailPlaceholder}
            className="rounded-lg px-3.5 py-2.5 text-sm outline-none text-ink placeholder:text-ink/30 transition-colors"
            style={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-accent) / 0.3)" }}
            onFocus={(e) => (e.target.style.borderColor = "#D97757")}
            onBlur={(e) => (e.target.style.borderColor = "rgb(var(--color-accent) / 0.3)")}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="font-mono text-xs tracking-widest text-ink/60">{t.contact.message}</label>
          <textarea
            rows={5}
            name="message"
            required
            placeholder={t.contact.messagePlaceholder}
            className="rounded-lg px-3.5 py-2.5 text-sm outline-none text-ink placeholder:text-ink/30 resize-none transition-colors"
            style={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-accent) / 0.3)" }}
            onFocus={(e) => (e.target.style.borderColor = "#D97757")}
            onBlur={(e) => (e.target.style.borderColor = "rgb(var(--color-accent) / 0.3)")}
          />
        </div>
        <div className="flex justify-end sm:col-span-2">
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="inline-flex items-center gap-2 font-mono text-xs font-medium px-5 py-2.5 rounded-full tracking-wide transition-all duration-200 disabled:opacity-70"
            style={{ background: "#D97757", color: "#ffffff" }}
          >
            {status === "sending" && t.contact.sending}
            {status === "sent" && t.contact.sent}
            {status === "error" && t.contact.failed}
            {status === "idle" && t.contact.submit}
          </button>
        </div>
        {status === "error" && (
          <p className="font-mono text-xs text-red-400 sm:col-span-2">
            {t.contact.errorMsg.replace("{email}", PERSONAL.email)}
          </p>
        )}
      </form>
    </section>
  );
}