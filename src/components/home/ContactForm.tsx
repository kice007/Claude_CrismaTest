"use client";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { toast } from "sonner";

type FormData = {
  name: string;
  company: string;
  email: string;
  teamSize: "1-10" | "11-50" | "51-200" | "200+";
  message?: string;
  gdprConsent: true;
};

function buildSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("contact_form_error_required")).max(100),
    company: z.string().min(1, t("contact_form_error_required")).max(100),
    email: z.string().email(t("contact_form_error_email")),
    teamSize: z.enum(["1-10", "11-50", "51-200", "200+"], {
      error: t("contact_form_error_required"),
    }),
    message: z.string().max(2000).optional(),
    gdprConsent: z.literal(true, {
      error: t("contact_form_error_required"),
    }),
  });
}

const TEAM_SIZE_OPTIONS = [
  { value: "1-10", labelKey: "contact_form_team_size_opt_1" },
  { value: "11-50", labelKey: "contact_form_team_size_opt_2" },
  { value: "51-200", labelKey: "contact_form_team_size_opt_3" },
  { value: "200+", labelKey: "contact_form_team_size_opt_4" },
] as const;

const inputClass =
  "w-full min-h-[48px] rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-brand-navy placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors";

const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function ContactForm() {
  const { t } = useTranslation();

  const schema = buildSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
    mode: "onBlur",
  });

  const gdprWatched = watch("gdprConsent");

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        toast.error(t("contact_form_error_rate_limit"));
        return;
      }

      if (!res.ok) {
        toast.error(t("contact_form_error_generic"));
        return;
      }

      toast.success(t("contact_form_success_toast"));
      reset();
    } catch {
      toast.error(t("contact_form_error_generic"));
    }
  }

  const isSubmitDisabled = !isValid || !gdprWatched || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t("contact_form_name_label")}
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder={t("contact_form_name_placeholder")}
          className={inputClass}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="contact-company" className={labelClass}>
          {t("contact_form_company_label")}
        </label>
        <input
          id="contact-company"
          type="text"
          autoComplete="organization"
          placeholder={t("contact_form_company_placeholder")}
          className={inputClass}
          {...register("company")}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          {t("contact_form_email_label")}
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder={t("contact_form_email_placeholder")}
          className={inputClass}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Team size */}
      <div>
        <label htmlFor="contact-team-size" className={labelClass}>
          {t("contact_form_team_size_label")}
        </label>
        <select
          id="contact-team-size"
          className={`${inputClass} cursor-pointer`}
          defaultValue=""
          {...register("teamSize")}
        >
          <option value="" disabled>
            {t("contact_form_team_size_placeholder")}
          </option>
          {TEAM_SIZE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
        {errors.teamSize && (
          <p className="mt-1 text-sm text-red-500">{errors.teamSize.message}</p>
        )}
      </div>

      {/* Message (optional) */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t("contact_form_message_label")}
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder={t("contact_form_message_placeholder")}
          className={`${inputClass} min-h-[120px] resize-y`}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* GDPR consent */}
      <div className="flex items-start gap-3">
        <input
          id="contact-gdpr"
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 accent-brand-primary"
          {...register("gdprConsent")}
        />
        <label htmlFor="contact-gdpr" className="cursor-pointer text-sm leading-relaxed text-neutral-600">
          {t("contact_form_gdpr")}
        </label>
      </div>
      {errors.gdprConsent && (
        <p className="text-sm text-red-500">{errors.gdprConsent.message}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t("contact_form_submitting") : t("contact_form_submit")}
      </button>
    </form>
  );
}
