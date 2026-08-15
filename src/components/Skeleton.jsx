
export default function Skeleton({ variant = 'text', className = '' }) {
  return <span className={`skeleton skeleton-${variant} ${className}`.trim()} aria-hidden="true" />
}
