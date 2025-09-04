import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSubjectQuery } from '../../api/queries/subject';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function Home() {
  const { useGetSubject } = useSubjectQuery();
  const [isFetchingSubject, setIsFetchingSubject] = useState(false)
  const [subjectId, setSubjectId] = useState<number>(2)
  const queryClient = useQueryClient()

  // Query para buscar matéria baseada no subjectId
  const { data: subject, isLoading: isLoadingSubject, error: subjectError } = useGetSubject(subjectId)

  const handleGetSubject = async () => {
    setIsFetchingSubject(true)

    
    try {
      console.log('🔍 Invalidando query para forçar refetch...')
      // Invalida a query para forçar um novo fetch
      await queryClient.invalidateQueries({ 
        queryKey: ['subject', subjectId],
        exact: true 
      })
      
      console.log('✅ Query invalidada com sucesso')
      console.log('🔄 Aguardando dados atualizados...')
      
      // Aguarda um pouco para os dados serem atualizados
      setTimeout(() => {
        const currentData = queryClient.getQueryData(['subject', subjectId])
        console.log('📈 Dados atualizados:', currentData)
        setIsFetchingSubject(false)
      }, 100)
      
    } catch (error) {
      console.error('❌ Erro ao buscar matéria:', error)
      console.error('🔍 Detalhes do erro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      })
      setIsFetchingSubject(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Academo</h1>
        <p className="text-gray-600">Sistema de gerenciamento acadêmico com React, TypeScript e Tailwind CSS</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Buscar Matéria</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
              ID da Matéria
            </label>
            <Input
              id="subjectId"
              type="number"
              placeholder="Digite o ID da matéria"
              value={subjectId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubjectId(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={handleGetSubject}
            disabled={isFetchingSubject}
            variant="success"
            className="w-full"
          >
            {isFetchingSubject ? 'Buscando...' : 'Buscar Matéria'}
          </Button>
        </div>
        
        {/* Exibição da matéria */}
        {isLoadingSubject && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {subjectError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Erro ao carregar matéria: Aparentemente não conseguimos encontrar a matéria que você está procurando.</p>
          </div>
        )}
        
        {subject && !isLoadingSubject && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Matéria Encontrada:</h3>
            <p className="text-gray-700"><strong>Nome:</strong> {subject.name}</p>
            <p className="text-gray-700"><strong>Descrição:</strong> {subject.description}</p>
          </div>
        )}
      </div>
    </div>
  )
} 