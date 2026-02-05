export default function StatsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Statistics Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">League Leaders</h3>
          <p className="text-gray-600">Top performers in various statistical categories</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Advanced Metrics</h3>
          <p className="text-gray-600">TS%, PER, ORtg, DRtg comparisons</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Performance Charts</h3>
          <p className="text-gray-600">Visual trends and comparisons</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Season Comparisons</h3>
          <p className="text-gray-600">Year-over-year analysis</p>
        </div>
      </div>

      <div className="card bg-primary-50">
        <p className="text-sm text-gray-600">
          Full statistics dashboard with interactive charts and visualizations coming soon...
        </p>
      </div>
    </div>
  );
}
