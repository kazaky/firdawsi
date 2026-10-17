/** Decorative emblem beside the accessible bilingual brand name. */
export function FirdawsiLogo({ size = 36 }: { size?: number }) {
  return <img className="firdawsi-logo" src="/firdawsi-logo.svg" width={size} height={size} alt="" aria-hidden="true" />;
}
