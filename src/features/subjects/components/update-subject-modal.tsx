import { useState, useEffect } from 'react';
import { useSubjectMutations } from '../services';
import { toast } from 'sonner';
import { Switch } from '../../../shared/components/ui/switch';
import type { Subject } from '../types/subject';

interface UpdateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

export function UpdateSubjectModal({ isOpen, onClose, subject }: UpdateSubjectModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    description: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { useUpdateSubjectMutation } = useSubjectMutations();
  const updateSubjectMutation = useUpdateSubjectMutation();

  // Preencher o formulário quando a matéria mudar
  useEffect(() => {
    if (subject) {
      setFormData({
        id: subject.id,
        name: subject.name || '',
        description: subject.description || '',
        isActive: subject.isActive ?? true
      });
    }
  }, [subject]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: ''
    };

    // Validação de nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da matéria é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.name.trim().length > 60) {
      newErrors.name = 'Nome deve ter no máximo 60 caracteres';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !subject) {
      return;
    }

    setIsLoading(true);
    
    try {
      await updateSubjectMutation.mutateAsync({
        payload: {
          id: formData.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive,
        }
      });
      
      toast.success('Matéria atualizada com sucesso!');
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar matéria:', error);
      toast.error('Não foi possível atualizar a matéria. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limita o tamanho do input conforme o campo
    let limitedValue = value;
    if (name === "name" && value.length > 60) {
      limitedValue = value.slice(0, 60);
    }
    
    setFormData(prev => ({ ...prev, [name]: limitedValue }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setFormData({ id: 0, name: '', description: '', isActive: true });
      setErrors({ name: '', description: '' });
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
                Editar Matéria
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
              Edite os dados da matéria "{subject.name}"
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Nome da Matéria */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome da Matéria *
                </label>
                <span className="text-xs text-gray-500">
                  {formData.name.length}/60
                </span>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-academo-brown ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Matemática"
                disabled={isLoading}
                maxLength={60}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="mb-4">
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

            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status da Matéria
              </label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onChange={handleSwitchChange}
                disabled={isLoading}
                label={formData.isActive ? 'Ativo' : 'Inativo'}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.isActive 
                  ? 'A matéria está ativa e visível' 
                  : 'A matéria está inativa e não será exibida'
                }
              </p>
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
                    Salvando...
                  </div>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 