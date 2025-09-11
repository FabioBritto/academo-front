import { useState } from 'react';
import { useGroupQueries } from '../../api/queries/group';
import { useSubjectQueries } from '../../api/queries/subject';
import { useGroupMutations } from '../../api/mutations/group';
import { CreateGroupModal } from './create-group-modal';
import { UpdateGroupModal } from './update-group-modal';
import { toast } from 'react-toastify';
import { PlusIcon, Users, BookOpen, Eye, Edit, Trash2 } from 'lucide-react';
import type { GroupDTO } from '../../api/types/group';

export function Grupos() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<GroupDTO | null>(null);



  const { useGetGroups } = useGroupQueries();
  const { useGetSubjects } = useSubjectQueries();
  const { useDeleteGroupMutation } = useGroupMutations();
  
  const { data: groups = [], isLoading, error } = useGetGroups();
  const { data: subjects = [] } = useGetSubjects();
  const deleteGroupMutation = useDeleteGroupMutation();

  // Função para contar matérias por grupo
  const getSubjectCountByGroup = (groupId: number) => {
    return subjects.filter(subject => subject.group?.id === groupId).length;
  };

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

  const handleEditGroup = (group: GroupDTO) => {
    setGroupToEdit(group);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setGroupToEdit(null);
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
          <button 
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-academo-brown hover:bg-academo-sage text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Grupo
          </button>
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
          // Error State
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
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
          // Groups Cards
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groups.map((group) => {
                const subjectCount = getSubjectCountByGroup(group.id);
                return (
                  <div 
                    key={group.id}
                    className={`bg-white border rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer ${
                      selectedGroupId === group.id ? 'ring-2 ring-academo-brown border-academo-brown' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-academo-sage flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {group.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {group.name}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        group.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {group.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-3">
                      {/* Description */}
                      <p className="text-sm text-gray-600 h-10 overflow-hidden">
                        {group.description || (
                          <span className="italic text-gray-400">
                            Sem descrição
                          </span>
                        )}
                      </p>

                      {/* Subject Count */}
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>
                          {subjectCount > 0 
                            ? `${subjectCount} matéria${subjectCount !== 1 ? 's' : ''}`
                            : 'Nenhuma matéria'
                          }
                        </span>
                      </div>


                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGroupId(selectedGroupId === group.id ? null : group.id);
                          }}
                          className="text-academo-brown hover:text-academo-sage transition-colors p-1"
                          title="Visualizar detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(group);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                            title="Editar grupo"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.id, group.name);
                            }}
                            disabled={deleteGroupMutation.isPending}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 p-1"
                            title="Excluir grupo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
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
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 rounded-b-lg">
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

      {/* Update Group Modal */}
      <UpdateGroupModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        group={groupToEdit}
      />
    </div>
  );
} 