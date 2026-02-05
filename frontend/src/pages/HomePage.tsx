import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-basketball-orange to-orange-600 text-white rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold mb-4">🏀 Basketball Statistics Platform</h1>
        <p className="text-xl text-orange-100 mb-8">
          Advanced analytics and comprehensive statistics for basketball enthusiasts
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/players"
            className="bg-white text-basketball-orange px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors shadow-lg"
          >
            View Players
          </Link>
          <Link
            to="/stats"
            className="bg-basketball-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors shadow-lg"
          >
            View Statistics
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/players" className="card hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-bold mb-2">Players</h3>
          <p className="text-gray-600">
            Browse player profiles, stats, and career highlights
          </p>
        </Link>

        <Link to="/teams" className="card hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Teams</h3>
          <p className="text-gray-600">
            Explore team rosters, standings, and performance
          </p>
        </Link>

        <Link to="/games" className="card hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">Games</h3>
          <p className="text-gray-600">
            View game schedules, results, and box scores
          </p>
        </Link>

        <Link to="/stats" className="card hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Advanced Stats</h3>
          <p className="text-gray-600">
            Dive into advanced metrics like PER, TS%, and ORtg
          </p>
        </Link>
      </section>

      {/* Advanced Metrics Info */}
      <section className="card bg-gradient-to-br from-primary-50 to-blue-50">
        <h2 className="text-2xl font-bold mb-4">Advanced Metrics Explained</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-primary-700 mb-2">True Shooting % (TS%)</h4>
            <p className="text-sm text-gray-600">
              Measures shooting efficiency accounting for 2PT, 3PT, and FT
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 mb-2">Player Efficiency Rating (PER)</h4>
            <p className="text-sm text-gray-600">
              Comprehensive per-minute rating of player performance
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 mb-2">Offensive Rating (ORtg)</h4>
            <p className="text-sm text-gray-600">
              Points produced per 100 possessions
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-primary-700 mb-2">Defensive Rating (DRtg)</h4>
            <p className="text-sm text-gray-600">
              Points allowed per 100 possessions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
