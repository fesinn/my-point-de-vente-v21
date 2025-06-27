
import React, { useState } from 'react';
import { EstablishmentDetails } from '../types';
import Icon from './Icon';
import { auth } from '../firebase/config';

interface LoginScreenProps {
  setLoginError: (error: string | null) => void;
  establishmentDetails: EstablishmentDetails;
  loginError: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setLoginError, establishmentDetails, loginError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // onAuthStateChanged in App.tsx will handle the rest
    } catch (error: any) {
      console.error("Login failed:", error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setLoginError("Email ou mot de passe incorrect.");
      } else {
        setLoginError("Une erreur de connexion est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          {establishmentDetails.logoUrl ? (
            <img src={establishmentDetails.logoUrl} alt="Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
          ) : (
             <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Icon name="PriceCheckIcon" className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">{establishmentDetails.name}</h1>
          <p className="text-gray-500">Veuillez vous connecter pour continuer</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="votre.email@exemple.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {loginError && (
            <div className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">
              {loginError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion en cours...' : 'Connexion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
