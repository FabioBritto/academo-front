import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSubjectQuery } from '../../api/queries/subject.query';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';

// Simulação de API
const fetchUsers = async (): Promise<{ id: number; name: string; email: string }[]> => {
  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, name: 'João Silva', email: 'joao@email.com' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com' },
  ]
}

const createUser = async (user: { name: string; email: string }): Promise<{ id: number; name: string; email: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return { id: Math.random(), ...user }
}

export function Home() {
  const { useGetSubject } = useSubjectQuery();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isFetchingSubject, setIsFetchingSubject] = useState(false)
  const [subjectId, setSubjectId] = useState<number>(2)
  const queryClient = useQueryClient()

  // Query para buscar matéria baseada no subjectId
  const { data: subject, isLoading: isLoadingSubject, error: subjectError } = useGetSubject(subjectId)

  // Query para buscar usuários
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  // Mutation para criar usuário
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalida e refaz a query dos usuários
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setName('')
      setEmail('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email) {
      createUserMutation.mutate({ name, email })
    }
  }

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Erro ao carregar usuários: {error.message}</p>
      </div>
    )
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
              <p className="text-red-800">Erro ao carregar matéria: {toast.error("Desculpe. Mas aparentemente não conseguimos encontrar a matéria que você está procurando.")}</p>
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

      {/* Formulário para adicionar usuário */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Novo Usuário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createUserMutation.isPending ? 'Adicionando...' : 'Adicionar Usuário'}
          </button>
        </form>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Usuários Cadastrados</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {users?.map((user) => (
            <div key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ativo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 