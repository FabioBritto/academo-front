import React, { useState, useEffect } from 'react';
import { useActivityMutations } from '../services/activity';
import { useTypeActivityQueries } from '../services/type-activity';
import { toast } from 'sonner';
import { PlusIcon, FileText, Edit, MinusIcon } from 'lucide-react';
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
    notificationDate: '',
    name: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [isDescriptionEditorOpen, setIsDescriptionEditorOpen] = useState(false);
  const [isConfirmRemoveDescriptionOpen, setIsConfirmRemoveDescriptionOpen] = useState(false);
  
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

  // Função para obter a data mínima (dia seguinte)
  const getMinDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return formatDateTimeLocal(tomorrow);
  };

  // Função para obter a data mínima de notificação (30 minutos a partir de agora)
  const getMinNotificationDate = (): string => {
    const minDate = new Date();
    minDate.setMinutes(minDate.getMinutes() + 30);
    return formatDateTimeLocal(minDate);
  };

  // Função para verificar se a data da atividade já passou
  const isActivityDatePassed = (): boolean => {
    if (!isEditMode || !activityToEdit) return false;
    const activityDate = new Date(activityToEdit.activityDate);
    const now = new Date();
    return activityDate < now;
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
      notificationDate: '',
      name: ''
    };

    // Validação de data
    if (!formData.activityDate.trim()) {
      newErrors.activityDate = 'Data é obrigatória';
    } else if (!isEditMode) {
      // No modo de criação, a data deve ser pelo menos o dia seguinte
      const activityDate = new Date(formData.activityDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (activityDate < tomorrow) {
        newErrors.activityDate = 'A data da atividade deve ser a partir do dia seguinte';
      }
    }

    // Validação de data de notificação
    if (formData.notificationDate && formData.activityDate) {
      const notificationDate = new Date(formData.notificationDate);
      const activityDate = new Date(formData.activityDate);
      const minNotificationDate = new Date();
      minNotificationDate.setMinutes(minNotificationDate.getMinutes() + 30);
      
      if (notificationDate < minNotificationDate) {
        newErrors.notificationDate = 'A data de notificação deve ser pelo menos 30 minutos a partir de agora';
      } else if (notificationDate >= activityDate) {
        newErrors.notificationDate = 'A data de notificação deve ser anterior à data da atividade';
      }
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
    
    // Validação especial para activityDate - deve ser pelo menos o dia seguinte (apenas no modo de criação)
    if (name === 'activityDate' && value && !isEditMode) {
      const activityDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (activityDate < tomorrow) {
        setErrors(prev => ({ ...prev, activityDate: 'A data da atividade deve ser a partir do dia seguinte' }));
        return;
      }
    }
    
    // Validação especial para notificationDate
    if (name === 'notificationDate' && value && formData.activityDate) {
      const notificationDate = new Date(value);
      const activityDate = new Date(formData.activityDate);
      const minNotificationDate = new Date();
      minNotificationDate.setMinutes(minNotificationDate.getMinutes() + 30);
      
      if (notificationDate < minNotificationDate) {
        setErrors(prev => ({ ...prev, notificationDate: 'A data de notificação deve ser pelo menos 30 minutos a partir de agora' }));
        return;
      } else if (notificationDate >= activityDate) {
        setErrors(prev => ({ ...prev, notificationDate: 'A data de notificação deve ser anterior à data da atividade' }));
        return;
      }
    }
    
    // Validação especial para activityDate - se mudar, verificar notificationDate
    if (name === 'activityDate' && value && formData.notificationDate) {
      const notificationDate = new Date(formData.notificationDate);
      const activityDate = new Date(value);
      const minNotificationDate = new Date();
      minNotificationDate.setMinutes(minNotificationDate.getMinutes() + 30);
      
      if (notificationDate < minNotificationDate) {
        setErrors(prev => ({ ...prev, notificationDate: 'A data de notificação deve ser pelo menos 30 minutos a partir de agora' }));
        setFormData(prev => ({ ...prev, [name]: value, notificationDate: '' }));
        return;
      } else if (notificationDate >= activityDate) {
        setErrors(prev => ({ ...prev, notificationDate: 'A data de notificação deve ser anterior à data da atividade' }));
        setFormData(prev => ({ ...prev, [name]: value, notificationDate: '' }));
        return;
      }
    }
    
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
      setErrors({ activityDate: '', notificationDate: '', name: '' });
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
                <label 
                  htmlFor="activityDate" 
                  className={`block text-sm font-medium mb-1 ${
                    isActivityDatePassed() ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="activityDate"
                  name="activityDate"
                  value={formData.activityDate}
                  onChange={handleInputChange}
                  min={!isEditMode ? getMinDate() : undefined}
                  title={isActivityDatePassed() 
                    ? 'Não é possível alterar a data de uma atividade que já aconteceu' 
                    : (!isEditMode ? 'A data da atividade deve ser a partir do dia seguinte' : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown ${
                    errors.activityDate 
                      ? 'border-red-500' 
                      : isActivityDatePassed()
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300'
                  }`}
                  disabled={isLoading || isActivityDatePassed()}
                />
                {errors.activityDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.activityDate}</p>
                )}
              </div>

              {/* Data de Notificação */}
              <div>
                <label 
                  htmlFor="notificationDate" 
                  className={`block text-sm font-medium mb-1 ${
                    isActivityDatePassed() ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Data de Notificação
                </label>
                <input
                  type="datetime-local"
                  id="notificationDate"
                  name="notificationDate"
                  value={formData.notificationDate}
                  onChange={handleInputChange}
                  min={formData.activityDate ? getMinNotificationDate() : undefined}
                  max={formData.activityDate || undefined}
                  title={isActivityDatePassed()
                    ? 'Não é possível alterar a data de notificação de uma atividade que já aconteceu'
                    : (!formData.activityDate 
                      ? 'Primeiro selecione a data da atividade' 
                      : 'A data de notificação deve ser entre 30 minutos a partir de agora e a data da atividade')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown ${
                    errors.notificationDate 
                      ? 'border-red-500' 
                      : !formData.activityDate || isActivityDatePassed()
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300'
                  }`}
                  disabled={isLoading || !formData.activityDate || isActivityDatePassed()}
                />
                {errors.notificationDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.notificationDate}</p>
                )}
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
                <div>
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
                      <div className="flex items-center gap-2">
                        {formData.activityTypeId && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, activityTypeId: '' }));
                            }}
                            disabled={isLoading}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remover tipo selecionado"
                          >
                            <MinusIcon className="w-5 h-5" />
                          </button>
                        )}
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
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
                <div>
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
                    <div className="flex items-center gap-2">
                      {formData.description && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsConfirmRemoveDescriptionOpen(true);
                          }}
                          disabled={isLoading}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remover descrição"
                        >
                          <MinusIcon className="w-5 h-5" />
                        </button>
                      )}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
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

      {/* Confirm Remove Description Modal */}
      {isConfirmRemoveDescriptionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsConfirmRemoveDescriptionOpen(false)}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all">
              {/* Header with warning color */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833-.23 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">
                      Remover Descrição
                    </h3>
                    <p className="text-red-100 text-sm">
                      Esta ação não pode ser desfeita
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="mb-6">
                  <p className="text-gray-700">
                    Tem certeza que deseja remover a descrição desta atividade? Esta ação não pode ser desfeita e você perderá todo o conteúdo da descrição.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsConfirmRemoveDescriptionOpen(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, description: '' }));
                      setIsConfirmRemoveDescriptionOpen(false);
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

