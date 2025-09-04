import React, { useState } from 'react';
import { useSubjectMutations } from '../../api/mutations/subject';
import { useGroupQueries } from '../../api/queries/group';
import { Select } from '../ui/select';
import { toast } from 'sonner';

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSubjectModal({ isOpen, onClose }: CreateSubjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    groupId: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    groupId: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { useCreateSubjectMutation } = useSubjectMutations();
  const { useGetGroups } = useGroupQueries();
  const createSubjectMutation = useCreateSubjectMutation();
  
  // Por enquanto usando userId fixo - depois pode vir do auth store
  const userId = 1;
  const { data: groups = [], isLoading: isLoadingGroups } = useGetGroups(userId);

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      groupId: ''
    };

    // Validação de nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da matéria é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validação de grupo (opcional, mas se fornecido deve ser válido)
    if (formData.groupId && !groups.some(group => group.id.toString() === formData.groupId)) {
      newErrors.groupId = 'Grupo selecionado é inválido';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Por enquanto usando userId fixo - depois pode vir do auth store
      const userId = 1;
      
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        userId: userId,
        ...(formData.groupId && { groupId: parseInt(formData.groupId) })
      };
      
      await createSubjectMutation.mutateAsync(payload);
      toast.success('Matéria criada com sucesso!');
      
      handleClose();
    } catch (error) {
      console.error('Erro ao criar matéria:', error);
      toast.error('Não foi possível criar a matéria. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setFormData({ name: '', description: '', groupId: '' });
      setErrors({ name: '', description: '', groupId: '' });
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
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="bg-academo-brown px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Criar Nova Matéria
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
              Preencha os dados abaixo para criar uma nova matéria acadêmica
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Nome da Matéria */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Matéria *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-academo-brown ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Matemática Aplicada"
                disabled={isLoading}
                maxLength={100}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-academo-brown"
                placeholder="Descrição da matéria..."
                disabled={isLoading}
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 caracteres
              </p>
            </div>

            {/* Grupo */}
            <div className="mb-6">
              <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-2">
                Grupo (opcional)
              </label>
              <Select
                id="groupId"
                name="groupId"
                value={formData.groupId}
                onChange={handleInputChange}
                placeholder={isLoadingGroups ? "Carregando grupos..." : "Selecione um grupo"}
                disabled={isLoading || isLoadingGroups}
                error={errors.groupId}
                options={groups.map(group => ({
                  value: group.id.toString(),
                  label: group.name
                }))}
              />
              {!isLoadingGroups && groups.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Nenhum grupo disponível. Crie um grupo primeiro.
                </p>
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
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-academo-brown hover:bg-academo-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academo-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando...
                  </div>
                ) : (
                  'Criar Matéria'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 