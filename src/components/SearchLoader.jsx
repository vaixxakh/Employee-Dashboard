import ListSkeleton from './ListSkeleton'

export default function SearchLoader({ count }) {
  return <ListSkeleton count={count} label="Searching employees" />
}
