import React, { useState, useRef } from 'react';
import { Upload, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFileMutations } from '../services/file';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId?: number | null;
  onUploadSuccess?: () => void;
}

const ALLOWED_FILE_TYPES = [
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/pdf', // .pdf
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
];

const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf', '.jpg', '.jpeg', '.png'];

export function UploadFileModal({ isOpen, onClose, subjectId, onUploadSuccess }: UploadFileModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { useUploadFileMutation } = useFileMutations();
  const uploadFileMutation = useUploadFileMutation();

  if (!isOpen) return null;

  const validateFile = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type);

    if (!isValidExtension && !isValidType) {
      toast.error(`Tipo de arquivo não permitido. Apenas ${ALLOWED_EXTENSIONS.join(', ')} são aceitos.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      // Limpa o input se o arquivo for inválido
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo');
      return;
    }

    if (!subjectId) {
      toast.error('Por favor, selecione uma matéria primeiro');
      return;
    }

    try {
      await uploadFileMutation.mutateAsync({ 
        file: selectedFile, 
        subjectId 
      });
      
      toast.success('Arquivo enviado com sucesso!');
      handleClose();
      onUploadSuccess?.();
    } catch (error) {
      // O erro será tratado automaticamente pelo React Query
      // O toast de erro já é mostrado no componente
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleClose = () => {
    if (!uploadFileMutation.isPending) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
          {/* Header */}
          <div className="bg-gradient-to-r from-academo-brown to-academo-sage px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Adicionar Arquivo
                </h3>
                <p className="text-orange-100 text-sm mt-1">
                  Selecione um arquivo para fazer upload
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={uploadFileMutation.isPending}
                className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* File Input Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o arquivo
              </label>
              <div
                onClick={() => !uploadFileMutation.isPending && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-academo-brown bg-academo-brown/5'
                    : 'border-gray-300 hover:border-academo-brown hover:bg-gray-50'
                } ${uploadFileMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept={ALLOWED_EXTENSIONS.join(',')}
                  disabled={uploadFileMutation.isPending}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      disabled={uploadFileMutation.isPending}
                      className="mx-auto p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remover arquivo"
                    >
                      <Trash2 className="w-12 h-12" />
                    </button>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Clique para selecionar ou arraste o arquivo aqui
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Formatos aceitos: {ALLOWED_EXTENSIONS.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploadFileMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || !subjectId || uploadFileMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-academo-brown rounded-lg hover:bg-academo-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploadFileMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

