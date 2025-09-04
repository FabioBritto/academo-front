import React, { useState } from 'react';
import { useGroupQueries } from '../../api/queries/group';
import { useGroupMutations } from '../../api/mutations/group';
import { CreateGroupModal } from './CreateGroupModal';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function Grupos() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Por enquanto usando um userId fixo - depois pode vir do auth store
  const userId = 1;

  const { useGetGroups } = useGroupQueries();
  const { useDeleteGroupMutation } = useGroupMutations();
  
  const { data: groups = [], isLoading, error, refetch } = useGetGroups(userId);
  const deleteGroupMutation = useDeleteGroupMutation();

  const handleDeleteGroup = async (groupId: number, groupName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o grupo "${groupName}"?`)) {
      try {
        await deleteGroupMutation.mutateAsync(groupId);
        toast.success('Grupo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir grupo:', error);
        toast.error('Não foi possível excluir o grupo. Tente novamente.');
      }
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info('Lista de grupos atualizada');
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grupos</h1>
          <p className="text-gray-600">Gerencie seus grupos de estudo</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleRefresh}
            variant="secondary"
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </Button>
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Grupo
          </Button>
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
              <span className="text-gray-600">Carregando grupos...</span>
            </div>
          </div>
        ) : error ? (
          // Error State - Mensagem simples na área da tabela
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum grupo encontrado
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Não foi possível carregar grupos ou você ainda não possui grupos cadastrados.
              </p>
              <p className="text-gray-500 text-xs">
                Use o botão <span className="font-medium text-academo-brown">"Novo Grupo"</span> acima para criar seu primeiro grupo de estudo.
              </p>
            </div>
          </div>
        ) : groups && groups.length > 0 ? (
          // Groups Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map((group, index) => (
                  <tr 
                    key={group.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedGroupId === group.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-academo-sage flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {group.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {group.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {group.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {group.description || (
                          <span className="text-gray-400 italic">
                            Sem descrição
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
                        className="text-academo-brown hover:text-academo-sage transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        disabled={deleteGroupMutation.isPending}
                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum grupo encontrado
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Você ainda não possui grupos de estudo cadastrados.
              </p>
              <p className="text-gray-500 text-xs">
                Use o botão <span className="font-medium text-academo-brown">"Novo Grupo"</span> acima para criar seu primeiro grupo de estudo.
              </p>
            </div>
          </div>
        )}

        {/* Groups Count Footer */}
        {groups && groups.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: {groups.length} grupo{groups.length !== 1 ? 's' : ''} encontrado{groups.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
} 