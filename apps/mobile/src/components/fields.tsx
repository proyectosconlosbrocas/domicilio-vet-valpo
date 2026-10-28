import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const fieldClass =
  "w-full min-h-12 rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-neutral-400 focus:border-primary-ink focus:outline-none focus:ring-2 focus:ring-primary/20 read-only:bg-neutral-100 read-only:text-neutral-500";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  hint?: string;
}

function Label({ label, htmlFor, required }: FieldWrapperProps & { htmlFor: string }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor={htmlFor}>
      {label} {required && <span className="text-primary-ink">*</span>}
    </label>
  );
}

function Hint({ hint }: { hint?: string }) {
  return hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null;
}

export function TextField({
  label,
  required,
  hint,
  id,
  ...props
}: FieldWrapperProps & InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <Label label={label} htmlFor={id} required={required} />
      <input id={id} required={required} className={fieldClass} {...props} />
      <Hint hint={hint} />
    </div>
  );
}

export function TextAreaField({
  label,
  required,
  hint,
  id,
  ...props
}: FieldWrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <Label label={label} htmlFor={id} required={required} />
      <textarea id={id} required={required} className={fieldClass} rows={3} {...props} />
      <Hint hint={hint} />
    </div>
  );
}

export function SelectField({
  label,
  required,
  hint,
  id,
  children,
  ...props
}: FieldWrapperProps & SelectHTMLAttributes<HTMLSelectElement> & { id: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <Label label={label} htmlFor={id} required={required} />
      <select id={id} required={required} className={fieldClass} {...props}>
        {children}
      </select>
      <Hint hint={hint} />
    </div>
  );
}
