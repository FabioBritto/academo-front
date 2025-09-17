import { PlusIcon } from 'lucide-react';

export function Atividades() {
  // Placeholder - quando implementar atividades, adicionar as variáveis de estado necessárias
  const isLoading = false;
  const activities: unknown[] = []; // Substituir pela query real quando implementada

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Atividades</h1>
          <p className="text-gray-600">Gerencie suas atividades e tarefas</p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <button 
            type="button"
            disabled
            className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center cursor-not-allowed opacity-50"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Atividade
          </button>
          
                     {/* Activities Counter - quando implementar */}
           {!isLoading && activities && activities.length > 0 && (
             <div className="bg-gray-100 px-3 py-1 rounded-full">
               <p className="text-sm text-gray-600 font-medium">
                 {activities.length} atividade{activities.length !== 1 ? 's' : ''} encontrada{activities.length !== 1 ? 's' : ''}
               </p>
             </div>
           )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
      </div>
    </div>
  );
} 