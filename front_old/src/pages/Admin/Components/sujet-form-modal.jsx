import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../../../axios-instance';

const SujetFormModal = ({ sujet, closeModal, setSujets, editMode, token }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [categorie, setCategorie] = useState('');

    useEffect(() => {
        if (editMode && sujet) {
            setTitre(sujet.titre);
            setDescription(sujet.description);
            setCategorie(sujet.categorie);
        }
    }, [sujet, editMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editMode ? `sujet/update/${sujet.id}` : 'sujet/create';
        const method = editMode ? 'put' : 'post';
        try {
            const response = await axiosInstance({
                method: method,
                url: url,
                data: {
                    titre,
                    description,
                    category:categorie
                }
            });
            if (editMode) {
                setSujets(prev => prev.map(item => item.id === sujet.id ? response.data : item));
            } else {
                setSujets(prev => [...prev, response.data]);
            }
            toast.success(`Sujet ${editMode ? 'modifié' : 'ajouté'} avec succès!`);
            closeModal();
        } catch (error) {
            console.error('Failed to submit the subject:', error);
            toast.error(`Error: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg">
                <h2 className="text-lg font-bold">{editMode ? 'Modifier le Sujet' : 'Ajouter un Sujet'}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="titre" className="block text-sm font-medium text-gray-700">Titre</label>
                    <input
                        type="text"
                        id="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                    <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <input
                        type="text"
                        id="categorie"
                        value={categorie}
                        onChange={(e) => setCategorie(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                    <div className="flex justify-end space-x-3 mt-4">
                        <button type="button" onClick={closeModal} className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700">Annuler</button>
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">{editMode ? 'Modifier' : 'Ajouter'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SujetFormModal;
