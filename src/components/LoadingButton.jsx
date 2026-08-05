import ButtonLoader from './ButtonLoader'

/** Reusable button for API actions; it cannot be clicked again while pending. */
export default function LoadingButton({ isLoading, children, className = '', disabled, ...props }) {
  return (
    <button className={`loading-button ${className}`.trim()} disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
      {isLoading && <ButtonLoader label="Action in progress" />}
      <span>{children}</span>
    </button>
  )
}
