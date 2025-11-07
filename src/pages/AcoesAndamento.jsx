import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function AcoesAndamento() {
  const [acoes, setAcoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    responsavel: '',
    descricao: '',
    dataInicio: new Date().toISOString().split('T')[0],
    status: 'Planejando'
  });

  useEffect(() => {
    carregarAcoes();
  }, []);

  async function carregarAcoes() {
    try {
      const q = query(collection(db, 'acoes'), orderBy('criadoEm', 'desc'));
      const snapshot = await getDocs(q);
      const acoesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAcoes(acoesData);
    } catch (error) {
      console.error('Erro ao carregar ações:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'acoes'), {
        ...formData,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      });
      
      setFormData({
        nome: '',
        responsavel: '',
        descricao: '',
        dataInicio: new Date().toISOString().split('T')[0],
        status: 'Planejando'
      });
      
      setShowForm(false);
      carregarAcoes();
      alert('Ação cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar ação:', error);
      alert('Erro ao cadastrar ação');
    }
  }

  async function atualizarStatus(id, novoStatus) {
    try {
      await updateDoc(doc(db, 'acoes', id), {
        status: novoStatus,
        atualizadoEm: new Date()
      });
      carregarAcoes();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  async function excluirAcao(id) {
    if (window.confirm('Tem certeza que deseja excluir esta ação?')) {
      try {
        await deleteDoc(doc(db, 'acoes', id));
        carregarAcoes();
        alert('Ação excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir ação:', error);
        alert('Erro ao excluir ação');
      }
    }
  }

  const acoesFiltradas = acoes.filter(acao => {
    if (filtroStatus === 'todas') return true;
    return acao.status === filtroStatus;
  });

  const corStatus = {
    'Planejando': 'bg-gray-100 text-gray-800',
    'Em andamento': 'bg-orange-100 text-orange-800',
    'Concluída': 'bg-green-100 text-green-800'
  };

  const iconStatus = {
    'Planejando': '📋',
    'Em andamento': '⚡',
    'Concluída': '✅'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">⚡ Ações em Andamento</h2>
          <p className="text-gray-600">Atividades práticas sendo executadas pela diretoria</p>
        </div>
        
        {currentUser && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            {showForm ? '✕ Cancelar' : '+ Nova Ação'}
          </button>
        )}
      </div>

      {showForm && currentUser && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Nova Ação</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nome da Ação *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ex: Campanha de adesivos informativos"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Responsável *
                </label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Ex: Assessoria de Comunicação"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Data de Início *
                </label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Descreva o que será realizado nesta ação..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Status Inicial
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option>Planejando</option>
                <option>Em andamento</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Cadastrar Ação
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroStatus('todas')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'todas' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({acoes.length})
          </button>
          <button
            onClick={() => setFiltroStatus('Planejando')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Planejando' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Planejando
          </button>
          <button
            onClick={() => setFiltroStatus('Em andamento')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Em andamento' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚡ Em Andamento
          </button>
          <button
            onClick={() => setFiltroStatus('Concluída')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Concluída' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Concluídas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando ações...</p>
        </div>
      ) : acoesFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhuma ação cadastrada ainda</p>
          {currentUser && (
            <p className="text-gray-500 mt-2">Clique em "+ Nova Ação" para começar</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acoesFiltradas.map(acao => (
            <div key={acao.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{iconStatus[acao.status]}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${corStatus[acao.status]}`}>
                  {acao.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {acao.nome}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-semibold mr-2">👤 Responsável:</span>
                  <span>{acao.responsavel}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-semibold mr-2">📅 Início:</span>
                  <span>{new Date(acao.dataInicio).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {acao.descricao}
              </p>

              {currentUser && (
                <div className="border-t pt-4 space-y-2">
                  {acao.status === 'Planejando' && (
                    <button
                      onClick={() => atualizarStatus(acao.id, 'Em andamento')}
                      className="w-full text-sm bg-orange-100 text-orange-700 px-3 py-2 rounded hover:bg-orange-200 transition font-semibold"
                    >
                      ⚡ Iniciar Ação
                    </button>
                  )}
                  {acao.status === 'Em andamento' && (
                    <button
                      onClick={() => atualizarStatus(acao.id, 'Concluída')}
                      className="w-full text-sm bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200 transition font-semibold"
                    >
                      ✅ Marcar como Concluída
                    </button>
                  )}
                  {acao.status === 'Concluída' && (
                    <button
                      onClick={() => excluirAcao(acao.id)}
                      className="w-full text-sm bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition font-semibold"
                    >
                      🗑️ Excluir Ação
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AcoesAndamento;