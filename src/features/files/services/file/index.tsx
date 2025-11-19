import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "../../types/file";
import type { UploadFileDTO } from "../../types/file";

export const useFileQueries = () => {
    // GET /files - Lista todos os arquivos do usuário
    const useGetFiles = () => {
        return useQuery({
            queryKey: ['files'],
            queryFn: () => filesApi.getFiles(),
        });
    };

    // GET /files?uuid={uuid} - Busca um arquivo específico
    const useGetFileByUuid = (uuid: string) => {
        return useQuery({
            queryKey: ['file', uuid],
            queryFn: () => filesApi.getFileByUuid(uuid),
            enabled: !!uuid, // Só executa se uuid estiver definido
        });
    };

    // GET /files/by-subject?subjectId={subjectId} - Lista arquivos de uma matéria
    const useGetFilesBySubject = (subjectId: number) => {
        return useQuery({
            queryKey: ['files', 'subject', subjectId],
            queryFn: () => filesApi.getFilesBySubject(subjectId),
            enabled: !!subjectId, // Só executa se subjectId estiver definido
        });
    };

    return {
        useGetFiles,
        useGetFileByUuid,
        useGetFilesBySubject,
    };
};

export const useFileMutations = () => {
    const queryClient = useQueryClient();

    // POST /files - Faz upload de um arquivo
    const useUploadFileMutation = () => {
        return useMutation({
            mutationFn: async (payload: UploadFileDTO) => {
                return await filesApi.uploadFile(payload);
            },
            onSuccess: (_data, variables) => {
                // Invalida todas as queries de arquivos
                queryClient.invalidateQueries({ queryKey: ['files'] });
                // Invalida também as queries de arquivos por subject
                queryClient.invalidateQueries({ queryKey: ['files', 'subject', variables.subjectId] });
            },
            onError: (error) => {
                console.error('Erro ao fazer upload do arquivo:', error);
                // O toast será mostrado no componente que chama a mutation
            }
        });
    };

    // DELETE /files?uuid={uuid} - Remove um arquivo
    const useDeleteFileMutation = () => {
        return useMutation({
            mutationFn: async (uuid: string) => {
                return await filesApi.deleteFile(uuid);
            },
            onSuccess: (_data, uuid) => {
                // Invalida todas as queries de arquivos e remove a query do arquivo específico
                queryClient.invalidateQueries({ queryKey: ['files'] });
                queryClient.removeQueries({ queryKey: ['file', uuid] });
            },
            onError: (error) => {
                return `Não foi possível deletar o arquivo: ${error.message}`;
            }
        });
    };

    return {
        useUploadFileMutation,
        useDeleteFileMutation,
    };
};

