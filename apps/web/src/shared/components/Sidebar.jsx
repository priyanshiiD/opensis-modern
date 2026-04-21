import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/attendance', label: 'Attendance', icon: '📋' },
];

const Sidebar = () => {
  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 tracking-tight">OpenSIS</h2>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
        © 2026 OpenSIS
      </div>
    </aside>
  );
};

export default Sidebar;
