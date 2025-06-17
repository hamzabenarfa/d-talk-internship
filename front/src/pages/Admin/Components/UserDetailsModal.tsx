// @ts-nocheck

const UserDetailsModal = ({ user, onClose, onDownloadCV }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative top-20 mx-auto p-6 border w-96 max-w-lg shadow-lg rounded-lg bg-white transition-transform transform hover:scale-105">
        <div className="text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Détails de l'Utilisateur</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">Nom: {user.user.nom}</p>
            <p className="text-sm text-gray-700">Email: {user.user.email}</p>
            <p className="text-sm text-gray-700">Téléphone: {user.user.telephone}</p>
            <p className="text-sm text-gray-700">Rôle: {user.user.role}</p>
            <p className="text-sm text-gray-700">Statut: {user.enabled ? 'Actif' : 'Inactif'}</p>
          </div>
          <div className='flex flex-row justify-center items-center gap-3 mt-4'>
            <button 
              onClick={() => onDownloadCV(user.id)} 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              Télécharger docs
            </button>
          
          </div>
          <div className="mt-5">
            <button onClick={onClose} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
