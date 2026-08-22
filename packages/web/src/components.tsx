import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import {
  generateCorners,
  generateFrame,
  generatePattern,
  generatePreset,
  type PatternKind,
  type PatternOptions,
  type PatternPresetId,
} from "@firdawsi/geometry";

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export type CornerStyle = "round" | "bevel" | "notch" | "arch";
export type OrnamentStyle = "none" | "corners" | "frame" | "pattern";
export type OrnamentIntensity = "quiet" | "balanced";
export type AtmosphereTone = "courtyard-wash" | "lapis-veil" | "jade-depth";

function cornerClass(corner?: CornerStyle): string | false {
  return corner ? `firdawsi-corner--${corner}` : false;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  /** Distinctive corner treatment; especially useful on outline/secondary buttons. */
  corner?: CornerStyle;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, disabled, corner, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cx("firdawsi-button", `firdawsi-button--${variant}`, `firdawsi-button--${size}`, cornerClass(corner), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-corner={corner}
      {...props}
    >
      {loading && <span className="firdawsi-spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  ),
);
Button.displayName = "Button";

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, className, children, ...props }, ref) => (
    <Button ref={ref} className={cx("firdawsi-icon-button", className)} aria-label={label} {...props}>
      <span aria-hidden="true">{children}</span>
    </Button>
  ),
);
IconButton.displayName = "IconButton";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leading?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, hint, error, leading, className, "aria-describedby": describedBy, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const description = [describedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
    return (
      <div className={cx("firdawsi-field", className)}>
        <label className="firdawsi-field__label" htmlFor={inputId}>{label}</label>
        <span className={cx("firdawsi-field__control", Boolean(error) && "is-invalid")}>
          {leading && <span className="firdawsi-field__leading" aria-hidden="true">{leading}</span>}
          <input
            ref={ref}
            id={inputId}
            className="firdawsi-field__input"
            aria-invalid={error ? true : undefined}
            aria-describedby={description}
            {...props}
          />
        </span>
        {hint && <span id={hintId} className="firdawsi-field__hint">{hint}</span>}
        {error && <span id={errorId} className="firdawsi-field__error">{error}</span>}
      </div>
    );
  },
);
TextField.displayName = "TextField";

