import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { contactSection, hasPhone, phoneHref, site } from "../data/site";
import { Container, Dot, EASE, pressable, primaryButton, useReducedMotionSafe } from "./primitives";
import { Reveal } from "./Reveal";

type Status = "idle" | "sending" | "success" | "error";
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const fieldBase =
  "mt-2 block w-full rounded-[12px] border bg-bg px-4 text-[16px] text-ink transition-[border-color] duration-150 placeholder:text-subtle focus:border-violet focus:outline-none";

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.6 } },
};

function errorFor(element: FieldElement) {
  if (element.validity.valueMissing) return "Ce champ est obligatoire.";
  if (element.validity.typeMismatch) return "Adresse email invalide, par exemple nom@domaine.fr.";
  return "";
}

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  children: (props: { id: string; className: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
};

function Field({ name, label, error, children }: FieldProps) {
  const id = `champ-${name}`;
  const errorId = `${id}-erreur`;
  return (
    <motion.div variants={item}>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
      </label>
      {children({
        id,
        className: `${fieldBase} ${error ? "border-[#FF8F8F]" : "border-white/[0.07]"}`,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="mt-2 text-[14px] text-[#FF9C9C]">
          {error}
        </p>
      )}
    </motion.div>
  );
}

function ContactForm() {
  const reduceMotion = useReducedMotionSafe();
  const [needs, setNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const toggleNeed = (need: string) =>
    setNeeds((current) => (current.includes(need) ? current.filter((value) => value !== need) : [...current, need]));

  const validate = (element: FieldElement) => {
    const message = errorFor(element);
    setErrors((current) => ({ ...current, [element.name]: message }));
    return message;
  };

  const handlers = {
    onBlur: (event: React.FocusEvent<FieldElement>) => {
      const next = event.relatedTarget;
      if (next instanceof HTMLButtonElement && next.type === "submit") return;
      validate(event.currentTarget);
    },
    onInput: (event: React.FormEvent<FieldElement>) => {
      if (errors[event.currentTarget.name]) validate(event.currentTarget);
    },
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Array.from(form.elements).filter(
      (element): element is FieldElement => element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement,
    );
    const invalid = fields.filter((element) => element.name && validate(element));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(contactSection.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-[28px] border border-white/[0.07] bg-surface p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="py-10 text-center sm:py-16"
          >
            <p className="text-[32px] leading-[1.05] font-bold tracking-[-0.04em]">
              {contactSection.success.title}
              <Dot />
            </p>
            <p className="mx-auto mt-4 max-w-[420px] text-[18px] leading-[1.45] text-muted">{contactSection.success.text}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            id="formulaire"
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={list}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-6"
          >
            <motion.fieldset variants={item}>
              <legend className="text-[15px] font-medium">De quoi avez-vous besoin ?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {contactSection.needs.map((need) => {
                  const selected = needs.includes(need);
                  return (
                    <button
                      type="button"
                      key={need}
                      aria-pressed={selected}
                      onClick={() => toggleNeed(need)}
                      className={`min-h-11 rounded-[12px] border px-4 text-[15px] font-medium transition-[color,background-color,border-color,transform] ${pressable} ${
                        selected ? "border-violet bg-violet-strong text-white" : "border-white/[0.07] bg-bg text-muted hover:text-ink"
                      }`}
                    >
                      {need}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" name="besoins" value={needs.join(", ")} />
            </motion.fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field name="nom" label="Votre nom *" error={errors.nom}>
                {(props) => <input {...props} {...handlers} name="nom" required maxLength={120} autoComplete="name" className={`${props.className} h-12`} />}
              </Field>
              <Field name="entreprise" label="Votre entreprise">
                {(props) => <input {...props} name="entreprise" maxLength={120} autoComplete="organization" className={`${props.className} h-12`} />}
              </Field>
              <Field name="email" label="Votre email *" error={errors.email}>
                {(props) => <input {...props} {...handlers} name="email" type="email" required maxLength={180} autoComplete="email" className={`${props.className} h-12`} />}
              </Field>
              <Field name="telephone" label="Votre téléphone">
                {(props) => <input {...props} name="telephone" type="tel" maxLength={40} autoComplete="tel" className={`${props.className} h-12`} />}
              </Field>
            </div>

            <Field name="budget" label="Budget indicatif">
              {(props) => (
                <select {...props} name="budget" defaultValue="" className={`${props.className} h-12`}>
                  <option value="">Je ne sais pas encore</option>
                  {contactSection.budgets.map((budget) => (
                    <option key={budget}>{budget}</option>
                  ))}
                </select>
              )}
            </Field>

            <Field name="message" label="Parlez-moi de votre projet *" error={errors.message}>
              {(props) => <textarea {...props} {...handlers} name="message" required maxLength={5000} rows={5} className={`${props.className} py-3 leading-[1.5]`} />}
            </Field>

            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="champ-site">Ne pas remplir</label>
              <input id="champ-site" name="site_web" tabIndex={-1} autoComplete="off" />
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-[12px] border border-[#FF8F8F]/40 px-4 py-3 text-[15px] leading-[1.45] text-[#FF9C9C]">
                {contactSection.error}{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-ink underline underline-offset-4">
                  {site.email}
                </a>
                .
              </p>
            )}

            <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14px] leading-[1.45] text-muted">
                Vos données servent uniquement à vous répondre.{" "}
                <a href={site.links.privacy} className="text-violet-soft underline underline-offset-4 hover:text-ink">
                  Politique de confidentialité
                </a>
              </p>
              <button type="submit" disabled={status === "sending"} className={`${primaryButton} shrink-0 disabled:cursor-wait disabled:opacity-70`}>
                {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
              </button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="pt-[120px] pb-[110px] md:pt-[160px] md:pb-[160px]">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal className="text-center lg:sticky lg:top-28 lg:text-left">
            <h2 className="text-[clamp(48px,5.6vw,88px)] leading-[0.94] font-bold tracking-[-0.055em]">
              <span className="block">{contactSection.titleLines[0]}</span>
              <span className="block">
                {contactSection.titleLines[1]}
                <Dot />
              </span>
            </h2>
            <p className="mx-auto mt-7 max-w-[520px] text-[19px] leading-[1.45] text-muted lg:mx-0">{contactSection.text}</p>
            <div className="mt-8 flex flex-col items-center gap-2 lg:items-start">
              <a href={`mailto:${site.email}`} className="text-[24px] font-semibold tracking-[-0.02em] break-all underline decoration-white/20 underline-offset-[6px] hover:decoration-violet-soft">
                {site.email}
              </a>
              {hasPhone && (
                <a href={phoneHref} className={`inline-flex min-h-11 items-center text-[17px] font-medium text-muted hover:text-ink ${pressable}`}>
                  {site.phone}
                </a>
              )}
            </div>
          </Reveal>
        </div>
        <div className="relative min-w-0 lg:col-span-7">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
