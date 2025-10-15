import React, { useState, useEffect } from 'react';
import { useSubjectQueries } from '../../subjects/services';
import { toast } from 'sonner';
import type { Subject } from '../../subjects/types/subject';
import { useGroupMutations } from '../services';
import { CreateSubjectModal } from '../../subjects/components/create-subject-modal';

interface AddSubjectsToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  currentSubjects: Subject[];
}

export function AddSubjectsToGroupModal({ isOpen, onClose, groupId, currentSubjects }: AddSubjectsToGroupModalProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { useGetSubjects } = useSubjectQueries();
  const { data: allSubjects = [], isLoading: isLoadingSubjects } = useGetSubjects();
  const { useAssociateSubjectsMutation } = useGroupMutations();
  const associateSubjectsMutation = useAssociateSubjectsMutation();
  // Filtrar matérias que NÃO estão neste grupo
  const availableSubjects = allSubjects.filter(
    subject => !currentSubjects.some(current => current.id === subject.id)
  );

  // Filtrar matérias pela busca
  const filteredSubjects = availableSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetar seleção ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setSelectedSubjects([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === filteredSubjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(filteredSubjects.map(s => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSubjects.length === 0) {
      toast.error('Selecione pelo menos uma matéria para adicionar.');
      return;
    }

    const subjectsIds = selectedSubjects;

    setIsLoading(true);

    console.log('selectedSubjects', selectedSubjects);
    
    try {
        await associateSubjectsMutation.mutateAsync({
          groupId: groupId,
          subjectsIds
        });
      
      toast.success(`${selectedSubjects.length} matéria${selectedSubjects.length !== 1 ? 's' : ''} adicionada${selectedSubjects.length !== 1 ? 's' : ''} ao grupo com sucesso!`);
      
      handleClose();
      
    } catch (error) {
      console.error('Erro ao adicionar matérias:', error);
      toast.error('Não foi possível adicionar as matérias. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedSubjects([]);
      setSearchTerm('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="bg-academo-brown px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Adicionar Matérias ao Grupo
              </h3>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-orange-100 text-sm mt-1">
              Selecione as matérias que deseja adicionar a este grupo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Search Bar and Create Button */}
            <div className="mb-4 flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar matérias..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-academo-brown"
                  disabled={isLoading}
                />
                <svg 
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition duration-200 flex items-center whitespace-nowrap disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Matéria
              </button>
            </div>

            {/* Select All Button */}
            {filteredSubjects.length > 0 && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  disabled={isLoading}
                  className="text-sm text-academo-brown hover:text-academo-sage font-medium disabled:opacity-50"
                >
                  {selectedSubjects.length === filteredSubjects.length ? 'Desmarcar todas' : 'Selecionar todas'}
                </button>
              </div>
            )}

            {/* Subjects List */}
            <div className="mb-6">
              {isLoadingSubjects ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Carregando matérias...</span>
                  </div>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium">
                    {searchTerm ? 'Nenhuma matéria encontrada' : 'Todas as matérias já estão neste grupo'}
                  </p>
                  <p className="text-xs mt-1">
                    {searchTerm ? 'Tente buscar com outros termos' : 'Crie novas matérias para adicioná-las ao grupo'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {filteredSubjects.map((subject) => (
                    <label 
                      key={subject.id}
                      className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => handleSubjectToggle(subject.id)}
                        disabled={isLoading}
                        className="h-4 w-4 mt-1 text-academo-brown focus:ring-academo-brown border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-academo-peach to-academo-sage flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {subject.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {subject.name}
                            </div>
                            {subject.description && (
                              <div className="text-xs text-gray-500 truncate">
                                {subject.description}
                              </div>
                            )}
                          </div>
                          {subject.isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Inativo
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {selectedSubjects.length > 0 && (
                <div className="mt-3 p-3 bg-academo-brown bg-opacity-10 rounded-lg">
                  <div className="text-sm font-medium text-academo-brown">
                    {selectedSubjects.length} matéria{selectedSubjects.length !== 1 ? 's' : ''} selecionada{selectedSubjects.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academo-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || selectedSubjects.length === 0}
                className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-academo-brown hover:bg-academo-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academo-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adicionando...
                  </div>
                ) : (
                  `Adicionar ${selectedSubjects.length > 0 ? `(${selectedSubjects.length})` : ''}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Create Subject Modal */}
      <CreateSubjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        groupId={groupId}
      />
    </div>
  );
}

