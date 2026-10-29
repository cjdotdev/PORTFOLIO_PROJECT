import { useId, useRef, useState, type SubmitEvent } from "react";
import emailjs from "@emailjs/browser";
import { PERSONAL } from "../data";
import type { Dict } from "../i18n";
import styles from "./contact-form.module.css";

type Status = "idle" | "sending" | "sent" | "error";

const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY as string | undefined;

/**
 * Sends through EmailJS. The result is confirmed in place and stays until the next send; a failure
 * keeps what was typed and offers the address to write to directly.
 */
export default function ContactForm({ t }: { t: Dict["contact"] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const id = useId();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    setStatus("sending");
    try {
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) throw new Error("EmailJS is not configured");
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} onChange={() => status === "sent" && setStatus("idle")}>
      <div className={styles.field}>
        <label htmlFor={`${id}-name`}>{t.name}</label>
        <input id={`${id}-name`} type="text" name="from_name" autoComplete="name" required placeholder={t.namePlaceholder} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${id}-email`}>{t.email}</label>
        <input
          id={`${id}-email`}
          type="email"
          name="from_email"
          autoComplete="email"
          required
          placeholder={t.emailPlaceholder}
        />
      </div>
      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor={`${id}-message`}>{t.message}</label>
        <textarea id={`${id}-message`} name="message" rows={5} required placeholder={t.messagePlaceholder} />
      </div>
      <div className={`${styles.footer} ${styles.wide}`}>
        <p className={styles.status} role={status === "error" ? "alert" : "status"} data-status={status}>
          {status === "sent" && t.sent}
          {status === "error" && t.error.replace("{email}", PERSONAL.email)}
        </p>
        <button type="submit" className="btn btn-primary" disabled={sending} aria-busy={sending}>
          {sending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
