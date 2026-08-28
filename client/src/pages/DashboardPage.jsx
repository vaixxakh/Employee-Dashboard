import React from 'react'
import { Link } from 'react-router-dom'
import EmployeeList from '../components/EmployeeList'
import MetricCard from '../components/MetricCard'
import AnimatedCounter from '../components/AnimatedCounter'
import PageLoader from '../components/PageLoader'
import { formatSalary } from '../utils/formatSalary'
import { getEmployees, getStatistics } from '../services/userService'
import { mapApiEmployeeToFrontend } from '../mappers/userMapper'

export default function DashboardPage() {
  const [stats, setStats] = React.useState(null);
  const [statsLoading, setStatsLoading] = React.useState(true);

  const [recentEmployees, setRecentEmployees] = React.useState([]);
  const [isRecentLoading, setIsRecentLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const data = await getStatistics();
        if (!cancelled) {
          setStats(data);
        }
      } catch {
        if (!cancelled) {
          setStats({
            totalEmployees: 0,
            activeEmployees: 0,
            inactiveEmployees: 0,
            totalSalary: 0,
            averageSalary: 0,
            highestSalary: 0,
            lowestSalary: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    fetchStats();

    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchRecentEmployees() {
      try {
        const result = await getEmployees({}, { page: 1, limit: 4, sort: '-createdAt' });
        if (!cancelled) {
          setRecentEmployees(result.data.map(mapApiEmployeeToFrontend));
        }
      } catch {
        if (!cancelled) {
          setRecentEmployees([]);
        }
      } finally {
        if (!cancelled) {
          setIsRecentLoading(false);
        }
      }
    }

    fetchRecentEmployees();

    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">WORKSPACE OVERVIEW</p>
          <h1>Good morning, team.</h1>
          <p>Here is a snapshot of your people operations today.</p>
        </div>
        <Link className="primary-button" to="/employees">View employees</Link>
      </section>

      <section className="metrics" aria-label="Dashboard statistics">
        {statsLoading ? (
          <>
              <MetricCard label="Total employees" value="—" />
              <MetricCard label="Active employees" value="—" />
              <MetricCard label="Inactive employees" value="—" />
              <MetricCard label="Average salary" value="—" />
              <MetricCard label="Total salary" value="—" />
              <MetricCard label="Highest salary" value="—" />
              <MetricCard label="Lowest salary" value="—" />
          </>
        ) : (
          <>
            <MetricCard label="Total employees" value={<AnimatedCounter end={stats.totalEmployees} />} />
            <MetricCard label="Active employees" value={<AnimatedCounter end={stats.activeEmployees} />} />
            <MetricCard label="Inactive employees" value={<AnimatedCounter end={stats.inactiveEmployees} />} />
            <MetricCard label="Average salary" value={<AnimatedCounter end={stats.averageSalary} format={formatSalary} />} />
            <MetricCard label="Lowest salary" value={<AnimatedCounter end={stats.lowestSalary} format={formatSalary} />} />
            <MetricCard label="Highest salary" value={<AnimatedCounter end={stats.highestSalary} format={formatSalary} />} />
            <MetricCard label="Total salary" value={<AnimatedCounter end={stats.totalSalary} format={formatSalary} />} />
          </>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TEAM DIRECTORY</p>
            <h2>Recently added employees</h2>
          </div>
          <Link to="/employees">See all -&gt;</Link>
        </div>
        {isRecentLoading && <PageLoader label="Loading employee overview" />}
        <EmployeeList employees={recentEmployees} isDirectoryLoading={isRecentLoading} />
      </section>
    </>
  )
}