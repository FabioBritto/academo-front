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
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

    const { useGetSubjectById } = useSubjectQueries();
    const { useGetActivitiesBySubject } = useActivityQueries();

    const { data: subject, isLoading: isLoadingSubject } = useGetSubjectById(Number(subjectId));
    const { data: activities = [], isLoading: isLoadingActivities } = useGetActivitiesBySubject(Number(subjectId));

    const selectedActivity = activities.find(a => a.id === selectedActivityId);

    // Função para extrair apenas a primeira linha da descrição sem tags
    const getFirstLinePlainText = (description: string): string => {
        if (!description) return '';
        
        // Pegar apenas a primeira linha
        const firstLine = description.split('\n')[0];
        
        // Remover tags HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = firstLine;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        
        // Remover formatação Markdown
        text = text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Negrito
            .replace(/\*(.*?)\*/g, '$1') // Itálico
            .replace(/<u>(.*?)<\/u>/g, '$1') // Sublinhado
            .replace(/^#+\s*/, '') // Títulos
            .replace(/^[-*]\s*/, '') // Lista com tópicos
            .replace(/^\d+\.\s*/, '') // Lista enumerada
            .trim();
        
        return text;
    };

    // Função para renderizar markdown como HTML
    const renderMarkdown = (text: string) => {
        if (!text.trim()) return { __html: '' };

        const lines = text.split('\n');
        let html = '';
        let inList = false;
        let listType: 'ul' | 'ol' | null = null;

        lines.forEach((line) => {
            const trimmed = line.trim();
            
            // Títulos
            if (trimmed.startsWith('### ')) {
                if (inList) {
                    html += listType === 'ol' ? '</ol>' : '</ul>';
                    inList = false;
                    listType = null;
                }
                html += `<h3 class="text-lg font-bold mb-2 mt-3">${trimmed.substring(4)}</h3>`;
            } else if (trimmed.startsWith('## ')) {
                if (inList) {
                    html += listType === 'ol' ? '</ol>' : '</ul>';
                    inList = false;
                    listType = null;
                }
                html += `<h2 class="text-xl font-bold mb-2 mt-3">${trimmed.substring(3)}</h2>`;
            } else if (trimmed.startsWith('# ')) {
                if (inList) {
                    html += listType === 'ol' ? '</ol>' : '</ul>';
                    inList = false;
                    listType = null;
                }
                html += `<h1 class="text-2xl font-bold mb-2 mt-3">${trimmed.substring(2)}</h1>`;
            } 
            // Lista com tópicos
            else if (trimmed.startsWith('- ')) {
                if (!inList || listType !== 'ul') {
                    if (inList && listType === 'ol') {
                        html += '</ol>';
                    }
                    html += '<ul class="list-disc ml-6 mb-2">';
                    inList = true;
                    listType = 'ul';
                }
                const content = trimmed.substring(2);
                html += `<li class="mb-1">${formatInlineMarkdown(content)}</li>`;
            }
            // Lista enumerada
            else if (/^\d+\.\s/.test(trimmed)) {
                if (!inList || listType !== 'ol') {
                    if (inList && listType === 'ul') {
                        html += '</ul>';
                    }
                    html += '<ol class="list-decimal ml-6 mb-2">';
                    inList = true;
                    listType = 'ol';
                }
                const content = trimmed.replace(/^\d+\.\s/, '');
                html += `<li class="mb-1">${formatInlineMarkdown(content)}</li>`;
            }
            // Linha vazia
            else if (!trimmed) {
                if (inList) {
                    html += listType === 'ol' ? '</ol>' : '</ul>';
                    inList = false;
                    listType = null;
                }
                html += '<br>';
            }
            // Texto normal
            else {
                if (inList) {
                    html += listType === 'ol' ? '</ol>' : '</ul>';
                    inList = false;
                    listType = null;
                }
                html += `<p class="mb-2">${formatInlineMarkdown(trimmed)}</p>`;
            }
        });

        // Fechar lista se ainda estiver aberta
        if (inList) {
            html += listType === 'ol' ? '</ol>' : '</ul>';
        }

        return { __html: html };
    };

    // Função para formatar markdown inline (negrito, itálico, sublinhado)
    const formatInlineMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    };


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
                {/* Header com Nome, Avatar e Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-academo-sage flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">
                        {subject?.name?.charAt(0).toUpperCase() || 'M'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{subject?.name || 'Matéria'}</h2>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Criado em {formatDateTime(subject.createdAt).date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Atualizado {formatDateTime(subject.updatedAt).date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                    subject.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subject.isActive ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                {/* Descrição */}
                {subject.description && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                )}
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
              <div className="flex gap-4">
                {/* Tabela - 65% */}
                <div className="w-[65%] overflow-x-auto">
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
                          onClick={() => setSelectedActivityId(activity.id)}
                          className={`hover:bg-gray-50 transition-all duration-200 group cursor-pointer ${
                            selectedActivityId === activity.id ? 'bg-academo-brown/10' : ''
                          }`}
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
                              <span className="line-clamp-1" title={getFirstLinePlainText(activity.description)}>
                                {getFirstLinePlainText(activity.description) || (
                                  <span className="text-gray-400 italic text-xs">Sem descrição</span>
                                )}
                              </span>
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

                  {/* Seção de Detalhes - 35% */}
                  <div className="w-[35%] border-l border-gray-200">
                    {selectedActivity ? (
                      <div className="p-6 h-full">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {selectedActivity.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateTime(selectedActivity.activityDate).date}</span>
                            <span className="mx-1">•</span>
                            <Clock className="w-4 h-4" />
                            <span>{formatDateTime(selectedActivity.activityDate).time}</span>
                          </div>
                        </div>

                        {selectedActivity.description ? (
                          <div className="prose prose-sm max-w-none">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h5>
                            <div 
                              className="text-sm text-gray-700"
                              dangerouslySetInnerHTML={renderMarkdown(selectedActivity.description)}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-400 italic text-sm">
                              Esta atividade não possui descrição
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 h-full flex items-center justify-center">
                        <div className="text-center">
                          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            Clique em uma atividade para ver os detalhes
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
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
    