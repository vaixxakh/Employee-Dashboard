/** A size-stable placeholder. Use the variant that matches the eventual content. */
export default function Skeleton({ variant = 'text', className = '' }) {
  return <span className={`skeleton skeleton-${variant} ${className}`.trim()} aria-hidden="true" />
}
