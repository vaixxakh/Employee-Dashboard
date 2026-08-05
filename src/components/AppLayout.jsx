import Header from './Header'

export default function AppLayout({ children, totalEmployees }) {
  return (
    <div className="app-shell">
      <Header totalEmployees={totalEmployees} />
      <main>{children}</main>
    </div>
  )
}
