import { useParams, useNavigate } from "@tanstack/react-router";
import { useSubjectQueries, useSubjectMutations } from "../services";
import { useActivityQueries, useActivityMutations } from "../../activities/services/activity/index";
import { useFileQueries } from "../../files/services/file";
import { ArrowLeft, Calendar, Clock, BookOpen, PlusIcon, FileText, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDateTime } from "../../../shared/utils/formatter";
import { CreateActivityModal } from "../../activities/components/create-activity-modal";
import { ConfirmDeleteActivityModal } from "../../activities/components/confirm-delete-activity-modal";
import { UploadFileModal } from "../../files/components/upload-file-modal";
import { UpdateSubjectModal } from "./update-subject-modal";
import { ConfirmDeleteSubjectModal } from "./confirm-delete-subject-modal";
import { toast } from "sonner";
import type { Activity } from "../../activities/types/activity";

export default function SubjectsDetailsPage() {
    const { subjectId } = useParams({ from: '/app/materias/$subjectId' });
    const navigate = useNavigate();

    const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
    const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
    const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
    const [activeTab, setActiveTab] = useState<'activities' | 'files'>('activities');
    const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
    const [selectedFileUuid, setSelectedFileUuid] = useState<string | null>(null);
    const [isUpdateSubjectModalOpen, setIsUpdateSubjectModalOpen] = useState(false);
    const [isDeleteSubjectModalOpen, setIsDeleteSubjectModalOpen] = useState(false);

    const { useGetSubjectById } = useSubjectQueries();
    const { useGetActivitiesBySubject } = useActivityQueries();
    const { useDeleteActivityMutation } = useActivityMutations();
    const { useGetFilesBySubject } = useFileQueries();
    const { useDeleteSubjectMutation } = useSubjectMutations();

    const { data: subject, isLoading: isLoadingSubject } = useGetSubjectById(Number(subjectId));
    const { data: activities = [], isLoading: isLoadingActivities } = useGetActivitiesBySubject(Number(subjectId));
    const { data: files = [], isLoading: isLoadingFiles } = useGetFilesBySubject(Number(subjectId));
    const deleteActivityMutation = useDeleteActivityMutation();
    const deleteSubjectMutation = useDeleteSubjectMutation();

    const selectedActivity = activities.find(a => a.id === selectedActivityId);
    const selectedFile = files.find(f => f.uuid === selectedFileUuid);

    const handleDeleteActivity = (activity: Activity) => {
        setActivityToDelete(activity);
        setIsDeleteActivityModalOpen(true);
    };

    const confirmDeleteActivity = async () => {
        if (!activityToDelete) return;

        try {
            await deleteActivityMutation.mutateAsync(activityToDelete.id);
            toast.success('Atividade excluída com sucesso!');
            setIsDeleteActivityModalOpen(false);
            if (selectedActivityId === activityToDelete.id) {
                setSelectedActivityId(null);
            }
            setActivityToDelete(null);
        } catch (error) {
            console.error('Erro ao excluir atividade:', error);
            toast.error('Não foi possível excluir a atividade. Tente novamente.');
        }
    };

    const handleEditActivity = (activity: Activity) => {
        setActivityToEdit(activity);
        setIsCreateActivityModalOpen(true);
    };

    const handleCloseActivityModal = () => {
        setIsCreateActivityModalOpen(false);
        setActivityToEdit(null);
    };

    const handleEditSubject = () => {
        setIsUpdateSubjectModalOpen(true);
    };

    const handleDeleteSubject = () => {
        setIsDeleteSubjectModalOpen(true);
    };

    const confirmDeleteSubject = async () => {
        if (!subject) return;

        try {
            await deleteSubjectMutation.mutateAsync(subject.id);
            toast.success('Matéria excluída com sucesso!');
            navigate({ to: '/app/materias' });
        } catch (error) {
            console.error('Erro ao excluir matéria:', error);
            toast.error('Não foi possível excluir a matéria. Tente novamente.');
        }
    };

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

    // Função para formatar tamanho de arquivo
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Função para obter a URL do arquivo
    const getFileUrl = (path: string): string => {
        const baseUrl = 'http://localhost:8080';
        // Garante que o path comece com /
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${normalizedPath}`;
    };

    // Função para obter a extensão do arquivo de forma amigável
    const getFileExtension = (fileType: string, fileName: string): string => {
        // Primeiro tenta pegar do nome do arquivo
        const fileNameExt = fileName.split('.').pop()?.toUpperCase();
        if (fileNameExt) {
            return fileNameExt;
        }

        // Mapeamento de MIME types para extensões
        const mimeToExt: Record<string, string> = {
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
            'application/vnd.ms-excel': 'XLS',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
            'application/vnd.ms-powerpoint': 'PPT',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPEG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WEBP',
        };

        return mimeToExt[fileType] || fileType.split('/').pop()?.toUpperCase() || 'FILE';
    };

    // Função para remover a extensão do nome do arquivo
    const removeFileExtension = (fileName: string): string => {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) return fileName;
        return fileName.substring(0, lastDotIndex);
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
                  
                  {/* Status Badge e Botões de Ação */}
                  <div className="flex items-center space-x-3">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      subject.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subject.isActive ? 'Ativo' : 'Inativo'}
                    </div>
                    
                    {/* Botões de Edição e Exclusão */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleEditSubject}
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                        title="Editar matéria"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={handleDeleteSubject}
                        disabled={deleteSubjectMutation.isPending}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Excluir matéria"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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

                {/* Estatísticas */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">
                      {activities.length} atividade{activities.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">
                      {files.length} arquivo{files.length !== 1 ? 's' : ''}
                    </span>
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

          {/* Tabs: Atividades e Arquivos */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Tabs Header */}
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-6">
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setActiveTab('activities');
                      setSelectedFileUuid(null);
                    }}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === 'activities'
                        ? 'border-academo-brown text-academo-brown'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Atividades
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('files');
                      setSelectedActivityId(null);
                    }}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === 'files'
                        ? 'border-academo-brown text-academo-brown'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Arquivos
                    </div>
                  </button>
                </div>
                {activeTab === 'activities' && (
                  <button
                    onClick={() => setIsCreateActivityModalOpen(true)}
                    disabled={!subject?.isActive}
                    className={`px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center ${
                      subject?.isActive
                        ? 'bg-academo-brown hover:bg-academo-sage text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    title={!subject?.isActive ? 'Matéria inativa - Não é possível gerenciar atividades' : 'Adicionar nova atividade'}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Nova Atividade
                  </button>
                )}
                {activeTab === 'files' && (
                  <button
                    onClick={() => setIsUploadFileModalOpen(true)}
                    className="bg-academo-brown hover:bg-academo-sage text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center"
                    title="Adicionar arquivo"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Arquivo
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'activities' ? (
              /* Tab Atividades */
              <>
              {!subject?.isActive && (
                <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Matéria inativa:</span> Não é possível criar, editar ou excluir atividades.
                  </p>
                </div>
              )}
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
              <div className={`flex gap-4 ${!subject?.isActive ? 'opacity-60' : ''}`}>
                {/* Tabela - 65% */}
                <div className="w-[65%] overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-academo-brown to-academo-sage">
                      <tr>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
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
                          Nota
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                          Data Notificação
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                          Ações
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
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatDateTime(activity.activityDate).date}
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

                        {/* Nota */}
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

                              </>
                            ) : (
                              <span className="text-gray-400 italic text-xs">-</span>
                            )}
                          </div>
                        </td>

                        {/* Ações */}
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditActivity(activity)}
                              disabled={!subject?.isActive}
                              className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                subject?.isActive
                                  ? 'text-blue-600 hover:text-white hover:bg-blue-600'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title={!subject?.isActive ? 'Matéria inativa - Não é possível editar atividades' : 'Editar atividade'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteActivity(activity)}
                              disabled={deleteActivityMutation.isPending || !subject?.isActive}
                              className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                subject?.isActive
                                  ? 'text-red-600 hover:text-white hover:bg-red-600'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title={!subject?.isActive ? 'Matéria inativa - Não é possível excluir atividades' : 'Excluir atividade'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Seção de Detalhes - 35% */}
                  <div className="w-[35%] border-l border-gray-200 flex flex-col" style={{ height: '600px' }}>
                    {selectedActivity ? (
                      <div className="flex flex-col h-full">
                        {/* Header fixo */}
                        <div className="p-6 border-b border-gray-200 flex-shrink-0">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            {selectedActivity.name}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">Data da Atividade:</span>
                              <span>{formatDateTime(selectedActivity.activityDate).date}</span>
                            </div>
                            {selectedActivity.notificationDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Data de Notificação:</span>
                                <span>{formatDateTime(selectedActivity.notificationDate).date}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Conteúdo com scroll */}
                        <div className="flex-1 overflow-y-auto p-6">
                          {selectedActivity.description ? (
                            <div className="prose prose-sm max-w-none">
                              <h5 className="text-sm font-semibold text-gray-700 mb-3">Descrição</h5>
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
              </>
            ) : (
              /* Tab Arquivos */
              isLoadingFiles ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Carregando arquivos...</span>
                  </div>
                </div>
              ) : files.length > 0 ? (
                <div className="flex gap-4">
                  {/* Tabela - 65% */}
                  <div className="w-[65%] overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-academo-brown to-academo-sage">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Nome do Arquivo
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                            Tamanho
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                            Criado em
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {files.map((file) => (
                          <tr 
                            key={file.uuid}
                            onClick={() => setSelectedFileUuid(file.uuid)}
                            className={`hover:bg-gray-50 transition-all duration-200 group cursor-pointer ${
                              selectedFileUuid === file.uuid ? 'bg-academo-brown/10' : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                <span className="text-sm font-medium text-gray-900 group-hover:text-academo-brown transition-colors">{removeFileExtension(file.fileName)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{getFileExtension(file.fileType, file.fileName)}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-sm text-gray-700">
                                {formatFileSize(file.size)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="text-sm text-gray-700">
                                {formatDateTime(new Date(file.createdAt)).date}
                                <br />
                                <span className="text-xs text-gray-500">
                                  {formatDateTime(new Date(file.createdAt)).time}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Seção de Visualização do Arquivo - 35% */}
                  <div className="w-[35%] border-l border-gray-200 flex flex-col" style={{ height: '600px' }}>
                    {selectedFile ? (
                      <div className="flex flex-col h-full">
                        {/* Header fixo */}
                        <div className="p-6 border-b border-gray-200 flex-shrink-0">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {selectedFile.fileName}
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Tipo:</span>
                              <span>{getFileExtension(selectedFile.fileType, selectedFile.fileName)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Tamanho:</span>
                              <span>{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">Criado em:</span>
                              <span>{formatDateTime(new Date(selectedFile.createdAt)).date}</span>
                              <span className="mx-1">•</span>
                              <span>{formatDateTime(new Date(selectedFile.createdAt)).time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo com scroll */}
                        <div className="flex-1 overflow-y-auto p-6">
                          <div className="flex flex-col items-center justify-center h-full">
                            {/* Preview baseado no tipo de arquivo */}
                            {selectedFile.fileType.startsWith('image/') ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <img 
                                  src={getFileUrl(selectedFile.path)}
                                  alt={selectedFile.fileName}
                                  className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                  onError={(e) => {
                                    const fallback = e.currentTarget.parentElement?.nextElementSibling;
                                    if (fallback) {
                                      e.currentTarget.parentElement!.style.display = 'none';
                                      fallback.classList.remove('hidden');
                                    }
                                  }}
                                />
                              </div>
                            ) : selectedFile.fileType === 'application/pdf' ? (
                              <iframe
                                src={getFileUrl(selectedFile.path)}
                                className="w-full h-full min-h-[500px] border rounded-lg"
                                title={selectedFile.fileName}
                              />
                            ) : (
                              <div className="text-center">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">
                                  Visualização não disponível para este tipo de arquivo
                                </p>
                                <a
                                  href={getFileUrl(selectedFile.path)}
                                  download={selectedFile.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 bg-academo-brown text-white rounded-lg hover:bg-academo-sage transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  Baixar Arquivo
                                </a>
                              </div>
                            )}
                            {/* Fallback para imagens com erro */}
                            <div className="hidden text-center">
                              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-4">
                                Não foi possível carregar a visualização
                              </p>
                              <a
                                href={getFileUrl(selectedFile.path)}
                                download={selectedFile.fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-academo-brown text-white rounded-lg hover:bg-academo-sage transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Baixar Arquivo
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            Clique em um arquivo para visualizá-lo
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
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum arquivo encontrado
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Esta matéria ainda não possui arquivos associados.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Create/Edit Activity Modal */}
          <CreateActivityModal 
            isOpen={isCreateActivityModalOpen}
            onClose={handleCloseActivityModal}
            subjectId={Number(subjectId)}
            activityToEdit={activityToEdit}
          />

          {/* Confirm Delete Activity Modal */}
          <ConfirmDeleteActivityModal
            isOpen={isDeleteActivityModalOpen}
            onClose={() => {
              setIsDeleteActivityModalOpen(false);
              setActivityToDelete(null);
            }}
            onConfirm={confirmDeleteActivity}
            activity={activityToDelete}
            isDeleting={deleteActivityMutation.isPending}
          />

          {/* Upload File Modal */}
          <UploadFileModal
            isOpen={isUploadFileModalOpen}
            onClose={() => setIsUploadFileModalOpen(false)}
            subjectId={Number(subjectId)}
            onUploadSuccess={() => {
              // A invalidação das queries já é feita automaticamente pela mutation
            }}
          />

          {/* Update Subject Modal */}
          <UpdateSubjectModal
            isOpen={isUpdateSubjectModalOpen}
            onClose={() => setIsUpdateSubjectModalOpen(false)}
            subject={subject || null}
          />

          {/* Confirm Delete Subject Modal */}
          <ConfirmDeleteSubjectModal
            isOpen={isDeleteSubjectModalOpen}
            onClose={() => setIsDeleteSubjectModalOpen(false)}
            onConfirm={confirmDeleteSubject}
            subject={subject || null}
            isDeleting={deleteSubjectMutation.isPending}
          />
        </div>
    );
}
    