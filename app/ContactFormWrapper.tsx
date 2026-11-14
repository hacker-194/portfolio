"use client";

import dynamic from "next/dynamic";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((mod) => mod.ContactForm),
  { ssr: false, loading: () => null },
);

export default function ContactFormWrapper() {
  return <ContactForm />;
}