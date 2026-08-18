import Skeleton from './Skeleton'

export default function CardSkeleton() {
  return (
    <article className="employee-card skeleton-card" aria-hidden="true">
      <Skeleton variant="avatar" />
      <div className="skeleton-card-content">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="skeleton-short" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="skeleton-medium" />
        <Skeleton variant="badge" />
      </div>
    </article>
  )
}
