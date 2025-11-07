import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import MuralIdeias from './pages/MuralIdeias';
import AcoesAndamento from './pages/AcoesAndamento';
import VozDaBase from './pages/VozDaBase'; // ← ADICIONE ESTA LINHA
import Home from './pages/Home';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/voz-da-base" element={<VozDaBase />} /> {/* ← ADICIONE ESTA LINHA (rota pública) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="mural-ideias" element={<MuralIdeias />} />
            <Route path="acoes-andamento" element={<AcoesAndamento />} />
            <Route path="voz-da-base" element={<VozDaBase />} /> {/* ← ADICIONE ESTA LINHA (rota admin) */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;