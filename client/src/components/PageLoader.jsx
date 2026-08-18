import ButtonLoader from './ButtonLoader'

export default function PageLoader({ label = 'Loading employees' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <ButtonLoader label={label} />
      <span>{label}</span>
    </div>
  )
}
