import ButtonLoader from './ButtonLoader'

export default function FullScreenLoader({ isLoading }) {
  return (
    <div className={`full-screen-loader ${isLoading ? 'is-visible' : 'is-hidden'}`} aria-hidden={!isLoading}>
      <div className="full-screen-loader-content">
        <span className="brand-mark">ED</span>
        <ButtonLoader label="Initializing Employee Management Dashboard" />
        <p>Preparing your dashboard</p>
      </div>
    </div>
  )
}
