import type { Subject } from '../types/subject';

interface ConfirmDeleteSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subject: Subject | null;
  isDeleting?: boolean;
}

export function ConfirmDeleteSubjectModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  subject, 
  isDeleting = false 
}: ConfirmDeleteSubjectModalProps) {
  
  if (!isOpen || !subject) return null;

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
                <p className="text-red-100 text-sm">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Subject Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-red-400">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-600">
                      {subject.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {subject.name}
                  </div>
                  {subject.description && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {subject.description}
                    </div>
                  )}
                  <div className="flex items-center mt-1 space-x-4">
                    <div className="text-xs text-gray-500">
                      ID: {subject.id}
                    </div>
                    {subject.group && (
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-academo-brown text-white">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {subject.group.name}
                      </div>
                    )}
                  </div>
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
                    <h4 className="text-sm font-semibold text-yellow-800">
                      Atenção!
                    </h4>
                    <div className="mt-1 text-sm text-yellow-700">
                      <p>Ao excluir esta matéria:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Todas as atividades relacionadas serão perdidas</li>
                        <li>O histórico acadêmico será removido</li>
                        <li>Não será possível recuperar os dados</li>
                        <li>Esta ação é <strong>irreversível</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional info if subject has group */}
            {subject.group && (
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-blue-800">
                        Informação
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Esta matéria está associada ao grupo <strong>"{subject.group.name}"</strong>. 
                        O grupo não será afetado pela exclusão.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation text */}
            <div className="mb-6">
              <p className="text-gray-700 text-center">
                Tem certeza que deseja excluir a matéria <strong>"{subject.name}"</strong>?
              </p>
            </div>

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
                  'Sim, Excluir Matéria'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 