export const SearchField = forwardRef<HTMLInputElement, Omit<TextFieldProps, "type" | "leading">>(
  (props, ref) => (
    <TextField
      ref={ref}
      type="search"
      leading={<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>}
      {...props}
    />
  ),
);
SearchField.displayName = "SearchField";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  options: readonly SelectOption[];
  hint?: ReactNode;
  error?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, options, hint, error, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const descriptionId = hint || error ? `${selectId}-description` : undefined;
    return (
      <div className={cx("firdawsi-field", className)}>
        <label className="firdawsi-field__label" htmlFor={selectId}>{label}</label>
        <span className={cx("firdawsi-select", Boolean(error) && "is-invalid")}>
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionId}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
            ))}
          </select>
        </span>
        {(hint || error) && (
          <span id={descriptionId} className={error ? "firdawsi-field__error" : "firdawsi-field__hint"}>
            {error ?? hint}
          </span>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

export interface MenuItem {
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  label: ReactNode;
  items: readonly MenuItem[];
  align?: "start" | "end";
}

export function Menu({ label, items, align = "start" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusItem = (start: number, direction: 1 | -1) => {
    for (let offset = 0; offset < items.length; offset += 1) {
      const index = (start + offset * direction + items.length) % items.length;
      if (!items[index]?.disabled) {
        itemRefs.current[index]?.focus();
        break;
      }
    }
  };
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div className="firdawsi-menu" ref={rootRef}>
      <Button
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => {
            if (!value) queueMicrotask(() => focusItem(0, 1));
            return !value;
          });
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            queueMicrotask(() => focusItem(event.key === "ArrowDown" ? 0 : items.length - 1, event.key === "ArrowDown" ? 1 : -1));
          }
        }}
      >
        {label}
      </Button>
      {open && (
        <div className={cx("firdawsi-menu__popup", `firdawsi-menu__popup--${align}`)} role="menu">
          {items.map((item, index) => (
            <button
              key={index}
              ref={(node) => { itemRefs.current[index] = node; }}
              role="menuitem"
              disabled={item.disabled}
              tabIndex={index === 0 ? 0 : -1}
              onClick={() => {
                item.onSelect();
                setOpen(false);
                rootRef.current?.querySelector<HTMLButtonElement>("[aria-haspopup=menu]")?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  focusItem(index + (event.key === "ArrowDown" ? 1 : -1), event.key === "ArrowDown" ? 1 : -1);
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  focusItem(event.key === "Home" ? 0 : items.length - 1, event.key === "Home" ? 1 : -1);
                } else if (event.key === "Escape") {
                  setOpen(false);
                  rootRef.current?.querySelector<HTMLButtonElement>("[aria-haspopup=menu]")?.focus();
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
}

function Choice({ label, description, className, id, ...props }: ChoiceProps & { kind: "checkbox" | "radio" | "switch" }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { kind, ...inputProps } = props;
  return (
    <label className={cx("firdawsi-choice", `firdawsi-choice--${kind}`, className)} htmlFor={inputId}>
      <input id={inputId} type={kind === "radio" ? "radio" : "checkbox"} role={kind === "switch" ? "switch" : undefined} {...inputProps} />
      <span className="firdawsi-choice__mark" aria-hidden="true" />
      <span><span className="firdawsi-choice__label">{label}</span>{description && <span className="firdawsi-choice__description">{description}</span>}</span>
    </label>
  );
}

export const Checkbox = (props: ChoiceProps) => <Choice kind="checkbox" {...props} />;
export const Radio = (props: ChoiceProps) => <Choice kind="radio" {...props} />;
export const Switch = (props: ChoiceProps) => <Choice kind="switch" {...props} />;

export const Surface = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { corner?: CornerStyle }>(
  ({ className, corner, ...props }, ref) => (
    <div ref={ref} className={cx("firdawsi-surface", cornerClass(corner), className)} data-corner={corner} {...props} />
  ),
);
Surface.displayName = "Surface";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  footer?: ReactNode;
  as?: "article" | "section";
  corner?: CornerStyle;
  ornament?: OrnamentStyle;
  intensity?: OrnamentIntensity;
}

export function Card({
  title,
  footer,
  children,
  className,
  as: Element = "article",
  corner,
  ornament = "none",
  intensity = "quiet",
  ...props
}: CardProps) {
  const body = (
    <>
      {title && <h3 className="firdawsi-card__title">{title}</h3>}
      <div className="firdawsi-card__body">{children}</div>
      {footer && <footer className="firdawsi-card__footer">{footer}</footer>}
    </>
  );
  return (
    <Element
      className={cx(
        "firdawsi-card",
        cornerClass(corner),
        ornament !== "none" && `firdawsi-card--ornament-${ornament}`,
        ornament !== "none" && `firdawsi-card--intensity-${intensity}`,
        className,
      )}
      data-corner={corner}
      data-ornament={ornament}
      {...props}
    >
      {ornament === "corners" && (
        <GeometryOverlay kind="corners" options={{ density: intensity === "quiet" ? 0.18 : 0.28 }} />
      )}
      {ornament === "frame" && (
        <GeometryOverlay kind="frame" options={{ density: intensity === "quiet" ? 0.22 : 0.32 }} />
      )}
      {ornament === "pattern" ? (
        <PatternSurface intensity={intensity} className="firdawsi-card__pattern">
          {body}
        </PatternSurface>
      ) : (
        body
      )}
    </Element>
  );
}

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, label }: TabsProps) {
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? "";
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;
  const baseId = useId();
  const choose = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };
  const move = (index: number, direction: 1 | -1) => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const next = (index + offset * direction + items.length) % items.length;
      if (!items[next]?.disabled) {
        choose(items[next]!.id);
        document.getElementById(`${baseId}-tab-${items[next]!.id}`)?.focus();
        break;
      }
    }
  };
  return (
    <div className="firdawsi-tabs">
      <div className="firdawsi-tabs__list" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            id={`${baseId}-tab-${item.id}`}
            role="tab"
            aria-selected={selected === item.id}
            aria-controls={`${baseId}-panel-${item.id}`}
            disabled={item.disabled}
            tabIndex={selected === item.id ? 0 : -1}
            onClick={() => choose(item.id)}
            onKeyDown={(event) => {
              const previous = getComputedStyle(event.currentTarget).direction === "rtl" ? "ArrowRight" : "ArrowLeft";
              const next = previous === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
              if (event.key === previous || event.key === next) {
                event.preventDefault();
                move(index, event.key === next ? 1 : -1);
              } else if (event.key === "Home" || event.key === "End") {
                event.preventDefault();
                const ordered = event.key === "Home" ? items : Array.from(items).reverse();
                const target = ordered.find((candidate) => !candidate.disabled);
                if (target) {
                  choose(target.id);
                  document.getElementById(`${baseId}-tab-${target.id}`)?.focus();
                }
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={selected !== item.id}
          tabIndex={0}
          className="firdawsi-tabs__panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export interface NavigationItem {
  label: ReactNode;
  href: string;
  current?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
}

export function Navigation({ label, items, className }: { label: string; items: readonly NavigationItem[]; className?: string }) {
  return (
    <nav className={cx("firdawsi-navigation", className)} aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.icon && <span className="firdawsi-navigation__icon" aria-hidden="true">{item.icon}</span>}
              <span className="firdawsi-navigation__label">{item.label}</span>
              {item.badge != null && (
                <span className="firdawsi-navigation__badge">{item.badge}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "title"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  variant?: "dialog" | "sheet";
}

export function Dialog({ open, onOpenChange, title, description, footer, children, className, variant = "dialog", ...props }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={cx("firdawsi-dialog", variant === "sheet" && "firdawsi-sheet", className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => { event.preventDefault(); onOpenChange(false); }}
      onClose={() => { if (open) onOpenChange(false); }}
      onClick={(event) => { if (event.target === event.currentTarget) onOpenChange(false); }}
      {...props}
    >
      <div className="firdawsi-dialog__content">
        <header><div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div><IconButton label="Close" variant="quiet" onClick={() => onOpenChange(false)}>×</IconButton></header>
        <div className="firdawsi-dialog__body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </dialog>
  );
}

export const Sheet = (props: Omit<DialogProps, "variant">) => <Dialog variant="sheet" {...props} />;

export function Tooltip({ content, children }: { content: ReactNode; children: ReactElement<{ "aria-describedby"?: string }> }) {
  const id = useId();
  const describedBy = [children.props["aria-describedby"], id].filter(Boolean).join(" ");
  return <span className="firdawsi-tooltip">{cloneElement(children, { "aria-describedby": describedBy })}<span id={id} role="tooltip">{content}</span></span>;
}

export function Popover({ trigger, children, label }: { trigger: ReactNode; children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div className="firdawsi-popover" ref={rootRef}>
      <button ref={triggerRef} className="firdawsi-popover__trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>{trigger}</button>
      {open && <div id={id} className="firdawsi-popover__content" role="region" aria-label={label} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } }}>{children}</div>}
    </div>
  );
}

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
  actions?: ReactNode;
}

export function Banner({ tone = "info", title, actions, children, className, ...props }: BannerProps) {
  return <div className={cx("firdawsi-banner", `firdawsi-banner--${tone}`, className)} role={tone === "danger" ? "alert" : "status"} {...props}><div>{title && <strong>{title}</strong>}<div>{children}</div></div>{actions && <div className="firdawsi-banner__actions">{actions}</div>}</div>;
}

export function Toast({ children, tone = "info", onDismiss }: { children: ReactNode; tone?: BannerProps["tone"]; onDismiss?: () => void }) {
  return <div className="firdawsi-toast"><Banner tone={tone}>{children}</Banner>{onDismiss && <IconButton label="Dismiss notification" variant="quiet" onClick={onDismiss}>×</IconButton>}</div>;
}

export interface ProgressProps {
  value?: number;
  max?: number;
  label: string;
  showValue?: boolean;
}

export function Progress({ value, max = 100, label, showValue = false }: ProgressProps) {
  const normalized = value === undefined ? undefined : Math.min(max, Math.max(0, value));
  return <div className="firdawsi-progress"><div className="firdawsi-progress__label"><span>{label}</span>{showValue && normalized !== undefined && <span>{Math.round((normalized / max) * 100)}%</span>}</div><progress aria-label={label} value={normalized} max={max} /></div>;
}

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export function Stepper({ steps, current, label = "Progress" }: { steps: readonly Step[]; current: number; label?: string }) {
  return <ol className="firdawsi-stepper" aria-label={label}>{steps.map((step, index) => <li key={index} className={cx(index < current && "is-complete", index === current && "is-current")} aria-current={index === current ? "step" : undefined}><span className="firdawsi-stepper__marker" aria-hidden="true">{index < current ? "✓" : index + 1}</span><span><strong>{step.label}</strong>{step.description && <small>{step.description}</small>}</span></li>)}</ol>;
}

export const List = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cx("firdawsi-list", className)} {...props} />,
);
List.displayName = "List";

