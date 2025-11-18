import { useParams, useNavigate } from "@tanstack/react-router";
import { useSubjectQueries, useSubjectMutations } from "../services";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function SubjectsDetailsPage() {
    
    //const { subjectId } = useParams({ from: '/app/materias/$subjectId' });
    const subjectId = 9;
    const navigate = useNavigate();

    const { useGetSubjectById } = useSubjectQueries();
    const { useDeleteSubjectMutation } = useSubjectMutations();

    const { data: subject, isLoading: isLoadingSubject, error: subjectError } = useGetSubjectById(Number(subjectId));
    const deleteSubjectMutation = useDeleteSubjectMutation();

    const handleGoBack = () => {
        navigate({ to: '/app/materias' });
    };

    const handleEditSubject = () => {}

    const handleDeleteSubject = () => {}

    return (
        <div className="space-y-6">
          {/* Header com botão voltar */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voltar para grupos"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Detalhes do Grupo</h1>
              <p className="text-gray-600">Visualize as informações e matérias do grupo</p>
            </div>
          </div>
    
          {/* Informações do Grupo */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16">
                  <div className="h-16 w-16 rounded-full bg-academo-sage flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {subject?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{subject?.name}</h2>
                </div>
              </div>
              
              {/* Status Badge e Botões de Ação */}
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subject?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subject?.isActive ? 'Ativo' : 'Inativo'}
                </div>
                
                {/* Botões de Edição e Exclusão */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEditSubject}
                    className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                    title="Editar matéria"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleDeleteSubject}
                    disabled={deleteSubjectMutation.isPending}
                    className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Excluir matéria"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
    
            <div className="space-y-4">
              {/* Descrição */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
                <p className="text-gray-600">
                  {subject?.description || (
                    <span className="italic text-gray-400">Sem descrição</span>
                  )}
                </p>
              </div>
    
            </div>
          </div>
    
         
          
        </div>
    );
}
    