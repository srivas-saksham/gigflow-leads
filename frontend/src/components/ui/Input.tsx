import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const baseInputClass = `
  w-full bg-[var(--bg-surface)] border border-[var(--border)]
  text-[var(--text-primary)] placeholder-[var(--text-muted)]
  rounded-lg px-3 py-2.5 text-sm
  focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber-border)]
  hover:border-[var(--border-hover)]
  transition-all duration-150
`;

interface LabelProps { children: ReactNode; htmlFor?: string; required?: boolean }
export const Label = ({ children, htmlFor, required }: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 tracking-wide uppercase">
    {children}{required && <span className="text-amber-500 ml-0.5">*</span>}
  </label>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string }
export const Input = ({ label, id, className = '', ...props }: InputProps) => (
  <div>
    {label && <Label htmlFor={id} required={props.required}>{label}</Label>}
    <input id={id} className={`${baseInputClass} ${className}`} {...props} />
  </div>
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; children: ReactNode }
export const Select = ({ label, id, children, className = '', ...props }: SelectProps) => (
  <div>
    {label && <Label htmlFor={id} required={props.required}>{label}</Label>}
    <select
      id={id}
      className={`${baseInputClass} cursor-pointer appearance-none ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23555' stroke-width='2' d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px', paddingRight: '32px' }}
      {...props}
    >
      {children}
    </select>
  </div>
);

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string }
export const Textarea = ({ label, id, className = '', ...props }: TextareaProps) => (
  <div>
    {label && <Label htmlFor={id}>{label}</Label>}
    <textarea id={id} className={`${baseInputClass} resize-none ${className}`} {...props} />
  </div>
);