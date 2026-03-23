"use client";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp } from "@/lib/animations";

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] font-semibold text-[#374151]">{label}</label>
      <div
        className="flex items-center rounded-lg bg-white border-[1.5px] border-[#E2E8F0] px-3.5 focus-within:border-[#2563EB] transition-colors"
        style={{ height: 44 }}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[14px] text-[#374151] placeholder:text-[#9CA3AF] outline-none"
        />
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full flex flex-col items-center gap-12"
      style={{ background: "#F8FAFC", padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">Contact</span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[40px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-1px]">
          Get in touch
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[18px] text-[#64748B] text-center leading-[1.6] max-w-[560px]">
          Have a question or want to learn more? We&apos;d love to hear from you.
        </p>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.2} className="w-full max-w-[680px]">
        <div className="flex flex-col gap-5 w-full">
          <FormField label="Full Name" placeholder="Your full name" />
          <FormField label="Email Address" placeholder="your@email.com" type="email" />
          <FormField label="Subject" placeholder="What's this about?" />
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#374151]">Message</label>
            <textarea
              placeholder="Tell us how we can help..."
              className="w-full rounded-lg bg-white border-[1.5px] border-[#E2E8F0] p-3.5 text-[14px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] resize-none transition-colors"
              style={{ height: 140 }}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[10px] bg-[#2563EB] text-white text-[16px] font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200 flex items-center justify-center"
            style={{ padding: "14px 28px" }}
          >
            Send message
          </button>
        </div>
      </SectionReveal>
    </section>
  );
}
