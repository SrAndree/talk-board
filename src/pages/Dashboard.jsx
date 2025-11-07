import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  }

  const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/dashboard/mural-ideias', label: 'Mural de Ideias', icon: '💡' },
  { path: '/dashboard/acoes-andamento', label: 'Ações em Andamento', icon: '⚡' },
  { path: '/dashboard/voz-da-base', label: 'Voz da Base', icon: '🗣️' }, // ← ADICIONE ESTA LINHA
];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">TALK BOARD</h1>
            <p className="text-sm text-gray-600">Sintappes</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-3 font-semibold transition ${
                  location.pathname === item.path
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;