import { useEffect, useState } from 'react';
import { useSubjectQueries } from '../services';
import { useSubjectMutations } from '../services';
import { CreateSubjectModal } from './create-subject-modal';
import { UpdateSubjectModal } from './update-subject-modal';
import { ConfirmDeleteSubjectModal } from './confirm-delete-subject-modal';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';
import type { Subject } from '../types/subject';
import { formatDateTime } from '../../../shared/utils/formatter';

export function Materias() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const { useGetSubjects } = useSubjectQueries();
  const { useDeleteSubjectMutation } = useSubjectMutations();
  
  const { data: subjects = [], isLoading, error } = useGetSubjects();
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


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matérias</h1>
          <p className="text-gray-600">Gerencie suas matérias acadêmicas</p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <button 
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-academo-brown hover:bg-academo-sage text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Matéria
          </button>
          
          {/* Subjects Counter */}
          {!isLoading && subjects && subjects.length > 0 && (
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <p className="text-sm text-gray-600 font-medium">
                {subjects.length} matéria{subjects.length !== 1 ? 's' : ''} encontrada{subjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading ? (
          // Loading State
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Carregando matérias...</span>
            </div>
          </div>
        ) : error ? (
          // Error State - Mensagem simples na área da tabela
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma matéria encontrada
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Não foi possível carregar matérias ou você ainda não possui matérias cadastradas.
              </p>
              <p className="text-gray-500 text-xs">
                Use o botão <span className="font-medium text-academo-brown">"Nova Matéria"</span> acima para criar sua primeira matéria.
              </p>
            </div>
          </div>
        ) : subjects && subjects.length > 0 ? (
          // Subjects Table
          <div className="overflow-x-auto shadow-sm rounded-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-academo-brown to-academo-sage">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Atualizado em
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

                    {/* Criado em */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {formatDateTime(subject.createdAt).date}
                        <br />
                        {formatDateTime(subject.createdAt).time}
                      </div>
                    </td>

                    {/* Atualizado em */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {formatDateTime(subject.updatedAt).date}
                        <br />
                        {formatDateTime(subject.updatedAt).time}
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
                          onClick={() => handleEditSubject(subject)}
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                          title="Editar matéria"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSubject(subject)}
                          disabled={deleteSubjectMutation.isPending}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir matéria"
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
        ) : (
          // Empty State - Lista vazia (sem erro)
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma matéria encontrada
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Você ainda não possui matérias acadêmicas cadastradas.
              </p>
              <p className="text-gray-500 text-xs">
                Use o botão <span className="font-medium text-academo-brown">"Nova Matéria"</span> acima para criar sua primeira matéria.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Subject Modal */}
      <CreateSubjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Update Subject Modal */}
      <UpdateSubjectModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        subject={subjectToEdit}
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
    </div>
  );
} 