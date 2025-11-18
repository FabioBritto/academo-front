import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateUserDTO, LoginDTO } from "../../types/user";
import { usersApi } from "../../types/user";
import api from "../../../../shared/services/api";
import { useAuthStore } from "../../hooks/use-auth-store";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

// Função para verificar se o token atual é válido
export const validateToken = async (): Promise<boolean> => {
  try {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      return false;
    }
    
    const { user } = useAuthStore.getState();
    
    if (!user) {
      return false;
    }
    
    
    return true;
  } catch (error) {
    // Se der erro (401, 403, etc.), o token é inválido
    return false;
  }
};

// Configurar interceptadores de autenticação
export const setupAuthInterceptors = () => {
  // Interceptador de requisição - adiciona token automaticamente
  api.interceptors.request.use(
    (config) => {
      // Pega o token do store de autenticação
      const { token } = useAuthStore.getState();
      
      // Se existe token, adiciona no header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptador de resposta - trata erros de autenticação
  api.interceptors.response.use(
    (response) => {
      // Se a resposta foi bem-sucedida, apenas retorna
      return response;
    },
    (error) => {
      // Se receber erro 401 (Unauthorized) ou 403 (Forbidden)
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Limpa o estado de autenticação
        const { logout } = useAuthStore.getState();
        logout();
        
        // Redireciona para a página de login
        // Usar window.location para forçar o redirecionamento
        window.location.href = '/';
        
        // Opcional: mostrar mensagem de erro
        console.warn('Sessão expirada. Redirecionando para login...');
      }
      
      return Promise.reject(error);
    }
  );
};

export const useUserMutations = () => {

    const queryClient = useQueryClient();

    const useCreateUserMutation = () => {
        return useMutation({
            mutationFn: async (payload: CreateUserDTO) => {
                return await usersApi.createUser(payload);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["user"] });
            },
            onError: (error) => {
                return `Não foi possível criar o usuário: ${error.message}`;
            }
        })
    }

    const useLoginMutation = () => {
        return useMutation({
            mutationFn: async (payload: LoginDTO) => {
                return (await usersApi.login(payload));
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["user"] });
            },
            onError: (error) => {
                return `Não foi possível fazer login: ${error.message}`;
            }
        })
    }

    const useActivateUserMutation = () => {
      const navigate = useNavigate();
      return useMutation({
        mutationFn: async (value: string) => {
          // Perform activation with a per-request timeout of 10 seconds
          // Using the shared `api` instance so interceptors and baseURL are respected
          return await usersApi.activate(value);
        },
        onSuccess: () => {
          setTimeout(() => {
            navigate({ to: "/app/home" });
          }, 5000);
        },
        onError: (error) => {
          setTimeout(() => {
            navigate({ to: "/app/home" });
          }, 5000);
        }
      })
    }

    return {
        useCreateUserMutation,
        useLoginMutation,
        useActivateUserMutation
    }
}