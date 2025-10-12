import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGroupQueries } from '../services';
import { useSubjectQueries } from '../../subjects/services';
import { useSubjectMutations } from '../../subjects/services';
import { UpdateSubjectModal } from '../../subjects/components/update-subject-modal';
import { AssociateGroupModal } from './associate-group-modal';
import { ConfirmDeleteSubjectModal } from '../../subjects/components/confirm-delete-subject-modal';
import { AddSubjectsToGroupModal } from './add-subjects-to-group-modal';
import { toast } from 'sonner';
import { ArrowLeft, Users, BookOpen, Edit, Trash2, PlusIcon } from 'lucide-react';
import type { Subject } from '../../subjects/types/subject';

export function GroupDetails() {
  const { groupId } = useParams({ from: '/app/grupos/$groupId' });
  const navigate = useNavigate();
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAssociateGroupModalOpen, setIsAssociateGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddSubjectsModalOpen, setIsAddSubjectsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToAssociate, setSubjectToAssociate] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const { useGetGroupById } = useGroupQueries();
  const { useGetSubjectsByGroup } = useSubjectQueries();
  const { useDeleteSubjectMutation } = useSubjectMutations();
  
  const { data: group, isLoading: isLoadingGroup, error: groupError } = useGetGroupById(Number(groupId));
  const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsByGroup(Number(groupId));
  const deleteSubjectMutation = useDeleteSubjectMutation();

  const handleDeleteSubject = (subject: Subject) => {
    setSubjectToDelete(subject);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;

    try {
      await deleteSubjectMutation.mutateAsync(subjectToDelete.id);
      toast.success('Matéria excluída com sucesso!');
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir matéria:', error);
      toast.error('Não foi possível excluir a matéria. Tente novamente.');
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSubjectToEdit(null);
  };

  const handleAssociateGroups = (subject: Subject) => {
    setSubjectToAssociate(subject);
    setIsAssociateGroupModalOpen(true);
  };

  const handleGoBack = () => {
    navigate({ to: '/app/grupos' });
  };

  const isLoading = isLoadingGroup || isLoadingSubjects;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Carregando...</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Carregando detalhes do grupo...</span>
          </div>
        </div>
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Grupo não encontrado</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Grupo não encontrado
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            O grupo que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-academo-brown hover:bg-academo-sage text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Voltar para Grupos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voltar para grupos"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Detalhes do Grupo</h1>
          <p className="text-gray-600">Visualize as informações e matérias do grupo</p>
        </div>
      </div>

      {/* Informações do Grupo */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16">
              <div className="h-16 w-16 rounded-full bg-academo-sage flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {group.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            group.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {group.isActive ? 'Ativo' : 'Inativo'}
          </div>
        </div>

        <div className="space-y-4">
          {/* Descrição */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
            <p className="text-gray-600">
              {group.description || (
                <span className="italic text-gray-400">Sem descrição</span>
              )}
            </p>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">
                {subjects.length} matéria{subjects.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Matérias */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Matérias do Grupo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Lista de matérias associadas a este grupo
              </p>
            </div>
            <button
              onClick={() => setIsAddSubjectsModalOpen(true)}
              className="bg-academo-brown hover:bg-academo-sage text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Adicionar Matérias
            </button>
          </div>
        </div>

        {isLoadingSubjects ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Carregando matérias...</span>
            </div>
          </div>
        ) : subjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-academo-brown to-academo-sage">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {subjects.map((subject) => (
                  <tr 
                    key={subject.id}
                    className="hover:bg-gray-50 transition-all duration-200 group"
                  >
                    {/* Nome */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-academo-peach to-academo-sage flex items-center justify-center shadow-sm">
                            <span className="text-sm font-bold text-white">
                              {subject.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-academo-brown transition-colors">
                            {subject.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {subject.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Descrição */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {subject.description ? (
                          <span className="line-clamp-2">{subject.description}</span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">
                            Sem descrição
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subject.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          subject.isActive ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        {subject.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleAssociateGroups(subject)}
                          className="p-2 text-academo-brown hover:text-white hover:bg-academo-brown rounded-lg transition-all duration-200"
                          title="Associar a grupos"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditSubject(subject)}
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                          title="Editar matéria"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSubject(subject)}
                          disabled={deleteSubjectMutation.isPending}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir matéria"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                Nenhuma matéria encontrada
              </h3>
              <p className="text-gray-600 text-sm">
                Este grupo ainda não possui matérias associadas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Update Subject Modal */}
      <UpdateSubjectModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        subject={subjectToEdit}
      />

      {/* Associate Group Modal */}
      <AssociateGroupModal 
        isOpen={isAssociateGroupModalOpen}
        onClose={() => {
          setIsAssociateGroupModalOpen(false);
          setSubjectToAssociate(null);
        }}
        subject={subjectToAssociate}
      />

      {/* Confirm Delete Subject Modal */}
      <ConfirmDeleteSubjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSubjectToDelete(null);
        }}
        onConfirm={confirmDeleteSubject}
        subject={subjectToDelete}
        isDeleting={deleteSubjectMutation.isPending}
      />

      {/* Add Subjects to Group Modal */}
      <AddSubjectsToGroupModal
        isOpen={isAddSubjectsModalOpen}
        onClose={() => setIsAddSubjectsModalOpen(false)}
        groupId={Number(groupId)}
        currentSubjects={subjects}
      />
    </div>
  );
}

