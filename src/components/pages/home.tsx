import React from 'react';

// Dados mockados para o dashboard
const mockData = {
  stats: {
    totalGroups: 12,
    totalSubjects: 34,
    totalActivities: 87,
    activeGroups: 10,
    completedActivities: 72,
    pendingActivities: 15
  },
  recentActivities: [
    { id: 1, name: "Prova de Matemática", subject: "Matemática", date: "2025-09-15", status: "pending" },
    { id: 2, name: "Trabalho de História", subject: "História", date: "2025-09-12", status: "completed" },
    { id: 3, name: "Lista de Exercícios", subject: "Física", date: "2025-09-10", status: "completed" },
    { id: 4, name: "Apresentação do Projeto", subject: "Geografia", date: "2025-09-18", status: "pending" },
  ],
  subjectsByGroup: [
    { group: "Grupo Alpha", subjects: 8, color: "bg-blue-500" },
    { group: "Grupo Beta", subjects: 12, color: "bg-green-500" },
    { group: "Grupo Gamma", subjects: 6, color: "bg-purple-500" },
    { group: "Grupo Delta", subjects: 8, color: "bg-orange-500" },
  ]
};

export function Home() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
        <h1 className="text-3xl font-bold text-academo-brown mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu sistema educacional</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de Grupos */}
        <div className="bg-gradient-to-br from-academo-sage to-green-400 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total de Grupos</p>
              <p className="text-3xl font-bold">{mockData.stats.totalGroups}</p>
              <p className="text-green-100 text-sm mt-1">{mockData.stats.activeGroups} ativos</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Total de Matérias */}
        <div className="bg-gradient-to-br from-academo-brown to-orange-500 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total de Matérias</p>
              <p className="text-3xl font-bold">{mockData.stats.totalSubjects}</p>
              <p className="text-orange-100 text-sm mt-1">Distribuídas em {mockData.stats.totalGroups} grupos</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Total de Atividades */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total de Atividades</p>
              <p className="text-3xl font-bold">{mockData.stats.totalActivities}</p>
              <p className="text-purple-100 text-sm mt-1">{mockData.stats.completedActivities} concluídas</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Pendentes vs Concluídas */}
        <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
          <h3 className="text-lg font-semibold text-academo-brown mb-4">Status das Atividades</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Concluídas</span>
                <span className="text-gray-900 font-medium">{mockData.stats.completedActivities}/{mockData.stats.totalActivities}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(mockData.stats.completedActivities / mockData.stats.totalActivities) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pendentes</span>
                <span className="text-gray-900 font-medium">{mockData.stats.pendingActivities}/{mockData.stats.totalActivities}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(mockData.stats.pendingActivities / mockData.stats.totalActivities) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição por Grupos */}
        <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
          <h3 className="text-lg font-semibold text-academo-brown mb-4">Matérias por Grupo</h3>
          <div className="space-y-3">
            {mockData.subjectsByGroup.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-700 font-medium">{item.group}</span>
                </div>
                <span className="text-gray-900 font-semibold">{item.subjects} matérias</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-academo-brown">Atividades Recentes</h3>
          <button className="text-academo-brown hover:text-academo-sage transition-colors font-medium text-sm">
            Ver todas
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Atividade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Matéria</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockData.recentActivities.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-academo-cream transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{activity.name}</td>
                  <td className="py-3 px-4 text-gray-600">{activity.subject}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(activity.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
        <h3 className="text-lg font-semibold text-academo-brown mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-academo-peach hover:border-academo-sage hover:bg-academo-cream transition-all group">
            <div className="bg-academo-sage bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-colors">
              <svg className="w-5 h-5 text-academo-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-academo-brown">Criar Grupo</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-academo-peach hover:border-academo-sage hover:bg-academo-cream transition-all group">
            <div className="bg-academo-brown bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-colors">
              <svg className="w-5 h-5 text-academo-brown" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-academo-brown">Adicionar Matéria</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-academo-peach hover:border-academo-sage hover:bg-academo-cream transition-all group">
            <div className="bg-purple-500 bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-colors">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-academo-brown">Nova Atividade</span>
          </button>
        </div>
      </div>
    </div>
  );
}