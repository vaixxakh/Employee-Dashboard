import CardSkeleton from './CardSkeleton'

export default function ListSkeleton({ count = 6, label = 'Loading employees' }) {
  return (
    <div className="employee-grid" aria-label={label} aria-busy="true" role="status">
      {Array.from({ length: count }, (_, index) => <CardSkeleton key={index} />)}
    </div>
  )
}
