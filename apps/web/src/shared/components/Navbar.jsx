import { useNavigate } from 'react-router-dom';
import { clearAuthTokens } from '../../features/auth/storage/tokenStorage.js';

const Navbar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthTokens();
    navigate('/login');
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-lg font-semibold text-gray-700">
        School Management System
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
