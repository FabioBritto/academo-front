import React from 'react';
import type { GroupDTO } from '../../api/types/group';

interface ConfirmDeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  group: GroupDTO | null;
  isDeleting?: boolean;
}

export function ConfirmDeleteGroupModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  group, 
  isDeleting = false 
}: ConfirmDeleteGroupModalProps) {
  
  if (!isOpen || !group) return null;

  const handleConfirm = () => {
    if (!isDeleting) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
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
                  Confirmar Exclusão
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
          <div className="mb-6">
              <p className="text-gray-700 text-center">
                Tem certeza que deseja excluir o grupo <strong>"{group.name}"</strong>?
              </p>
            </div>
            {/* Group Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-red-400">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-600">
                      {group.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {group.name}
                  </div>
                  {group.description && (
                    <div className="text-sm text-gray-600">
                      {group.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning message */}
            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833-.23 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-xs font-semibold text-yellow-800">
                      Atenção!
                    </h4>
                    <div className="mt-1 text-xs text-yellow-700">
                      <p>Ao excluir este grupo:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Todas as matérias associadas ficarão sem grupo</li>
                        <li>O histórico do grupo será perdido</li>
                        <li>Esta ação é <strong>irreversível</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation text */}
           

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Excluindo...
                  </div>
                ) : (
                  'Sim, Excluir Grupo'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 