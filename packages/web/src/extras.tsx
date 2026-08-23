import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { TYPE_ROLES, type TypeRole } from "@firdawsi/tokens";
import { Dialog, type DialogProps } from "./components.js";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export function Text({
  role = "body-md",
  as: Element = "p",
  lang,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { role?: TypeRole; as?: "p" | "span" | "div"; lang?: string }) {
  return (
    <Element
      className={cx("firdawsi-text", `firdawsi-text--${role}`, className)}
      data-type-role={role}
      lang={lang}
      {...props}
    >
      {children}
    </Element>
  );
}

export function Heading({
  level = 2,
  role,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4; role?: TypeRole }) {
  const Element = `h${level}` as const;
  const resolved = role ?? (level === 1 ? "display-sm" : level === 2 ? "headline-md" : "title-lg");
  return (
    <Element className={cx("firdawsi-text", `firdawsi-text--${resolved}`, className)} data-type-role={resolved} {...props}>
      {children}
    </Element>
  );
}

export function Stack({
  gap = "4",
  direction = "column",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { gap?: "1" | "2" | "3" | "4" | "6" | "8"; direction?: "row" | "column" }) {
  return (
    <div
      className={cx("firdawsi-stack", `firdawsi-stack--${direction}`, className)}
      style={{ gap: `var(--firdawsi-space-${gap})` }}
      {...props}
    />
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}>(
  ({ id, label, hint, error, className, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    return (
      <div className={cx("firdawsi-field", className)}>
        <label className="firdawsi-field__label" htmlFor={fieldId}>{label}</label>
        <textarea
          ref={ref}
          id={fieldId}
          className={cx("firdawsi-textarea", Boolean(error) && "is-invalid")}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          {...props}
        />
        {hint && <span id={hintId} className="firdawsi-field__hint">{hint}</span>}
        {error && <span id={errorId} className="firdawsi-field__error">{error}</span>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cx("firdawsi-slider", className)}>
      <label className="firdawsi-field__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(event) => onValueChange?.(Number(event.target.value))}
      />
    </div>
  );
}

export function Combobox({
  label,
  options,
  value,
  onValueChange,
  className,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
  const listId = useId();
  const inputId = useId();
  return (
    <div className={cx("firdawsi-field", className)}>
      <label className="firdawsi-field__label" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className="firdawsi-field__input firdawsi-combobox"
        role="combobox"
        aria-expanded="true"
        aria-controls={listId}
        list={listId}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      />
      <datalist id={listId}>
        {options.map((option) => <option key={option} value={option} />)}
      </datalist>
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("firdawsi-badge", className)}>{children}</span>;
}

export function Chip({
  children,
  selected = false,
  onClick,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cx("firdawsi-chip", selected && "is-selected", className)}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Accordion({
  items,
  className,
}: {
  items: readonly { id: string; title: ReactNode; content: ReactNode }[];
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className={cx("firdawsi-accordion", className)}>
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <details key={item.id} open={expanded} onToggle={(event) => {
            if ((event.target as HTMLDetailsElement).open) setOpen(item.id);
          }}>
            <summary>{item.title}</summary>
            <div className="firdawsi-accordion__panel">{item.content}</div>
          </details>
        );
      })}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: readonly { href?: string; label: ReactNode }[];
}) {
  return (
    <nav className="firdawsi-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {item.href && index < items.length - 1
              ? <a href={item.href}>{item.label}</a>
              : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function AlertDialog(props: DialogProps) {
  return <Dialog {...props} className={cx("firdawsi-alert-dialog", props.className)} />;
}

export function Skeleton({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return <div className={cx("firdawsi-skeleton", className)} role="status" aria-label={label} />;
}

interface ToastItem {
  id: string;
  message: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
}

interface ToastQueueValue {
  toasts: ToastItem[];
  push: (message: ReactNode, tone?: ToastItem["tone"]) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastQueueValue | null>(null);

export function useToastQueue(): ToastQueueValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToastQueue must be used within ToastProvider");
  return value;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const value = useMemo<ToastQueueValue>(() => ({
    toasts,
    push: (message, tone = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current, { id, message, tone }]);
    },
    dismiss: (id) => setToasts((current) => current.filter((item) => item.id !== id)),
  }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="firdawsi-toast-queue" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={cx("firdawsi-toast", `firdawsi-banner--${toast.tone}`)} role="status">
            <span>{toast.message}</span>
            <button type="button" className="firdawsi-icon-button" aria-label="Dismiss notification" onClick={() => value.dismiss(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { TYPE_ROLES };
