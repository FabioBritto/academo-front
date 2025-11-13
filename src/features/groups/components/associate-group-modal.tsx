import React, { useState, useEffect } from 'react';
import { useSubjectMutations } from '../../subjects/services';
import { useGroupQueries } from '../services';
import { toast } from 'sonner';
import type { Subject } from '../../subjects/types/subject';

interface AssociateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

export function AssociateGroupModal({ isOpen, onClose, subject }: AssociateGroupModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { useUpdateSubjectMutation } = useSubjectMutations();
  const { useGetGroups } = useGroupQueries();
  const updateSubjectMutation = useUpdateSubjectMutation();
  
  const { data: groups = [], isLoading: isLoadingGroups } = useGetGroups();

  // Atualizar grupos selecionados quando a matéria mudar
  useEffect(() => {
    if (subject && subject.group) {
      setSelectedGroups([subject.group.id]);
    } else {
      setSelectedGroups([]);
    }
  }, [subject]);

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject) return;

    setIsLoading(true);
    
    try {
      const payload = {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        isActive: subject.isActive,
      };
      
      await updateSubjectMutation.mutateAsync({ payload });
      toast.success('Associações de grupo atualizadas com sucesso!');
      
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar associações:', error);
      toast.error('Não foi possível atualizar as associações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedGroups([]);
    }
  };

  if (!isOpen || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="bg-academo-brown px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Associar Grupos
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
              Associe a matéria "{subject.name}" aos grupos desejados
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Subject Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-academo-peach flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {subject.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium text-gray-900">
                    {subject.name}
                  </div>
                  {subject.description && (
                    <div className="text-sm text-gray-500">
                      {subject.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Groups List */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecione os grupos:
              </label>
              
              {isLoadingGroups ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600 text-sm">Carregando grupos...</span>
                  </div>
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Nenhum grupo disponível.</p>
                  <p className="text-xs mt-1">Crie um grupo primeiro para poder associá-lo.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {groups.map((group) => (
                    <label 
                      key={group.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => handleGroupToggle(group.id)}
                        disabled={isLoading}
                        className="h-4 w-4 text-academo-brown focus:ring-academo-brown border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {group.name}
                        </div>
                        {group.description && (
                          <div className="text-xs text-gray-500">
                            {group.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {selectedGroups.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  {selectedGroups.length} grupo{selectedGroups.length !== 1 ? 's' : ''} selecionado{selectedGroups.length !== 1 ? 's' : ''}
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
                disabled={isLoading || groups.length === 0}
                className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-academo-brown hover:bg-academo-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academo-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </div>
                ) : (
                  'Salvar Associações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 