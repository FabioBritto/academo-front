import { useProfileQueries, useProfileMutations } from "../services/profile";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { useGetProfileQuery } = useProfileQueries();
  const { useUpdateProfileMutation } = useProfileMutations();
  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const updateProfile = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    institution: "",
    gender: "",
    birthDate: "",
  });

  // Função para converter M/F para texto exibido
  const getGenderLabel = (gender: string) => {
    if (gender === "M") return "Masculino";
    if (gender === "F") return "Feminino";
    return gender || "Não informado";
  };

  // Preenche o formulário quando o perfil carrega
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        institution: profile.institution || "",
        gender: profile.gender || "",
        birthDate: profile.birthDate 
          ? new Date(profile.birthDate).toISOString().split('T')[0]
          : "",
      });
    }
  }, [profile]);

  // Reseta o modo de edição quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isEditing) {
      onClose();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Restaura os dados originais do perfil
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        institution: profile.institution || "",
        gender: profile.gender || "",
        birthDate: profile.birthDate 
          ? new Date(profile.birthDate).toISOString().split('T')[0]
          : "",
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const payload: any = {};
      
      if (formData.fullName) payload.fullName = formData.fullName;
      if (formData.institution) payload.institution = formData.institution;
      // Garante que apenas M ou F seja enviado
      if (formData.gender && (formData.gender === "M" || formData.gender === "F")) {
        payload.gender = formData.gender;
      }
      if (formData.birthDate) {
        payload.birthDate = new Date(formData.birthDate);
      }

      await updateProfile.mutateAsync(payload);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-academo-brown">Meu Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academo-brown"></div>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Erro ao carregar perfil. Tente novamente.
            </div>
          )}

          {profile && (
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-academo-brown rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {(isEditing ? formData.fullName : profile.fullName)?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-transparent"
                    placeholder="Digite seu nome completo"
                  />
                ) : (
                  <p className="text-lg text-academo-brown font-medium mt-1">
                    {profile.fullName || "Não informado"}
                  </p>
                )}
              </div>

              {/* Instituição */}
              <div>
                <label className="text-sm font-medium text-gray-600">Instituição</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-transparent"
                    placeholder="Digite sua instituição"
                  />
                ) : (
                  <p className="text-lg text-academo-brown font-medium mt-1">
                    {profile.institution || "Não informado"}
                  </p>
                )}
              </div>

              {/* Gênero */}
              <div>
                <label className="text-sm font-medium text-gray-600">Gênero</label>
                {isEditing ? (
                  <div className="mt-2 flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={formData.gender === "M"}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-4 h-4 text-academo-brown focus:ring-academo-brown focus:ring-2"
                      />
                      <span className="text-academo-brown">Masculino</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={formData.gender === "F"}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-4 h-4 text-academo-brown focus:ring-academo-brown focus:ring-2"
                      />
                      <span className="text-academo-brown">Feminino</span>
                    </label>
                  </div>
                ) : (
                  <p className="text-lg text-academo-brown font-medium mt-1">
                    {getGenderLabel(profile.gender)}
                  </p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg text-academo-brown font-medium mt-1">
                    {profile.birthDate 
                      ? new Date(profile.birthDate).toLocaleDateString('pt-BR')
                      : "Não informado"}
                  </p>
                )}
              </div>

              {/* Armazenamento Usado (sempre somente leitura) */}
              {profile.usageStorage !== undefined && (
                <div>
                  {(() => {
                    const MAX_STORAGE_BYTES = 314572800; // 300 MB em bytes
                    const usageBytes = profile.usageStorage;
                    const usageMB = (usageBytes / (1024 * 1024)).toFixed(2);
                    const maxMB = (MAX_STORAGE_BYTES / (1024 * 1024)).toFixed(0);
                    const percentage = (usageBytes / MAX_STORAGE_BYTES) * 100;
                    
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-600">Armazenamento Usado</label>
                          <span className="text-sm font-medium text-gray-700">
                            {usageMB} MB / {maxMB} MB
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 90
                                ? 'bg-red-500'
                                : percentage >= 70
                                ? 'bg-yellow-500'
                                : 'bg-academo-brown'
                            }`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {percentage.toFixed(1)}% utilizado
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={updateProfile.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-academo-brown rounded-lg hover:bg-academo-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Salvando..." : "Salvar"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-white bg-academo-brown rounded-lg hover:bg-academo-brown/90 transition-colors"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

