"use client";

// Ports the "Newsletter H_2" Contact Form 7 template - see FaqContactForm.tsx
// for why this is a static, non-submitting form. Unlike FaqContactForm
// (only ever rendered inside Tabs.tsx, which is already "use client"),
// this is used from Newsletter.tsx, a plain server component - the
// onSubmit handler needs its own client boundary here.
export default function NewsletterForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        name="email"
        autoComplete="email"
        className="nm-trial-2-form-input wa_placeholder nm-p-1"
        placeholder="Enter your mail"
        required
      />
      <button type="submit" className="nm-trial-2-form-btn nm-h-1">
        Get Started
      </button>
    </form>
  );
}
