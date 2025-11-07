import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 6) {
      return setError('A senha deve ter no mínimo 6 caracteres');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await signup(email, password);
      setSuccess('Usuário criado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError('Erro ao criar usuário: ' + error.message);
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Criar Admin</h1>
          <p className="text-gray-600">Registrar primeiro usuário</p>
          <p className="text-sm text-orange-600 mt-2">⚠️ Página temporária - delete após criar o admin</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@sintappes.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Usuário Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-primary hover:underline">
            Já tenho conta - Fazer Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;