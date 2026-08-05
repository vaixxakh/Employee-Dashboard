import ListSkeleton from './ListSkeleton'

export default function FilterLoader({ count }) {
  return <ListSkeleton count={count} label="Filtering employees" />
}
