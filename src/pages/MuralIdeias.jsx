import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function MuralIdeias() {
  const [ideias, setIdeias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const { currentUser } = useAuth();

  // Formulário
  const [formData, setFormData] = useState({
    autor: '',
    tema: 'Embarque',
    descricao: '',
    prioridade: 'Média',
    status: 'Nova'
  });

  // Carregar ideias do Firebase
  useEffect(() => {
    carregarIdeias();
  }, []);

  async function carregarIdeias() {
    try {
      const q = query(collection(db, 'ideias'), orderBy('criadoEm', 'desc'));
      const snapshot = await getDocs(q);
      const ideiasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeias(ideiasData);
    } catch (error) {
      console.error('Erro ao carregar ideias:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'ideias'), {
        ...formData,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      });
      
      // Limpar formulário
      setFormData({
        autor: '',
        tema: 'Embarque',
        descricao: '',
        prioridade: 'Média',
        status: 'Nova'
      });
      
      setShowForm(false);
      carregarIdeias();
      alert('Ideia cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar ideia:', error);
      alert('Erro ao cadastrar ideia');
    }
  }

  async function atualizarStatus(id, novoStatus) {
    try {
      await updateDoc(doc(db, 'ideias', id), {
        status: novoStatus,
        atualizadoEm: new Date()
      });
      carregarIdeias();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  async function excluirIdeia(id) {
  if (window.confirm('Tem certeza que deseja excluir esta ideia?')) {
    try {
      await deleteDoc(doc(db, 'ideias', id));
      carregarIdeias();
      alert('Ideia excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir ideia:', error);
      alert('Erro ao excluir ideia');
    }
  }
}

  // Filtrar ideias
  const ideiasFiltradas = ideias.filter(ideia => {
    if (filtroStatus === 'todas') return true;
    return ideia.status === filtroStatus;
  });

  // Cores de prioridade
  const corPrioridade = {
    'Alta': 'bg-red-100 text-red-800 border-red-300',
    'Média': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Baixa': 'bg-green-100 text-green-800 border-green-300'
  };

  // Cores de status
  const corStatus = {
    'Nova': 'bg-blue-100 text-blue-800',
    'Em análise': 'bg-purple-100 text-purple-800',
    'Em andamento': 'bg-orange-100 text-orange-800',
    'Concluída': 'bg-green-100 text-green-800'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">💡 Mural de Ideias</h2>
          <p className="text-gray-600">Todas as sugestões e demandas da base</p>
        </div>
        
        {currentUser && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {showForm ? '✕ Cancelar' : '+ Nova Ideia'}
          </button>
        )}
      </div>

      {/* Formulário de Nova Ideia */}
      {showForm && currentUser && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Nova Ideia</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nome do Autor
                </label>
                <input
                  type="text"
                  value={formData.autor}
                  onChange={(e) => setFormData({...formData, autor: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tema
                </label>
                <select
                  value={formData.tema}
                  onChange={(e) => setFormData({...formData, tema: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Embarque</option>
                  <option>Segurança</option>
                  <option>Benefícios</option>
                  <option>Formação</option>
                  <option>Comunicação</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Descreva a ideia ou demanda..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({...formData, prioridade: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Alta</option>
                  <option>Média</option>
                  <option>Baixa</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Status Inicial
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Nova</option>
                  <option>Em análise</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Cadastrar Ideia
            </button>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroStatus('todas')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'todas' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({ideias.length})
          </button>
          <button
            onClick={() => setFiltroStatus('Nova')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Nova' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Novas
          </button>
          <button
            onClick={() => setFiltroStatus('Em análise')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Em análise' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Em Análise
          </button>
          <button
            onClick={() => setFiltroStatus('Em andamento')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Em andamento' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Em Andamento
          </button>
          <button
            onClick={() => setFiltroStatus('Concluída')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filtroStatus === 'Concluída' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Concluídas
          </button>
        </div>
      </div>

      {/* Lista de Ideias */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando ideias...</p>
        </div>
      ) : ideiasFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhuma ideia cadastrada ainda</p>
          {currentUser && (
            <p className="text-gray-500 mt-2">Clique em "+ Nova Ideia" para começar</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {ideiasFiltradas.map(ideia => (
            <div key={ideia.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${corPrioridade[ideia.prioridade]}`}>
                      {ideia.prioridade}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${corStatus[ideia.status]}`}>
                      {ideia.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {ideia.criadoEm?.toDate().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {ideia.tema}
                  </h3>
                  
                  <p className="text-gray-600 mb-2">{ideia.descricao}</p>
                  
                  <p className="text-sm text-gray-500">
                    Sugerido por: <span className="font-semibold">{ideia.autor}</span>
                  </p>
                </div>
              </div>

              {/* Botões de atualização de status (apenas para usuários logados) */}
              {currentUser && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  {ideia.status !== 'Concluída' && (
                    <div className="flex gap-2 items-center">
                      <p className="text-sm text-gray-600 mr-2">Atualizar status:</p>
                      {ideia.status === 'Nova' && (
                        <button
                          onClick={() => atualizarStatus(ideia.id, 'Em análise')}
                          className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition"
                        >
                          → Em análise
                        </button>
                      )}
                      {ideia.status === 'Em análise' && (
                        <button
                          onClick={() => atualizarStatus(ideia.id, 'Em andamento')}
                          className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded hover:bg-orange-200 transition"
                        >
                          → Em andamento
                        </button>
                      )}
                      {ideia.status === 'Em andamento' && (
                        <button
                          onClick={() => atualizarStatus(ideia.id, 'Concluída')}
                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                        >
                          → Concluída
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Botão de excluir (sempre visível para admin) */}
                  <button
                    onClick={() => excluirIdeia(ideia.id)}
                    className="w-full text-sm bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition font-semibold"
                  >
                    🗑️ Excluir Ideia
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MuralIdeias;