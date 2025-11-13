import React, { useState, useEffect } from 'react';
import academoLogo from '../../assets/academo-logo.jpeg';
import { CreateUserModal } from './CreateUserModal';
import { LoginModal } from './LoginModal';

const Landing: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const slides = [
    {
      title: "Nunca mais perca um prazo",
      description: "Agende suas matérias, provas e atividades em um só lugar.",
      icon: "fas fa-calendar-alt"
    },
    {
      title: "Esteja sempre um passo à frente",
      description: "Receba notificações por email e nunca seja pego de surpresa.",
      icon: "fas fa-bell"
    },
    {
      title: "Seus materiais sempre à mão",
      description: "Faça upload e download de arquivos de forma simples e rápida.",
      icon: "fas fa-cloud-upload-alt"
    },
    {
      title: "Acompanhe seu progresso",
      description: "Gerencie suas notas e tenha uma visão clara do seu desempenho acadêmico.",
      icon: "fas fa-chart-line"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  return (
    
    <div className="font-sans antialiased text-gray-800">
      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-academo-brown via-academo-sage to-academo-brown text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sua vida acadêmica, finalmente em ordem.
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Concentre-se no que realmente importa: seus estudos. Deixe que a nossa plataforma cuide da organização para você.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={openCreateUserModal}
                className="bg-academo-cream text-academo-brown hover:bg-white px-8 py-3 rounded-lg font-bold text-lg transition duration-300"
              >
                Comece a se Organizar Agora
              </button>
              <button className="border-2 border-white text-white hover:bg-academo-cream hover:text-academo-brown px-8 py-3 rounded-lg font-bold text-lg transition duration-300">
                Veja como Funciona
              </button>
            </div>
          </div>
          
          {/* Carousel */}
          <div className="relative max-w-4xl mx-auto h-64 md:h-96 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 h-full w-full flex flex-col md:flex-row items-center justify-center p-8 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                  <h3 className="text-2xl font-bold mb-3">{slide.title}</h3>
                  <p className="text-lg">{slide.description}</p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <i className={`${slide.icon} text-6xl md:text-8xl opacity-80`}></i>
                </div>
              </div>
            ))}
            
            {/* Carousel controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => showSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white opacity-100' 
                      : 'bg-white opacity-50 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tudo o que você precisa para uma jornada acadêmica de sucesso
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recursos poderosos para ajudar você a se organizar, acompanhar seu progresso e alcançar seus objetivos acadêmicos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl">
                          <div className="w-16 h-16 bg-academo-peach rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-calendar text-academo-brown text-2xl"></i>
            </div>
              <h3 className="text-xl font-bold mb-3">Agendamento Inteligente</h3>
              <p className="text-gray-600">
                Crie seu cronograma de aulas, defina datas de provas e entregas de trabalhos. Visualize tudo em um calendário intuitivo e personalizável.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl">
                          <div className="w-16 h-16 bg-academo-sage rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-bell text-academo-brown text-2xl"></i>
            </div>
              <h3 className="text-xl font-bold mb-3">Notificações Automáticas</h3>
              <p className="text-gray-600">
                Configure alertas e receba lembretes por email sobre seus próximos compromissos acadêmicos, garantindo que você esteja sempre preparado.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl">
                          <div className="w-16 h-16 bg-academo-cream rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-cloud-upload-alt text-academo-brown text-2xl"></i>
            </div>
              <h3 className="text-xl font-bold mb-3">Repositório de Arquivos</h3>
              <p className="text-gray-600">
                Guarde todos os seus materiais de estudo, trabalhos e anotações em um só lugar. Acesse de qualquer dispositivo, a qualquer momento.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl">
                          <div className="w-16 h-16 bg-academo-peach rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-chart-line text-academo-brown text-2xl"></i>
            </div>
              <h3 className="text-xl font-bold mb-3">Gerenciamento de Notas</h3>
              <p className="text-gray-600">
                Registre suas notas por matéria, calcule médias e tenha uma visão completa do seu rendimento. Identifique pontos de melhoria e foque nos seus objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              O que os estudantes estão dizendo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja como nossa plataforma está ajudando estudantes a se organizarem melhor e alcançarem melhores resultados.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-academo-peach flex items-center justify-center mr-4">
          <i className="fas fa-user text-academo-brown"></i>
        </div>
                <div>
                  <h4 className="font-bold">Ana Clara</h4>
                  <p className="text-gray-600 text-sm">Engenharia Civil, UFMG</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Desde que comecei a usar o Academo, minha organização melhorou 100%. Não perco mais nenhum prazo! A plataforma é intuitiva e realmente faz diferença no meu dia a dia acadêmico."
              </p>
              <div className="mt-4 text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-academo-sage flex items-center justify-center mr-4">
          <i className="fas fa-user text-academo-brown"></i>
        </div>
                <div>
                  <h4 className="font-bold">Pedro Henrique</h4>
                  <p className="text-gray-600 text-sm">Medicina, USP</p>
                </div>
              </div>
              <p className="text-gray-700">
                "A função de gerenciamento de notas é incrível para acompanhar meu progresso ao longo do semestre. Agora consigo visualizar claramente onde preciso melhorar e me organizar melhor para as provas."
              </p>
              <div className="mt-4 text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-academo-brown to-academo-sage text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua vida acadêmica?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão otimizando seus estudos.
          </p>
          <button 
            onClick={openCreateUserModal}
            className="bg-academo-cream text-academo-brown hover:bg-white px-8 py-4 rounded-lg font-bold text-lg transition duration-300 shadow-lg"
          >
            Comece Agora Gratuitamente
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={academoLogo} 
                  alt="Academo Logo" 
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
                <span className="text-3xl font-bold">Academo</span>
              </div>
              <p className="text-gray-400">
                A plataforma definitiva para organização acadêmica. Feita por estudantes, para estudantes.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('hero')}
                    className="text-gray-400 hover:text-white transition text-left"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-gray-400 hover:text-white transition text-left"
                  >
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('testimonials')}
                    className="text-gray-400 hover:text-white transition text-left"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition text-left">
                    Contato
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-400 hover:text-white transition text-left">
                    Termos de Serviço
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition text-left">
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition text-left">
                    Sobre Nós
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-indigo-600 flex items-center justify-center transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-400 flex items-center justify-center transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
              <div className="mt-6">
                <p className="text-gray-400 mb-2">Entre em contato:</p>
                <a href="mailto:contato@academo.com" className="text-indigo-400 hover:text-indigo-300">
                  contato@academo.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Academo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Criação de Usuário */}
      <CreateUserModal 
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onLogin={() => setIsLoginModalOpen(true)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onCreateAccount={() => setIsCreateUserModalOpen(true)}
      />
    </div>
  );
};

export default Landing; 