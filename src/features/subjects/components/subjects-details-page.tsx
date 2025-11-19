import { useParams, useNavigate } from "@tanstack/react-router";
import { useSubjectQueries } from "../services";
import { useActivityQueries } from "../../activities/services/activity/index";
import { ArrowLeft, Calendar, Clock, BookOpen, PlusIcon } from "lucide-react";
import { useState } from "react";
import { formatDateTime } from "../../../shared/utils/formatter";
import { CreateActivityModal } from "../../activities/components/create-activity-modal";

export default function SubjectsDetailsPage() {
    const { subjectId } = useParams({ from: '/app/materias/$subjectId' });
    const navigate = useNavigate();

    const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);

    const { useGetSubjectById } = useSubjectQueries();
    const { useGetActivitiesBySubject } = useActivityQueries();

    const { data: subject, isLoading: isLoadingSubject } = useGetSubjectById(Number(subjectId));
    const { data: activities = [], isLoading: isLoadingActivities } = useGetActivitiesBySubject(Number(subjectId));


    const handleGoBack = () => {
        navigate({ to: '/app/materias' });
    };

    return (
        <div className="space-y-6">
          {/* Header com botão voltar */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voltar para matérias"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Detalhes da Matéria</h1>
              <p className="text-gray-600">Visualize as informações da matéria</p>
            </div>
          </div>
          
          {/* Informações da Matéria */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16">
                  <div className="h-16 w-16 rounded-full bg-academo-sage flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {subject?.name?.charAt(0).toUpperCase() || 'M'}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{subject?.name || 'Matéria'}</h2>
                </div>
              </div>
              
              {/* Status Badge */}
              {subject && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subject.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subject.isActive ? 'Ativo' : 'Inativo'}
                </div>
              )}
            </div>

            {isLoadingSubject ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Carregando detalhes da matéria...</span>
                </div>
              </div>
            ) : subject ? (
              <div className="space-y-4">
                {/* Descrição */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-600">
                    {subject.description || (
                      <span className="italic text-gray-400">Sem descrição</span>
                    )}
                  </p>
                </div>

                {/* Informações de Data e Hora */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data de Criação */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-academo-brown/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-academo-brown" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Criado em
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {formatDateTime(subject.createdAt).date}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{formatDateTime(subject.createdAt).time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data de Atualização */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-academo-sage/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-academo-sage" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Atualizado em
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {formatDateTime(subject.updatedAt).date}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{formatDateTime(subject.updatedAt).time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Matéria não encontrada
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  A matéria que você está procurando não existe ou foi removida.
                </p>
              </div>
            )}
          </div>

          {/* Lista de Atividades */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Atividades da Matéria</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Lista de atividades associadas a esta matéria
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateActivityModalOpen(true)}
                  className="bg-academo-brown hover:bg-academo-sage text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center"
                  title="Adicionar nova atividade"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Nova Atividade
                </button>
              </div>
            </div>

            {isLoadingActivities ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Carregando atividades...</span>
                </div>
              </div>
            ) : activities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-academo-brown to-academo-sage">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                        Data Notificação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {activities.map((activity) => (
                      <tr 
                        key={activity.id}
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        {/* Data */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatDateTime(activity.activityDate).date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(activity.activityDate).time}
                          </div>
                        </td>

                        {/* Nome */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-academo-brown transition-colors">
                            {activity.name}
                          </div>
                        </td>

                        {/* Tipo de Atividade */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {activity.ActivityType ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {activity.ActivityType}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic text-xs">Sem tipo</span>
                            )}
                          </div>
                        </td>

                        {/* Descrição */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 max-w-xs">
                            {activity.description ? (
                              <span className="line-clamp-2">{activity.description}</span>
                            ) : (
                              <span className="text-gray-400 italic text-xs">
                                Sem descrição
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Valor */}
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm font-semibold text-gray-900">
                            {activity.value !== null && activity.value !== undefined && activity.value !== 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {activity.value}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic text-xs">-</span>
                            )}
                          </div>
                        </td>

                        {/* Data de Notificação */}
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-700 max-w-xs mx-auto">
                            {activity.notificationDate ? (
                              <>
                                {formatDateTime(activity.notificationDate).date}
                                <br />
                                <span className="text-xs text-gray-500">
                                  {formatDateTime(activity.notificationDate).time}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-400 italic text-xs">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma atividade encontrada
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Esta matéria ainda não possui atividades associadas.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Create Activity Modal */}
          <CreateActivityModal 
            isOpen={isCreateActivityModalOpen}
            onClose={() => setIsCreateActivityModalOpen(false)}
            subjectId={Number(subjectId)}
          />
        </div>
    );
}
    