export function Table({ caption, children, className, ...props }: HTMLAttributes<HTMLTableElement> & { caption: ReactNode }) {
  return <div className="firdawsi-table-wrap" tabIndex={0}><table className={cx("firdawsi-table", className)} {...props}><caption>{caption}</caption>{children}</table></div>;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  illustration?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ title, illustration, actions, children, className, ...props }: EmptyStateProps) {
  return <div className={cx("firdawsi-empty", className)} {...props}>{illustration && <div className="firdawsi-empty__illustration" aria-hidden="true">{illustration}</div>}<h2>{title}</h2>{children && <div>{children}</div>}{actions && <div className="firdawsi-empty__actions">{actions}</div>}</div>;
}

export interface PatternSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  kind?: Exclude<PatternKind, "corners" | "frame">;
  options?: PatternOptions;
  presetId?: PatternPresetId;
  intensity?: "quiet" | "balanced";
}

const DEFAULT_SURFACE_PRESET: PatternPresetId = "jali-8-screen";

export function PatternSurface({ kind, options, presetId, intensity = "quiet", children, className, ...props }: PatternSurfaceProps) {
  const svg = useMemo(() => {
    const settings: PatternOptions = {
      seed: "firdawsi-web-surface",
      width: 640,
      height: 320,
      density: intensity === "quiet" ? 0.3 : 0.48,
      palette: ["currentColor", "currentColor", "transparent"],
      simplificationTier: intensity === "quiet" ? "compact" : "regular",
      ...options,
      accessibility: { decorative: true },
    };
    if (presetId) return generatePreset(presetId, settings).svg;
    if (kind) return generatePattern(kind, settings).svg;
    return generatePreset(DEFAULT_SURFACE_PRESET, settings).svg;
  }, [kind, options, presetId, intensity]);
  return <div className={cx("firdawsi-pattern-surface", `firdawsi-pattern-surface--${intensity}`, className)} {...props}><div className="firdawsi-pattern-surface__pattern" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} /><div className="firdawsi-pattern-surface__content">{children}</div></div>;
}

