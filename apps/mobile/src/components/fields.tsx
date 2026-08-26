import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
}

function Label({ label, htmlFor, required }: FieldWrapperProps & { htmlFor: string }) {
  return (
    <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor={htmlFor}>
      {label} {required && <span className="text-primary">*</span>}
    </label>
  );
}

export function TextField({
  label,
  required,
  id,
  ...props
}: FieldWrapperProps & InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <div className="mb-4">
      <Label label={label} htmlFor={id} required={required} />
      <input id={id} required={required} className={fieldClass} {...props} />
    </div>
  );
}

export function TextAreaField({
  label,
  required,
  id,
  ...props
}: FieldWrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string }) {
  return (
    <div className="mb-4">
      <Label label={label} htmlFor={id} required={required} />
      <textarea id={id} required={required} className={fieldClass} rows={3} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  required,
  id,
  children,
  ...props
}: FieldWrapperProps & SelectHTMLAttributes<HTMLSelectElement> & { id: string }) {
  return (
    <div className="mb-4">
      <Label label={label} htmlFor={id} required={required} />
      <select id={id} required={required} className={fieldClass} {...props}>
        {children}
      </select>
    </div>
  );
}
