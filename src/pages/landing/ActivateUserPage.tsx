import React, { useEffect, useState } from 'react';
import academoLogo from '../../assets/academo-logo.jpeg';
import { useNavigate } from '@tanstack/react-router';
import { useUserMutations } from '../../features/auth/services';

const ActivateUser: React.FC = () => {

    const navigate = useNavigate();
  

  const [activationToken, setActivationToken] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState<boolean | null>(null);
  const { useActivateUserMutation } = useUserMutations();
  const activateMutation = useActivateUserMutation();

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('value');

    if (tokenFromUrl) {
      setActivationToken(String(tokenFromUrl));
    }
  }, []);

  useEffect(() => {
    if (!activationToken) return;

    const doActivate = async () => {
      setIsActivating(true);
      try {
        await activateMutation.mutateAsync(activationToken);
        setIsActivated(true);
      } catch (err) {
        setIsActivated(false);

      } finally {
        setIsActivating(false);
      }
    };

    doActivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activationToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-academo-brown via-academo-sage to-academo-brown p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <img 
              src={academoLogo} 
              alt="Academo Logo" 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mr-3"
            />
            <span className="text-4xl md:text-5xl font-bold text-white">Academo</span>
          </div>
        </div>

        {/* Card de Status */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Loading State */}
          {isActivating && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-academo-brown"></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Ativando sua conta...
              </h2>
              <p className="text-gray-600 text-lg">
                Por favor, aguarde enquanto processamos sua solicitação.
              </p>
            </div>
          )}

          {/* Success State */}
          {!isActivating && isActivated === true && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-6">
                  <svg 
                    className="w-16 h-16 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Conta Ativada com Sucesso!
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mb-6">
                Sua conta foi ativada com sucesso. Você será redirecionado para a página inicial em alguns segundos.
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse text-academo-brown font-semibold">
                  Redirecionando...
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isActivating && isActivated === false && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-6">
                  <svg 
                    className="w-16 h-16 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Falha na Ativação
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mb-6">
                Não foi possível ativar sua conta. O link pode estar expirado ou inválido.
              </p>
              <p className="text-gray-500 text-base mb-6">
                Por favor, tente novamente ou entre em contato com o suporte.
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse text-academo-brown font-semibold">
                  Redirecionando para página inicial...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateUser; 