export function OrnamentalDivider({ label, className }: { label?: string; className?: string }) {
  return <div className={cx("firdawsi-divider", className)} role={label ? "separator" : "presentation"} aria-label={label}><span /><svg viewBox="0 0 40 16" aria-hidden="true"><path d="M4 8 12 2l8 6-8 6Z M20 8l8-6 8 6-8 6Z" /></svg><span /></div>;
}

function GeometryOverlay({ kind, options }: { kind: "corners" | "frame"; options?: PatternOptions }) {
  const svg = useMemo(() => {
    const settings: PatternOptions = {
      seed: `firdawsi-web-${kind}`,
      width: 640,
      height: 320,
      density: kind === "corners" ? 0.22 : 0.28,
      palette: ["currentColor", "currentColor", "transparent"],
      simplificationTier: kind === "corners" ? "compact" : "regular",
      ...options,
      accessibility: { decorative: true },
    };
    return (kind === "frame" ? generateFrame(settings) : generateCorners(settings)).svg;
  }, [kind, options]);
  return <div className="firdawsi-geometry-overlay" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export interface FrameProps extends HTMLAttributes<HTMLDivElement> {
  options?: PatternOptions;
}

export function IslamicCorner({ options, children, className, ...props }: FrameProps) {
  return <div className={cx("firdawsi-islamic-corner", className)} {...props}><GeometryOverlay kind="corners" options={options} /><div className="firdawsi-geometry-content">{children}</div></div>;
}

export function Frame({ options, children, className, ...props }: FrameProps) {
  return <div className={cx("firdawsi-frame", className)} {...props}><GeometryOverlay kind="frame" options={options} /><div className="firdawsi-geometry-content">{children}</div></div>;
}

export interface AtmosphereProps extends HTMLAttributes<HTMLDivElement> {
  /** Named gradient token from the design system. */
  tone?: AtmosphereTone;
  /** Optional quiet pattern wash over the gradient. */
  pattern?: boolean;
  patternOptions?: PatternOptions;
  presetId?: PatternPresetId;
}

/** Atmospheric background using gradient tokens and an optional quiet PatternSurface. */
export function Atmosphere({
  tone = "courtyard-wash",
  pattern = false,
  patternOptions,
  presetId,
  children,
  className,
  style,
  ...props
}: AtmosphereProps) {
  const gradientVar = `var(--firdawsi-gradient-${tone})`;
  const content = (
    <div className="firdawsi-atmosphere__content">{children}</div>
  );
  return (
    <div
      className={cx("firdawsi-atmosphere", `firdawsi-atmosphere--${tone}`, className)}
      data-atmosphere={tone}
      style={{ backgroundImage: gradientVar, ...style }}
      {...props}
    >
      {pattern ? (
        <PatternSurface
          intensity="quiet"
          presetId={presetId}
          options={patternOptions}
          className="firdawsi-atmosphere__pattern"
        >
          {content}
        </PatternSurface>
      ) : (
        content
      )}
    </div>
  );
}

/** Alias for Atmosphere — gradient field with optional quiet pattern. */
export const Background = Atmosphere;

export interface AppHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  brand?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  /** Optional geometric frame ornament around the header band. */
  framed?: boolean;
  frameOptions?: PatternOptions;
}

export function AppHeader({
  brand,
  title,
  actions,
  framed = false,
  frameOptions,
  children,
  className,
  ...props
}: AppHeaderProps) {
  const inner = (
    <>
      <div className="firdawsi-app-header__brand">
        {brand}
        {title && <div className="firdawsi-app-header__title">{title}</div>}
      </div>
      {children && <div className="firdawsi-app-header__center">{children}</div>}
      {actions && <div className="firdawsi-app-header__actions">{actions}</div>}
    </>
  );
  return (
    <header className={cx("firdawsi-app-header", framed && "firdawsi-app-header--framed", className)} {...props}>
      {framed ? (
        <Frame options={frameOptions ?? { density: 0.22, simplificationTier: "compact" }} className="firdawsi-app-header__frame">
          <div className="firdawsi-app-header__bar">{inner}</div>
        </Frame>
      ) : (
        <div className="firdawsi-app-header__bar">{inner}</div>
      )}
    </header>
  );
}
