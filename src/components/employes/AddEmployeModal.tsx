import React, { useState } from "react";
import { usersApi } from '../../api/client';

interface AddEmployeModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onCreated?: () => void;
  onUpdated?: (updated: any) => void;
  initial?: { id?: string; name?: string; job?: string; email?: string; role?: string; phone?: string; department?: string; status?: string; avatar?: string; joinDate?: string; performance?: number };
}

const AddEmployeModal = ({ setIsModalOpen, onCreated, onUpdated, initial }: AddEmployeModalProps) => {
  const [form, setForm] = useState({
    name: initial?.name || "",
    job: initial?.job || "",
    email: initial?.email || "",
    role: initial?.role || "user",
    phone: initial?.phone || '',
    department: initial?.department || '',
    status: (initial as any)?.status || 'active',
    avatar: (initial as any)?.avatar || '',
    joinDate: (initial as any)?.joinDate ? (initial as any).joinDate.split('T')[0] : '',
    performance: (initial as any)?.performance || 80
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        job: form.job,
        role: form.role,
        phone: form.phone,
        department: form.department,
        status: form.status,
        avatar: form.avatar,
        joinDate: form.joinDate,
        performance: form.performance
      } as any;

      if (initial && initial.id) {
        const updated = await usersApi.update(initial.id, payload);
        onUpdated && onUpdated(updated.data || updated);
      } else {
        await usersApi.create(payload);
        onCreated && onCreated();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md text-slate-100">
        <h3 className="text-xl font-semibold mb-4">Ajouter un employé</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Nom complet</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Poste</label>
            <input
              type="text"
              name="job"
              value={form.job}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <input
              type="text"
              name="phone"
              value={(form as any).phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Département</label>
            <input
              type="text"
              name="department"
              value={(form as any).department}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Statut</label>
            <select name="status" value={(form as any).status} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="vacation">En Congé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Avatar (initiales)</label>
            <input type="text" name="avatar" value={(form as any).avatar} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Date d'entrée</label>
            <input type="date" name="joinDate" value={(form as any).joinDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Performance (%)</label>
            <input type="number" name="performance" value={(form as any).performance} onChange={handleChange} min={0} max={100} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:border-blue-500 outline-none" />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex justify-end gap-3 mt-6">
            <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Fermer
                  </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:scale-[1.03] shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeModal;
