import type { Subject } from '../../subjects/types/subject';

interface ConfirmRemoveSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subject: Subject | null;
  isRemoving?: boolean;
}

export function ConfirmRemoveSubjectModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  subject, 
  isRemoving = false 
}: ConfirmRemoveSubjectModalProps) {
  
  if (!isOpen || !subject) return null;

  const handleConfirm = () => {
    if (!isRemoving) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isRemoving) {
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
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-white">
                  Remover Matéria do Grupo
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="mb-6">
              <p className="text-gray-700 text-center">
                Tem certeza que deseja remover a matéria <strong>"{subject.name}"</strong> deste grupo?
              </p>
            </div>
            
            {/* Subject Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-600">
                      {subject.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {subject.name}
                  </div>
                  {subject.description && (
                    <div className="text-sm text-gray-600">
                      {subject.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info message */}
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-xs font-semibold text-blue-800">
                      Informação
                    </h4>
                    <div className="mt-1 text-xs text-blue-700">
                      <p>A matéria será removida apenas deste grupo, mas continuará existindo no sistema.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isRemoving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isRemoving}
                className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRemoving ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removendo...
                  </div>
                ) : (
                  'Sim, Remover'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
