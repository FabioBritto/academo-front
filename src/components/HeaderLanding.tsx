import { Link, Outlet } from '@tanstack/react-router';
import academoLogo from '../assets/academo-logo.jpeg'
import { useState } from 'react';
import { CreateUserModal } from './pages/landing-page/CreateUserModal';

export function HeaderLanding() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if(element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };



  return (
    <div className="font-sans antialiased text-gray-800">
      <header className="sticky top-0 z-50 bg-academo-cream shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-center md:justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={academoLogo} alt="Academo" className="w-10 h-10 rounded-full object-cover mr-2" />
            <h1 className="text-xl font-bold text-academo-brown">Academo</h1>
          </div>
          
          
          {/* Navegação */}
          <nav className="hidden md:flex space-x-8 mb-4 md:mb-0">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-academo-brown font-medium"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-academo-brown transition"
            >
              Funcionalidades
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-600 hover:text-academo-brown transition"
            >
              Depoimentos
            </button>
            <button className="text-gray-600 hover:text-academo-brown transition">
              Contato
            </button>
          </nav>
          
          {/* Botão CTA */}
          <button 
            onClick={openCreateUserModal}
            className="hidden md:block bg-academo-brown hover:bg-academo-sage text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Crie sua Conta Grátis
          </button>
          
          {/* Menu mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 absolute top-4 right-4"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-academo-cream py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-academo-brown font-medium text-left"
              >
                Início
            </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-indigo-600 transition text-left"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-600 hover:text-indigo-600 transition text-left"
              >
                Depoimentos
              </button>
              <button className="text-gray-600 hover:text-indigo-600 transition text-left">
                Contato
              </button>
              <button 
                onClick={openCreateUserModal}
                className="bg-academo-brown hover:bg-academo-sage text-white px-6 py-2 rounded-lg font-medium transition duration-300 w-full"
              >
                Crie sua Conta Grátis
              </button>
            </div>
          </div>
        )}
      </header>

      <Outlet />

      {/* Modal de Criação de Usuário */}
      <CreateUserModal 
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
      />
    </div>
  )
}
