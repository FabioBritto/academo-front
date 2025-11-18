import { useParams, useNavigate } from "@tanstack/react-router";
import { useSubjectQueries } from "../services";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function SubjectsDetailsPage() {
    const { subjectId } = useParams({ from: '/app/materias/$subjectId' });
    const navigate = useNavigate();

    const { useGetSubjectById } = useSubjectQueries();

    const { data: subject, isLoading: isLoadingSubject } = useGetSubjectById(Number(subjectId));

    useEffect(() => {
      console.log('subject', subject);
      console.log('subjectId', subjectId);
    }, [subject, subjectId]);

    const handleGoBack = () => {
        navigate({ to: '/app/materias' });
    };

    return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject?.name || 'Detalhes da Matéria'}</h1>
              <p className="text-gray-600">Visualize as informações da matéria</p>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <button 
                type="button"
                onClick={handleGoBack}
                className="bg-academo-brown hover:bg-academo-sage text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </button>
              
              {/* Status Badge */}
              {subject && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subject.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    subject.isActive ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  {subject.isActive ? 'Ativo' : 'Inativo'}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {isLoadingSubject ? (
              <p className="text-gray-500">Carregando...</p>
            ) : subject ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-600">
                    {subject.description || (
                      <span className="italic text-gray-400">Sem descrição</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Matéria não encontrada</p>
            )}
          </div>
        </div>
    );
}
    