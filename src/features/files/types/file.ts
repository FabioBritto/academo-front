import api from "../../../shared/services/api";

// FileDTO retornado pela API
export interface FileDTO {
    uuid: string;
    fileName: string;
    path: string;
    fileType: string;
    size: number;
    subjectId: number;
    createdAt: string; // LocalDateTime vem como string da API
}

// DTO para fazer upload de arquivo (POST)
export interface UploadFileDTO {
    file: File;
    subjectId: number;
}

export const filesApi = {
    // GET /files - Lista todos os arquivos do usuário
    getFiles: async () => {
        const response = await api.get<FileDTO[]>(`/files`);
        return response.data;
    },

    // GET /files?uuid={uuid} - Busca um arquivo específico
    getFileByUuid: async (uuid: string) => {
        const response = await api.get<FileDTO>(`/files?uuid=${uuid}`);
        return response.data;
    },

    // GET /files/by-subject?subjectId={subjectId} - Lista arquivos de uma matéria
    getFilesBySubject: async (subjectId: number) => {
        const response = await api.get<FileDTO[]>(`/files?subjectId=${subjectId}`);
        return response.data;
    },

    // POST /files - Faz upload de um arquivo
    uploadFile: async (payload: UploadFileDTO) => {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('subjectId', payload.subjectId.toString());
        
        const response = await api.post<FileDTO>("/files/upload-file", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // DELETE /files?uuid={uuid} - Remove um arquivo
    deleteFile: async (uuid: string) => {
        await api.delete(`/files?uuid=${uuid}`);
        // A API retorna 204 No Content
    },
};

