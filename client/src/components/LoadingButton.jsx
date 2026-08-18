import ButtonLoader from './ButtonLoader'

export default function LoadingButton({ isDirectoryLoading, children, className = '', disabled, ...props }) {
  return (
    <button className={`loading-button ${className}`.trim()} disabled={disabled || isDirectoryLoading} aria-busy={isDirectoryLoading} {...props}>
      {isDirectoryLoading && <ButtonLoader label="Action in progress" />}
      <span>{children}</span>
    </button>
  )
}
