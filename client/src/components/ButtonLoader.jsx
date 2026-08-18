export default function ButtonLoader({ label = 'Loading' }) {
  return <span className="button-loader" role="status" aria-label={label} />
}
