import React, { useState } from 'react';
import { contenuApi } from '../../api/client';

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCreated?: () => void;
}

const AddContenuModal: React.FC<Props> = ({ open, setOpen, onCreated }) => {
  const [form, setForm] = useState({ titre: '', urlImage: '', prix: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await contenuApi.create({ titre: form.titre, urlImage: form.urlImage, prix: Number(form.prix || 0) });
      onCreated && onCreated();
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-md text-slate-100">
        <h3 className="text-xl font-semibold mb-4">Ajouter un contenu</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Titre</label>
            <input name="titre" value={form.titre} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200" />
          </div>
          <div>
            <label className="block text-sm mb-1">URL image</label>
            <input name="urlImage" value={form.urlImage} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200" />
          </div>
          <div>
            <label className="block text-sm mb-1">Prix</label>
            <input name="prix" value={form.prix} onChange={handleChange} type="number" min={0} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200" />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-gray-700 text-white">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">{loading ? 'Création...' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContenuModal;
