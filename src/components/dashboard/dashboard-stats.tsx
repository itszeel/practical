interface Stats {
  total: number
  todo: number
  inProgress: number
  done: number
}

interface DashboardStatsProps {
  stats: Stats
}

const StatItem = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className={`flex flex-col gap-1.5 rounded-xl bg-white p-5 shadow-sm dark:bg-zinc-900`}>
      <span className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>{title}</span>
      <span className='text-3xl font-bold tracking-tight'>{value}</span>
    </div>
  )
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      <StatItem title='Total Tasks' value={stats.total} />
      <StatItem title='To Do' value={stats.todo} />
      <StatItem title='In Progress' value={stats.inProgress} />
      <StatItem title='Completed' value={stats.done} />
    </div>
  )
}
