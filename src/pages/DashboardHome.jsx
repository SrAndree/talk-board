import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

function DashboardHome() {
  const [stats, setStats] = useState({
    totalIdeias: 0,
    ideiasEmAndamento: 0,
    ideiasConcluidas: 0,
    totalAcoes: 0,
    acoesEmAndamento: 0,
    acoesConcluidas: 0,
    totalMensagens: 0,
    mensagensNaoLidas: 0
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  async function carregarEstatisticas() {
    try {
      // Carregar ideias
      const ideiasSnapshot = await getDocs(collection(db, 'ideias'));
      const ideias = ideiasSnapshot.docs.map(doc => doc.data());
      
      // Carregar ações
      const acoesSnapshot = await getDocs(collection(db, 'acoes'));
      const acoes = acoesSnapshot.docs.map(doc => doc.data());
      
      // Carregar mensagens
      const mensagensSnapshot = await getDocs(collection(db, 'vozDaBase'));
      const mensagens = mensagensSnapshot.docs.map(doc => doc.data());
      
      setStats({
        totalIdeias: ideias.length,
        ideiasEmAndamento: ideias.filter(i => i.status === 'Em andamento').length,
        ideiasConcluidas: ideias.filter(i => i.status === 'Concluída').length,
        totalAcoes: acoes.length,
        acoesEmAndamento: acoes.filter(a => a.status === 'Em andamento').length,
        acoesConcluidas: acoes.filter(a => a.status === 'Concluída').length,
        totalMensagens: mensagens.length,
        mensagensNaoLidas: mensagens.filter(m => !m.lida).length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Seção: Ideias */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">💡 Mural de Ideias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Ideias</p>
                <p className="text-3xl font-bold text-primary">{stats.totalIdeias}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">💡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Em Andamento</p>
                <p className="text-3xl font-bold text-orange-600">{stats.ideiasEmAndamento}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Concluídas</p>
                <p className="text-3xl font-bold text-green-600">{stats.ideiasConcluidas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Ações */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">⚡ Ações em Andamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Ações</p>
                <p className="text-3xl font-bold text-secondary">{stats.totalAcoes}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Em Execução</p>
                <p className="text-3xl font-bold text-orange-600">{stats.acoesEmAndamento}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Finalizadas</p>
                <p className="text-3xl font-bold text-green-600">{stats.acoesConcluidas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Voz da Base */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">🗣️ Voz da Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Mensagens</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalMensagens}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Não Lidas</p>
                <p className="text-3xl font-bold text-primary">{stats.mensagensNaoLidas}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📬</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem */}
      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Sistema Completo! 🎉
        </h3>
        <p className="text-gray-600 mb-4">
          Use o menu acima para navegar entre as funcionalidades:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>Dashboard:</strong> Visão geral de todas as estatísticas</li>
          <li><strong>Mural de Ideias:</strong> Gerenciar sugestões e demandas da base</li>
          <li><strong>Ações em Andamento:</strong> Acompanhar atividades práticas da diretoria</li>
          <li><strong>Voz da Base:</strong> Receber e gerenciar mensagens dos trabalhadores</li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardHome;