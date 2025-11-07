import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

function Home() {
  const [stats, setStats] = useState({
    totalIdeias: 0,
    emAndamento: 0,
    concluidas: 0
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  async function carregarEstatisticas() {
    try {
      const snapshot = await getDocs(collection(db, 'ideias'));
      const ideias = snapshot.docs.map(doc => doc.data());
      
      setStats({
        totalIdeias: ideias.length,
        emAndamento: ideias.filter(i => i.status === 'Em andamento').length,
        concluidas: ideias.filter(i => i.status === 'Concluída').length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header - ÚNICO */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">TALK BOARD</h1>
            <p className="text-sm text-gray-600">Sintappes</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/voz-da-base"
              className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              🗣️ Voz da Base
            </Link>
            <Link
              to="/login"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Login Diretoria
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Gestão Sindical Participativa
          </h2>
          <p className="text-xl text-gray-600 italic">
            "A força da base move o sindicato"
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">💡</div>
            <p className="text-3xl font-bold text-primary mb-2">{stats.totalIdeias}</p>
            <p className="text-gray-600">Ideias Recebidas</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <p className="text-3xl font-bold text-secondary mb-2">{stats.emAndamento}</p>
            <p className="text-gray-600">Ações em Andamento</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.concluidas}</p>
            <p className="text-gray-600">Ações Concluídas</p>
          </div>
        </div>

        {/* Informativo */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Acompanhe a Gestão em Tempo Real
          </h3>
          <p className="text-gray-600 mb-4">
            O Talk Board é o sistema de transparência e participação do Sintappes.
            Aqui você pode acompanhar todas as ideias, ações e conquistas do sindicato.
          </p>
          <p className="text-gray-600">
            Todas as sugestões da base são registradas e acompanhadas até sua conclusão!
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;