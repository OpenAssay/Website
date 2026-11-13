"use client";

import { useState, type FormEvent } from "react";

export function WaitlistForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;
    const data = new FormData(event.currentTarget);
    setState("submitting");
    setMessage("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), website: String(data.get("website") ?? "") }),
        signal: controller.signal,
      });
      const payload: unknown = await response.json();
      const result = payload && typeof payload === "object" ? payload as { ok?: boolean; error?: unknown } : {};
      if (!response.ok || !result.ok) throw new Error(typeof result.error === "string" ? result.error : "We couldn’t save your spot. Please try again.");
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.name !== "AbortError" ? error.message : "That took a little too long. Please try again.");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <div className="waitlist-form" aria-live="polite" aria-atomic="true">
      {state === "success" ? (
        <div className="form-success" role="status">
          <div className="success-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <h3>You’re on the list.</h3>
          <p>Thanks for being curious. We’ll be in touch with OpenAssay launch news and updates on the reproduction collection.</p>
        </div>
      ) : (
        <form onSubmit={submit} aria-labelledby="form-heading" aria-busy={state === "submitting"}>
          <h3 id="form-heading" className="form-heading">A place on the list. A first look at what’s next.</h3>
          <div className="form-group"><label className="form-label" htmlFor="waitlist-name">Your name</label><input className="form-input" id="waitlist-name" name="name" autoComplete="name" placeholder="Ada Lovelace" required maxLength={100} disabled={state === "submitting"} /></div>
          <div className="form-group"><label className="form-label" htmlFor="waitlist-email">Email address</label><input className="form-input" id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="ada@yourlab.org" required maxLength={254} disabled={state === "submitting"} aria-describedby="waitlist-note" /></div>
          <div className="honeypot" aria-hidden="true"><label htmlFor="waitlist-website">Leave this field empty</label><input id="waitlist-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <button className="button button-orange" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Saving your spot…" : "Join the waitlist"}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          {state === "error" && <p className="form-error" role="alert">{message}</p>}
          <p id="waitlist-note" className="form-note">By joining, you agree to receive OpenAssay launch updates. Your name and email are saved for this waitlist.</p>
        </form>
      )}
    </div>
  );
}
