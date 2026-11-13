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
      if (!response.ok || !result.ok) throw new Error(typeof result.error === "string" ? result.error : "Registration could not be saved. Please try again.");
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.name !== "AbortError" ? error.message : "The request timed out. Please try again.");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <div className="waitlist-form" aria-live="polite" aria-atomic="true">
      {state === "success" ? (
        <div className="form-success" role="status">
          <div className="success-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <h3>Registration saved.</h3>
          <p>Your name and email have been added to the OpenAssay waitlist for release updates.</p>
        </div>
      ) : (
        <form onSubmit={submit} aria-labelledby="form-heading" aria-busy={state === "submitting"}>
          <h3 id="form-heading" className="form-heading">Join the waitlist</h3>
          <div className="form-group"><label className="form-label" htmlFor="waitlist-name">Name</label><input className="form-input" id="waitlist-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100} disabled={state === "submitting"} /></div>
          <div className="form-group"><label className="form-label" htmlFor="waitlist-email">Email address</label><input className="form-input" id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="name@institution.edu" required maxLength={254} disabled={state === "submitting"} aria-describedby="waitlist-note" /></div>
          <div className="honeypot" aria-hidden="true"><label htmlFor="waitlist-website">Leave this field empty</label><input id="waitlist-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <button className="button button-orange" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Submitting…" : "Join the waitlist"}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          {state === "error" && <p className="form-error" role="alert">{message}</p>}
          <p id="waitlist-note" className="form-note">By registering, you agree to receive OpenAssay release updates. Your name and email are stored for this waitlist.</p>
        </form>
      )}
    </div>
  );
}
