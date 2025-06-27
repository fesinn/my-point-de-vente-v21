
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import Modal from '../Modal';
import Icon from '../Icon';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: Omit<User, 'id'>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Cashier);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name.trim()) { setError("Le nom de l'utilisateur est requis."); setIsLoading(false); return; }
    if (!email.trim()) { setError("L'email de l'utilisateur est requis."); setIsLoading(false); return; }
    if (!password) { setError("Le mot de passe est requis."); setIsLoading(false); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); setIsLoading(false); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); setIsLoading(false); return; }
    
    try {
        // No Firebase call, just prepare data for local state update.
        // The password is not used/stored in the offline version.
        const userDataForDb = {
            name: name.trim(),
            email: email.trim(),
            role: role
        };
        onAddUser(userDataForDb);
        handleClose();
    } catch (err: any) {
        setError("Une erreur est survenue lors de l'ajout de l'utilisateur.");
        console.error("Error adding user:", err);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole(UserRole.Cashier);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter un Nouvel Utilisateur">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</p>}
        
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nom Complet <span className="text-red-500">*</span></label>
          <input type="text" id="userName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" required />
        </div>
        
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Adresse Email <span className="text-red-500">*</span></label>
          <input type="email" id="userEmail" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" required />
        </div>

        <div>
          <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">Rôle <span className="text-red-500">*</span></label>
          <select id="userRole" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" required>
            <option value={UserRole.Cashier}>Caissier</option>
            <option value={UserRole.Manager}>Gérant</option>
            <option value={UserRole.Admin}>Administrateur</option>
          </select>
        </div>

        <div>
          <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
          <input type="password" id="userPassword" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" required />
        </div>

        <div>
          <label htmlFor="userConfirmPassword" className="block text-sm font-medium text-gray-700">Confirmer Mot de passe <span className="text-red-500">*</span></label>
          <input type="password" id="userConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" required />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={handleClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-50"> Annuler </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none flex items-center disabled:bg-indigo-400">
            {isLoading ? 'Ajout en cours...' : (<><Icon name="PlusCircleIcon" className="w-5 h-5 mr-2" />Ajouter Utilisateur</>)}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
