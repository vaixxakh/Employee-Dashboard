import ButtonLoader from './ButtonLoader'

export default function FullScreenLoader({ isInitializing }) {
  return (
    <div className={`full-screen-loader ${isInitializing ? 'is-visible' : 'is-hidden'}`} aria-hidden={!isInitializing}>
      <div className="full-screen-loader-content">
        <span className="brand-mark">ED</span>
        <ButtonLoader label="Initializing Employee Management Dashboard" />
        <p>Preparing your dashboard</p>
      </div>
    </div>
  )
}
