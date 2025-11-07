import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function VozDaBase() {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    mensagem: ''
  });

  useEffect(() => {
    if (currentUser) {
      carregarMensagens();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  async function carregarMensagens() {
    try {
      const q = query(collection(db, 'vozDaBase'), orderBy('criadoEm', 'desc'));
      const snapshot = await getDocs(q);
      const mensagensData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMensagens(mensagensData);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    
    try {
      await addDoc(collection(db, 'vozDaBase'), {
        nome: formData.nome || 'Anônimo',
        mensagem: formData.mensagem,
        lida: false,
        criadoEm: new Date()
      });
      
      setFormData({
        nome: '',
        mensagem: ''
      });
      
      setSucesso(true);
      setTimeout(() => setSucesso(false), 5000);
      
      if (currentUser) {
        carregarMensagens();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
    setEnviando(false);
  }

  async function marcarComoLida(id, statusAtual) {
    try {
      await updateDoc(doc(db, 'vozDaBase', id), {
        lida: !statusAtual
      });
      carregarMensagens();
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
    }
  }

  async function excluirMensagem(id) {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await deleteDoc(doc(db, 'vozDaBase', id));
        carregarMensagens();
        alert('Mensagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        alert('Erro ao excluir mensagem');
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🗣️ Voz da Base</h2>
        <p className="text-gray-600">
          {currentUser 
            ? 'Mensagens recebidas da base' 
            : 'Canal direto para enviar sugestões, críticas e elogios para a diretoria'}
        </p>
      </div>

      {/* Formulário Público */}
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg shadow-lg p-8 mb-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Envie sua mensagem para a diretoria
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Sua voz é importante! Compartilhe suas ideias, sugestões ou preocupações.
          </p>

          {sucesso && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
              ✅ Mensagem enviada com sucesso! A diretoria receberá sua contribuição.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Seu Nome (opcional)
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite seu nome ou deixe em branco para ser anônimo"
              />
              <p className="text-sm text-gray-500 mt-1">
                Deixe em branco se preferir enviar anonimamente
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Sua Mensagem *
              </label>
              <textarea
                value={formData.mensagem}
                onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Compartilhe sua sugestão, crítica, dúvida ou elogio..."
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {enviando ? 'Enviando...' : '📤 Enviar Mensagem'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>💡 <strong>Dica:</strong> Seja claro e objetivo para que possamos entender melhor sua contribuição.</p>
          </div>
        </div>
      </div>

      {/* Painel de Administração (apenas para usuários logados) */}
      {currentUser && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Mensagens Recebidas ({mensagens.length})
            </h3>
            <div className="flex gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                {mensagens.filter(m => !m.lida).length} Não lidas
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">
                {mensagens.filter(m => m.lida).length} Lidas
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando mensagens...</p>
            </div>
          ) : mensagens.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg">Nenhuma mensagem recebida ainda</p>
              <p className="text-gray-500 mt-2">As mensagens enviadas pela base aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mensagens.map(msg => (
                <div 
                  key={msg.id} 
                  className={`rounded-lg shadow-lg p-6 transition ${
                    msg.lida ? 'bg-gray-50' : 'bg-white border-l-4 border-primary'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-800">
                          {msg.nome || 'Anônimo'}
                        </span>
                        {!msg.lida && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                            NOVA
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {msg.criadoEm?.toDate().toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {msg.mensagem}
                  </p>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => marcarComoLida(msg.id, msg.lida)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                        msg.lida
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {msg.lida ? '📭 Marcar como não lida' : '✅ Marcar como lida'}
                    </button>
                    <button
                      onClick={() => excluirMensagem(msg.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VozDaBase;