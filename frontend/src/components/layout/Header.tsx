import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-basketball-orange to-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-3xl">🏀</div>
            <div>
              <h1 className="text-2xl font-bold">Basketball Stats</h1>
              <p className="text-xs text-orange-100">Advanced Analytics Platform</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              to="/players"
              className="hover:text-orange-100 transition-colors font-medium"
            >
              Players
            </Link>
            <Link
              to="/teams"
              className="hover:text-orange-100 transition-colors font-medium"
            >
              Teams
            </Link>
            <Link
              to="/games"
              className="hover:text-orange-100 transition-colors font-medium"
            >
              Games
            </Link>
            <Link
              to="/stats"
              className="hover:text-orange-100 transition-colors font-medium"
            >
              Statistics
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
