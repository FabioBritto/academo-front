import { useMemo, useState, useRef, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useGroupQueries } from '../../groups/services';
import { useSubjectQueries } from '../../subjects/services';
import { useActivityQueries } from '../../activities/services/activity';
import { subjectsApi } from '../../subjects/types/subject';
import { CreateGroupModal } from '../../groups/components/create-group-modal';
import { CreateActivityModal } from '../../activities/components/create-activity-modal';
import { CreateSubjectModal } from '../../subjects/components/create-subject-modal';
import { formatDateTime } from '../../../shared/utils/formatter';

// Cores para os grupos (cicla entre as cores)
const groupColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500',
];

export function Home() {
  const navigate = useNavigate();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscar dados reais
  const { useGetGroups } = useGroupQueries();
  const { useGetSubjects } = useSubjectQueries();
  const { useGetActivities } = useActivityQueries();

  const { data: groups = [], isLoading: isLoadingGroups } = useGetGroups();
  const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjects();
  const { data: activities = [], isLoading: isLoadingActivities } = useGetActivities();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    };

    if (isSubjectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubjectDropdownOpen]);

  // Buscar matérias por grupo em paralelo
  const subjectsQueries = useQueries({
    queries: groups.map((group) => ({
      queryKey: ['subjects', 'by-group', group.id],
      queryFn: () => subjectsApi.getSubjectsByGroup(group.id),
      enabled: !!group.id,
    })),
  });

  // Calcular estatísticas
  const stats = useMemo(() => {
    const activeGroups = groups.filter(g => g.isActive).length;
    const totalGroups = groups.length;
    const totalSubjects = subjects.length;
    const totalActivities = activities.length;

    // Atividades concluídas são aquelas com data passada
    const now = new Date();
    const completedActivities = activities.filter(activity => {
      const activityDate = new Date(activity.activityDate);
      return activityDate < now;
    }).length;
    const pendingActivities = totalActivities - completedActivities;

    return {
      totalGroups,
      totalSubjects,
      totalActivities,
      activeGroups,
      completedActivities,
      pendingActivities,
    };
  }, [groups, subjects, activities]);

  // Matérias por grupo
  const subjectsByGroup = useMemo(() => {
    return groups.map((group, index) => {
      const query = subjectsQueries[index];
      const subjectCount = query?.data?.length || 0;
      return {
        group: group.name,
        subjects: subjectCount,
        color: groupColors[index % groupColors.length],
      };
    });
  }, [groups, subjectsQueries]);

  // Atividades recentes (últimas 5, ordenadas por data)
  const recentActivities = useMemo(() => {
    return activities
      .sort((a, b) => {
        const dateA = new Date(a.activityDate).getTime();
        const dateB = new Date(b.activityDate).getTime();
        return dateB - dateA; // Mais recentes primeiro
      })
      .slice(0, 5)
      .map(activity => {
        const activityDate = new Date(activity.activityDate);
        const now = new Date();
        const isCompleted = activityDate < now;

        // Garantir que o nome da matéria seja exibido corretamente
        const subjectName = activity.subjectName?.trim() || 'Sem matéria';

        return {
          id: activity.id,
          name: activity.name,
          subject: subjectName,
          date: activity.activityDate,
          status: isCompleted ? 'completed' : 'pending',
        };
      });
  }, [activities]);

  const isLoading = isLoadingGroups || isLoadingSubjects || isLoadingActivities;

  const handleCreateActivity = () => {
    if (subjects.length === 0) {
      navigate({ to: '/app/materias' });
      return;
    }
    setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
  };

  const handleSelectSubject = (subjectId: number) => {
    setSelectedSubjectId(subjectId);
    setIsSubjectDropdownOpen(false);
    setIsCreateActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setIsCreateActivityModalOpen(false);
    setSelectedSubjectId(null);
  };

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleAddSubject = () => {
    setIsCreateSubjectModalOpen(true);
  };

  const handleCloseSubjectModal = () => {
    setIsCreateSubjectModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
        <h1 className="text-3xl font-bold text-academo-brown mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu sistema educacional</p>
      </div>

      {/* Ações Rápidas - Movido para o topo */}
      <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
        <h3 className="text-lg font-semibold text-academo-brown mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleCreateGroup}
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-academo-peach hover:border-academo-sage hover:bg-academo-cream transition-all group"
          >
            <div className="bg-academo-sage bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-colors">
              <svg className="w-5 h-5 text-academo-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-academo-brown">Novo Grupo</span>
          </button>
          
          <button 
            onClick={handleAddSubject}
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-academo-peach hover:border-academo-sage hover:bg-academo-cream transition-all group"
          >
            <div className="bg-academo-brown bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-colors">
              <svg className="w-5 h-5 text-academo-brown" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-academo-brown">Nova Matéria</span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleCreateActivity}
              className="w-full flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-academo-peach hover:border-academo-sage hover:bg-academo-cream transition-all group"
            >
              <div className="bg-purple-500 bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-medium text-academo-brown">Nova Atividade</span>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown de Seleção de Matéria */}
            {isSubjectDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border-2 border-academo-peach rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-academo-brown to-academo-sage px-4 py-3">
                  <h4 className="text-white font-semibold text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Selecione uma matéria
                  </h4>
                </div>
                {subjects.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-2">
                      {subjects.map((subject, index) => (
                        <button
                          key={subject.id}
                          onClick={() => handleSelectSubject(subject.id)}
                          className="w-full mb-2 last:mb-0 group"
                        >
                          <div className="bg-gradient-to-r from-white to-academo-cream border-2 border-academo-peach rounded-lg p-4 hover:border-academo-sage hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                  index % 4 === 0 ? 'bg-blue-100 text-blue-600' :
                                  index % 4 === 1 ? 'bg-green-100 text-green-600' :
                                  index % 4 === 2 ? 'bg-purple-100 text-purple-600' :
                                  'bg-orange-100 text-orange-600'
                                }`}>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-academo-brown transition-colors">
                                    {subject.name}
                                  </p>
                                  {subject.group && (
                                    <div className="flex items-center mt-1">
                                      <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      <span className="text-xs text-gray-500 truncate">{subject.group.name}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-3">
                                <div className="w-8 h-8 rounded-full bg-academo-sage bg-opacity-10 group-hover:bg-opacity-20 flex items-center justify-center transition-colors">
                                  <svg className="w-4 h-4 text-academo-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Nenhuma matéria cadastrada</p>
                    <p className="text-xs text-gray-500">Adicione uma matéria primeiro para criar atividades</p>
                    <button
                      onClick={() => {
                        setIsSubjectDropdownOpen(false);
                        handleAddSubject();
                      }}
                      className="mt-4 text-sm text-academo-brown hover:text-academo-sage font-medium underline"
                    >
                      Ir para Matérias
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academo-brown"></div>
        </div>
      ) : (
        <>
          {/* Cards de Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total de Grupos */}
            <div className="bg-gradient-to-br from-academo-sage to-green-400 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total de Grupos</p>
                  <p className="text-3xl font-bold">{stats.totalGroups}</p>
                  <p className="text-green-100 text-sm mt-1">{stats.activeGroups} ativos</p>
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
                  <p className="text-3xl font-bold">{stats.totalSubjects}</p>
                  <p className="text-orange-100 text-sm mt-1">Distribuídas em {stats.totalGroups} grupos</p>
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
                  <p className="text-3xl font-bold">{stats.totalActivities}</p>
                  <p className="text-purple-100 text-sm mt-1">{stats.completedActivities} concluídas</p>
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
              {stats.totalActivities > 0 ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Concluídas</span>
                      <span className="text-gray-900 font-medium">{stats.completedActivities}/{stats.totalActivities}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(stats.completedActivities / stats.totalActivities) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Pendentes</span>
                      <span className="text-gray-900 font-medium">{stats.pendingActivities}/{stats.totalActivities}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(stats.pendingActivities / stats.totalActivities) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma atividade cadastrada ainda</p>
              )}
            </div>

            {/* Distribuição por Grupos */}
            <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
              <h3 className="text-lg font-semibold text-academo-brown mb-4">Matérias por Grupo</h3>
              {subjectsByGroup.length > 0 ? (
                <div className="space-y-3">
                  {subjectsByGroup.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-gray-700 font-medium">{item.group}</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{item.subjects} matérias</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum grupo cadastrado ainda</p>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-lg shadow-sm border border-academo-peach p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-academo-brown">Atividades Recentes</h3>
            </div>
            
            {recentActivities.length > 0 ? (
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
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-gray-100 hover:bg-academo-cream transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{activity.name}</td>
                        <td className="py-3 px-4 text-gray-600">{activity.subject}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDateTime(activity.date).date}
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
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma atividade cadastrada ainda</p>
            )}
          </div>
        </>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />

      {/* Create Activity Modal */}
      {selectedSubjectId && (
        <CreateActivityModal 
          isOpen={isCreateActivityModalOpen}
          onClose={handleCloseActivityModal}
          subjectId={selectedSubjectId}
        />
      )}

      {/* Create Subject Modal */}
      <CreateSubjectModal 
        isOpen={isCreateSubjectModalOpen}
        onClose={handleCloseSubjectModal}
      />
    </div>
  );
}
