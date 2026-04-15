import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthScreen({
  title,
  eyebrow,
  children,
  footer,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <div className="px-6 md:px-12 py-6">
        <Link to="/" className="inline-block" aria-label="AVL Copilot home">
          <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="AVL Copilot" className="h-9 w-auto" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-container-low border border-white/5 p-8 md:p-10">
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase mb-3">
              {eyebrow}
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight mb-8">
              {title}
            </h1>
            {children}
          </div>
          {footer && <div className="text-center mt-6 text-sm text-on-surface-variant">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Field({
  label,
  type = 'text',
  name,
  placeholder,
  required,
  autoComplete,
  value,
  defaultValue,
  onChange,
}: FieldProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-3"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full bg-surface border border-white/10 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 font-mono text-sm focus:border-primary focus:outline-none focus:ring-0 transition-colors"
      />
    </div>
  );
}
