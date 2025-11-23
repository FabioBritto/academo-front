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
    firstName: "",
    lastName: "",
    institution: "",
    gender: "",
    birthDate: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    institution: "",
  });

  // Função para converter M/F para texto exibido
  const getGenderLabel = (gender: string) => {
    if (gender === "M") return "Masculino";
    if (gender === "F") return "Feminino";
    return gender || "Não informado";
  };

  // Função para separar o fullName em firstName e lastName
  const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(' ') || "";
    return { firstName, lastName };
  };

  // Preenche o formulário quando o perfil carrega
  useEffect(() => {
    if (profile) {
      const { firstName, lastName } = splitFullName(profile.fullName || "");
      setFormData({
        firstName,
        lastName,
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
      const { firstName, lastName } = splitFullName(profile.fullName || "");
      setFormData({
        firstName,
        lastName,
        institution: profile.institution || "",
        gender: profile.gender || "",
        birthDate: profile.birthDate 
          ? new Date(profile.birthDate).toISOString().split('T')[0]
          : "",
      });
    }
    setErrors({ firstName: "", lastName: "", institution: "" });
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validação de limites
    const newErrors = {
      firstName: "",
      lastName: "",
      institution: "",
    };

    if (formData.firstName.length > 20) {
      newErrors.firstName = "O primeiro nome deve ter no máximo 20 caracteres";
    }
    if (formData.lastName.length > 50) {
      newErrors.lastName = "O sobrenome deve ter no máximo 50 caracteres";
    }
    if (formData.institution.length > 80) {
      newErrors.institution = "A instituição deve ter no máximo 80 caracteres";
    }

    setErrors(newErrors);

    // Se houver erros, não salva
    if (newErrors.firstName || newErrors.lastName || newErrors.institution) {
      return;
    }

    try {
      const payload: any = {};
      
      // Concatena firstName e lastName para formar fullName
      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      if (firstName || lastName) {
        payload.fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      }
      
      if (formData.institution) payload.institution = formData.institution.trim();
      // Garante que apenas M ou F seja enviado
      if (formData.gender && (formData.gender === "M" || formData.gender === "F")) {
        payload.gender = formData.gender;
      }
      if (formData.birthDate) {
        payload.birthDate = new Date(formData.birthDate);
      }

      await updateProfile.mutateAsync(payload);
      setIsEditing(false);
      setErrors({ firstName: "", lastName: "", institution: "" });
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Limita o tamanho do input conforme o campo
    let limitedValue = value;
    if (field === "firstName" && value.length > 20) {
      limitedValue = value.slice(0, 20);
    } else if (field === "lastName" && value.length > 50) {
      limitedValue = value.slice(0, 50);
    } else if (field === "institution" && value.length > 80) {
      limitedValue = value.slice(0, 80);
    }

    setFormData(prev => ({ ...prev, [field]: limitedValue }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
                    {(isEditing ? formData.firstName : profile.fullName?.split(' ')[0])?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              {/* Nome Completo - Modo Visualização */}
              {!isEditing && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <p className="text-lg text-academo-brown font-medium mt-1 break-words whitespace-normal overflow-wrap-anywhere">
                    {profile.fullName || "Não informado"}
                  </p>
                </div>
              )}

              {/* Primeiro Nome - Modo Edição */}
              {isEditing && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-600">Primeiro Nome</label>
                    <span className="text-xs text-gray-500">
                      {formData.firstName.length}/20
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    maxLength={20}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite seu primeiro nome"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
              )}

              {/* Sobrenome - Modo Edição */}
              {isEditing && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-600">Sobrenome</label>
                    <span className="text-xs text-gray-500">
                      {formData.lastName.length}/50
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    maxLength={50}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite seu sobrenome"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              )}

              {/* Instituição */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-600">Instituição</label>
                  {isEditing && (
                    <span className="text-xs text-gray-500">
                      {formData.institution.length}/80
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                      maxLength={80}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown focus:border-transparent ${
                        errors.institution ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Digite sua instituição"
                    />
                    {errors.institution && (
                      <p className="mt-1 text-sm text-red-500">{errors.institution}</p>
                    )}
                  </>
                ) : (
                  <p className="text-lg text-academo-brown font-medium mt-1 break-words whitespace-normal overflow-wrap-anywhere">
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

