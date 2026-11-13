"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send, Check, AlertCircle } from "lucide-react";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const reduce = useStillMotion();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email format";
    if (!data.message.trim()) newErrors.message = "Message is required";
    else if (data.message.trim().length < 10) newErrors.message = "Message too short (min 10 characters)";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      // Replace with your Formspree/EmailJS endpoint
      const response = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (status === "success") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
        className="mx-auto mt-14 w-full max-w-2xl text-center"
      >
        <div className="rounded-2xl border border-volt/30 bg-volt/10 p-8">
          <Check className="mx-auto h-12 w-12 text-volt" strokeWidth={1.5} aria-hidden />
          <h3 className="mt-4 font-display text-lg font-semibold text-bright">Message sent</h3>
          <p className="mt-2 text-sm text-muted">I&apos;ll get back to you within 24 hours.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex items-center gap-2 rounded-[3px] border border-volt/30 bg-volt/10 px-4 py-2 font-medium text-sm text-volt transition-colors hover:bg-volt/20"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
      className="mx-auto mt-14 w-full max-w-2xl"
      viewport={viewportOnce}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="glass-card hairline relative overflow-hidden rounded-[3px] border p-6 sm:p-8">
          <span className="accent-rule pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <span className="label-mono text-volt">Send a message</span>
            <span className="label-mono text-muted">Straight to my inbox</span>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-medium text-muted">
              Name <span className="text-volt" aria-hidden>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`mt-1.5 w-full rounded-[2px] border px-3 py-2.5 bg-panel text-bright placeholder:text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-void ${
                errors.name ? "border-destructive" : "border-bright/10 hover:border-accent/30"
              }`}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              disabled={status === "submitting"}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive" role="alert">
                <AlertCircle className="h-3 w-3" strokeWidth={2} />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-muted">
              Email <span className="text-volt" aria-hidden>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`mt-1.5 w-full rounded-[2px] border px-3 py-2.5 bg-panel text-bright placeholder:text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-void ${
                errors.email ? "border-destructive" : "border-bright/10 hover:border-accent/30"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={status === "submitting"}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive" role="alert">
                <AlertCircle className="h-3 w-3" strokeWidth={2} />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-medium text-muted">
              Message <span className="text-volt" aria-hidden>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className={`mt-1.5 w-full rounded-[2px] border px-3 py-2.5 bg-panel text-bright placeholder:text-muted/50 resize-y min-h-[120px] transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-void ${
                errors.message ? "border-destructive" : "border-bright/10 hover:border-accent/30"
              }`}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
              disabled={status === "submitting"}
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive" role="alert">
                <AlertCircle className="h-3 w-3" strokeWidth={2} />
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-6 w-full rounded-[3px] border border-accent/30 bg-accent/10 px-5 py-2.5 font-medium text-sm text-accent transition-colors hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" strokeWidth={2} aria-hidden />
              </>
            )}
          </button>

          {status === "error" && (
            <p className="mt-4 text-center text-sm text-destructive" role="alert">
              Failed to send. Please email directly at anjalluitel3@gmail.com
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default ContactForm;
