import React, { useState } from 'react';
import { useTypeActivityQueries } from '../services/type-activity';
import type { TypeActivity } from '../types/type-activity';
import { CreateTypeActivityModal } from './create-type-activity-modal';
import { PlusIcon } from 'lucide-react';

interface SelectTypeActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (typeId: number | undefined) => void;
  selectedTypeId?: number;
}

export function SelectTypeActivityModal({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedTypeId 
}: SelectTypeActivityModalProps) {
  const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false);
  const { useGetTypeActivities } = useTypeActivityQueries();
  const { data: typeActivities = [], isLoading: isLoadingTypes } = useGetTypeActivities();

  const handleSelect = (typeId: number) => {
    onSelect(typeId);
    onClose();
  };

  const handleClear = () => {
    onSelect(undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="bg-academo-brown px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Escolher Tipo de Atividade
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-orange-100 text-sm mt-1">
              Selecione um tipo de atividade para associar à sua atividade
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {isLoadingTypes ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-academo-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : typeActivities.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div>
                  <p className="text-gray-500 mb-2">Nenhum tipo de atividade cadastrado.</p>
                  <p className="text-sm text-gray-400">Crie um novo tipo de atividade primeiro.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateTypeModalOpen(true)}
                  className="px-4 py-2 text-sm bg-academo-brown text-white rounded-lg hover:bg-academo-sage transition-colors flex items-center justify-center mx-auto"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Criar novo tipo de atividade
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {typeActivities.map((type: TypeActivity) => (
                  <label
                    key={type.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedTypeId === type.id
                        ? 'border-academo-brown bg-academo-brown/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="activityType"
                      value={type.id}
                      checked={selectedTypeId === type.id}
                      onChange={() => handleSelect(type.id)}
                      className="mt-1 mr-3 w-4 h-4 text-academo-brown focus:ring-academo-brown focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {type.name}
                      </div>
                      {type.description && (
                        <div className="text-sm text-gray-600">
                          {type.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCreateTypeModalOpen(true)}
                  className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border-2 border-dashed border-gray-300"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Criar novo tipo de atividade
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Seleção
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-academo-brown text-white rounded-lg hover:bg-academo-sage transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* Create Type Activity Modal */}
      <CreateTypeActivityModal 
        isOpen={isCreateTypeModalOpen}
        onClose={() => setIsCreateTypeModalOpen(false)}
        onSuccess={() => {
          // A lista será atualizada automaticamente pelo React Query
          // Após a invalidação da query, o novo tipo aparecerá no modal de seleção
        }}
      />
    </div>
  );
}

