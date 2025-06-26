import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import LoginVideoBackground from '../components/LoginVideoBackground';
import '../styles/login-page.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Force light mode for login page
  React.useEffect(() => {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }, []);
  
  const isDarkMode = false; // Always light mode for login page

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Temporary authentication logic
    if (email === 'admin@espora.com' && password === 'password') {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        alert('Credenciales inválidas');
      }, 1500);
    }
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="flex items-center w-full p-6">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
      </div>
      
      <div className="cards-container">
        <div className="login-card form-card">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <img 
                src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/refs/heads/main/esporaLogo.png"
                alt="Espora Logo"
                className={`w-24 h-auto transition-all duration-300 ${
                  isDarkMode ? 'brightness-0 invert' : 'brightness-1'
                }`}
              />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white text-center">Iniciar sesión</h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              ¡Bienvenido! Por favor ingresa tu usuario y contraseña para acceder a tu cuenta.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  required
                  className="input-field"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="input-field"
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-200">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button 
                type="submit" 
                className="login-button w-full"
                disabled={isLoading}
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>

        <div className="login-card image-card">
          <LoginVideoBackground />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;