/**
 * Loading Skeleton components for graceful loading states
 */

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-6 border animate-pulse" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="w-16 h-4 rounded skeleton" />
      </div>
      <div className="w-24 h-6 rounded skeleton mb-2" />
      <div className="w-32 h-4 rounded skeleton" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl p-6 border animate-pulse" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="w-32 h-5 rounded skeleton mb-4" />
      <div className="h-64 rounded-xl skeleton" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="w-full h-4 rounded skeleton" />
        </td>
      ))}
    </tr>
  );
}

export function ListSkeleton({ items = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
          <div className="w-10 h-10 rounded-full skeleton shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="w-3/4 h-4 rounded skeleton mb-2" />
            <div className="w-1/2 h-3 rounded skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded skeleton"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-48 h-8 rounded skeleton" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
