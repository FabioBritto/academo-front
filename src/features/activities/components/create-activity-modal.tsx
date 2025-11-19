import React, { useState, useEffect } from 'react';
import { useActivityMutations } from '../services/activity';
import { useTypeActivityQueries } from '../services/type-activity';
import { toast } from 'sonner';
import { PlusIcon, FileText, Edit } from 'lucide-react';
import { SelectTypeActivityModal } from './select-type-activity-modal';
import { DescriptionEditorModal } from './description-editor-modal';
import type { Activity } from '../types/activity';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: number;
  activityToEdit?: Activity | null;
}

export function CreateActivityModal({ isOpen, onClose, subjectId, activityToEdit }: CreateActivityModalProps) {
  const [formData, setFormData] = useState({
    activityDate: '',
    notificationDate: '',
    name: '',
    activityTypeId: '',
    value: '0',
    description: ''
  });
  
  const [errors, setErrors] = useState({
    activityDate: '',
    name: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [isDescriptionEditorOpen, setIsDescriptionEditorOpen] = useState(false);
  
  const { useCreateActivityMutation, useUpdateActivityMutation } = useActivityMutations();
  const { useGetTypeActivities } = useTypeActivityQueries();
  
  const createActivityMutation = useCreateActivityMutation();
  const updateActivityMutation = useUpdateActivityMutation();
  const { data: typeActivities = [] } = useGetTypeActivities();
  
  const isEditMode = !!activityToEdit;
  
  // Função para formatar data para input datetime-local
  const formatDateTimeLocal = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Carregar dados da atividade quando estiver em modo de edição
  useEffect(() => {
    if (isOpen && activityToEdit) {
      setFormData({
        activityDate: formatDateTimeLocal(activityToEdit.activityDate),
        notificationDate: formatDateTimeLocal(activityToEdit.notificationDate),
        name: activityToEdit.name || '',
        activityTypeId: activityToEdit.activityTypeId 
          ? String(activityToEdit.activityTypeId) 
          : (activityToEdit.typeActivity?.id ? String(activityToEdit.typeActivity.id) : ''),
        value: activityToEdit.value !== null && activityToEdit.value !== undefined ? String(activityToEdit.value) : '0',
        description: activityToEdit.description || ''
      });
    } else if (isOpen && !activityToEdit) {
      // Resetar formulário quando abrir para criar
      setFormData({
        activityDate: '',
        notificationDate: '',
        name: '',
        activityTypeId: '',
        value: '0',
        description: ''
      });
    }
  }, [isOpen, activityToEdit]);
  
  // Buscar o nome do tipo selecionado para exibir no botão
  const selectedType = typeActivities.find(type => type.id === Number(formData.activityTypeId));

  const validateForm = () => {
    const newErrors = {
      activityDate: '',
      name: ''
    };

    // Validação de data
    if (!formData.activityDate.trim()) {
      newErrors.activityDate = 'Data é obrigatória';
    }

    // Validação de nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da atividade é obrigatório';
    } else if (formData.name.trim().length < 1) {
      newErrors.name = 'Nome deve ter pelo menos 1 caracter';
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
      if (isEditMode && activityToEdit) {
        // Modo de edição
        const payload = {
          id: activityToEdit.id,
          activityDate: formData.activityDate ? new Date(formData.activityDate) : undefined,
          notificationDate: formData.notificationDate ? new Date(formData.notificationDate) : undefined,
          name: formData.name.trim(),
          ActivityTypeId: formData.activityTypeId ? Number(formData.activityTypeId) : undefined,
          value: formData.value ? Number(formData.value) : 0,
          subjectId: subjectId,
          description: formData.description.trim() || undefined,
        };
        
        await updateActivityMutation.mutateAsync(payload);
        toast.success('Atividade atualizada com sucesso!');
      } else {
        // Modo de criação
        const payload = {
          activityDate: new Date(formData.activityDate),
          notificationDate: formData.notificationDate ? new Date(formData.notificationDate) : undefined,
          name: formData.name.trim(),
          activityTypeId: formData.activityTypeId ? Number(formData.activityTypeId) : undefined,
          value: formData.value ? Number(formData.value) : 0,
          subjectId: subjectId,
          description: formData.description.trim() || undefined,
        };
        
        await createActivityMutation.mutateAsync(payload);
        toast.success('Atividade criada com sucesso!');
      }
      
      handleClose();
    } catch (error) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} atividade:`, error);
      toast.error(`Não foi possível ${isEditMode ? 'atualizar' : 'criar'} a atividade. Tente novamente.`);
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
      setFormData({ 
        activityDate: '', 
        notificationDate: '', 
        name: '', 
        activityTypeId: '', 
        value: '0',
        description: '' 
      });
      setErrors({ activityDate: '', name: '' });
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
                {isEditMode ? 'Editar Atividade' : 'Criar Nova Atividade'}
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
              {isEditMode 
                ? 'Edite os dados da atividade abaixo' 
                : 'Preencha os dados abaixo para criar uma nova atividade'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-4">
              {/* Data */}
              <div>
                <label htmlFor="activityDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="activityDate"
                  name="activityDate"
                  value={formData.activityDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown ${
                    errors.activityDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.activityDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.activityDate}</p>
                )}
              </div>

              {/* Data de Notificação */}
              <div>
                <label htmlFor="notificationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Notificação
                </label>
                <input
                  type="datetime-local"
                  id="notificationDate"
                  name="notificationDate"
                  value={formData.notificationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown"
                  disabled={isLoading}
                />
              </div>

              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  placeholder="Ex: Prova de Matemática"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Tipo de Atividade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Atividade
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsSelectTypeModalOpen(true)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.activityTypeId
                        ? 'border-academo-brown bg-academo-brown/5 hover:bg-academo-brown/10'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {formData.activityTypeId && selectedType ? (
                          <div>
                            <div className="font-semibold text-gray-900">{selectedType.name}</div>
                            {selectedType.description && (
                              <div className="text-sm text-gray-600 mt-1">{selectedType.description}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Escolher Tipo de Atividade</span>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  {formData.activityTypeId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, activityTypeId: '' }));
                      }}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remover tipo selecionado
                    </button>
                  )}
                </div>
              </div>

              {/* Valor */}
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                  Nota: {formData.value}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    id="value"
                    name="value"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-academo-brown"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span className="font-semibold text-academo-brown">{formData.value}</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionEditorOpen(true)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between ${
                      formData.description
                        ? 'border-academo-brown bg-academo-brown/5 hover:bg-academo-brown/10'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-500" />
                      <span className={formData.description ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                        {formData.description ? 'Descrição adicionada' : 'Adicionar Descrição'}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {formData.description && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, description: '' }));
                      }}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remover descrição
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-academo-brown text-white rounded-lg hover:bg-academo-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Salvando...' : 'Criando...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Criar Atividade
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Select Type Activity Modal */}
      <SelectTypeActivityModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
        onSelect={(typeId) => {
          setFormData(prev => ({ ...prev, activityTypeId: typeId ? String(typeId) : '' }));
        }}
        selectedTypeId={formData.activityTypeId ? Number(formData.activityTypeId) : undefined}
      />

      {/* Description Editor Modal */}
      <DescriptionEditorModal
        isOpen={isDescriptionEditorOpen}
        onClose={() => setIsDescriptionEditorOpen(false)}
        onSave={(markdown) => {
          setFormData(prev => ({ ...prev, description: markdown }));
        }}
        initialValue={formData.description}
      />
    </div>
  );
}

