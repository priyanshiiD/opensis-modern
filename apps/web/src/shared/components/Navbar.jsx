import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, isLoading, user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">
        Student Information System
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700">{user.username}</span>
          </div>
        )}
        <div className="w-px h-5 bg-gray-200" />
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Logging out...' : 'Sign out'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
