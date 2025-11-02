import React, { useState } from 'react';
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { BarreLateraleFans } from '../components/BarreLateraleFans';
import { CarteContenu } from '../components/CarteContenu';
import type { Fan, Contenu } from '../types/types';
import { useFans, useContent, useUsers } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';
import { ActionButton } from '../components/ui/ActionButton';
import { messagesApi, profileApi } from '../api/client';
import { useToast } from '../components/ui/Toast';

// Helper: format a Date string to a short relative label (e.g. "Il y a 2 jours")
const formatRelative = (dateStr?: string | null) => {
  if (!dateStr) return 'Inconnu';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Inconnu';
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffDays = Math.floor(diffH / 24);
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
};

const mapFan = (f: any): Fan => ({
  id: String(f.id),
  nom: f.nom || f.name || f.email || 'Utilisateur',
  initiale: (f.nom || f.name || 'U')[0]?.toUpperCase() || 'U',
  derniereActivite: formatRelative(f.derniereActivite || f.updatedAt || f.createdAt),
  statut: (f.statut || 'Timewaster') as Fan['statut'],
  urlAvatar: f.urlAvatar || f.avatar || '',
  totalDepense: Number(f.totalDepense || 0),
});

const normalizeTitre = (titre: string | undefined): Contenu['titre'] => {
  if (!titre) return 'Public';
  const t = titre.toString().toLowerCase();
  if (t.includes('achet')) return 'Acheté';
  if (t.includes('attente')) return 'En attente';
  if (t.includes('refus')) return 'Refusé';
  if (t.includes('grat')) return 'Gratuit';
  return 'Public';
};

const mapContenu = (c: any): Contenu => ({
  id: String(c.id),
  titre: normalizeTitre(c.titre),
  urlImage: c.urlImage || c.url || '',
  prix: Number(c.prix || 0),
});

const MessagePage: React.FC = () => {
  const { fans: fansRaw, loading: fansLoading } = useFans();
  const { content: contenusRaw, loading: contenusLoading } = useContent();

  const fans: Fan[] = (fansRaw || []).map(mapFan);
  const contenus: Contenu[] = (contenusRaw || []).map(mapContenu);

  const isLoading = fansLoading || contenusLoading;

  const [selectedContenu, setSelectedContenu] = useState<Contenu | null>(null);
  const { users: usersRaw } = useUsers();
  const usersList = usersRaw || [];

  // Messaging state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [composer, setComposer] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const toast = useToast();

  return (
    <>
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-0">
        <Navbar />

        <div className="flex-1 overflow-auto bg-gray-900">

          {/* Contenu principal avec sidebar des fans et grille de messages */}
          <div className="flex-1 overflow-auto bg-gray-900 flex">
            {/* Barre latérale fans - cachée sur mobile */}
            <div className="w-80 flex-shrink-0 lg:block md:block hidden">
              <BarreLateraleFans fans={fans} />
            </div>

            {/* Zone des messages */}
            <div className="flex-1 p-4 sm:p-6 overflow-auto">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-light text-center text-white">Mes messages</h1>
              </div>

              {/* Grille des messages */}
              {isLoading ? (
                <div className="text-center text-gray-400 py-8">Chargement des messages et contenus...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {contenus.map((contenu) => (
                    <div key={contenu.id} className="cursor-pointer" onClick={() => setSelectedContenu(contenu)}>
                      <CarteContenu contenu={contenu} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
      {/* Modal détails du contenu */}
      <Modal
        isOpen={!!selectedContenu}
        onClose={() => setSelectedContenu(null)}
        title={selectedContenu?.titre ?? 'Détails'}
      >
        {selectedContenu && (
          <div className="space-y-4">
            <div className="w-full rounded-lg overflow-hidden">
              <img src={selectedContenu.urlImage} alt={selectedContenu.titre} className="w-full h-64 object-cover rounded-md" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedContenu.titre}</h3>
              <p className="text-sm text-gray-400">Prix: <span className="font-semibold text-white">{selectedContenu.prix} €</span></p>
            </div>
            <div className="flex gap-3">
              <ActionButton onClick={() => {
                // prepare messaging: load profile and set default recipient
                (async () => {
                  try {
                    const profileRes: any = await profileApi.getProfile();
                    const uid = profileRes?.data?.id;
                    setCurrentUserId(uid || null);
                    // choose a default recipient: first user that is not current
                    const defaultRecipient = usersList.find((u: any) => String(u.id) !== String(uid));
                    setRecipientId(defaultRecipient ? String(defaultRecipient.id) : null);
                    // fetch thread if possible
                    if (uid && defaultRecipient) {
                      setThreadLoading(true);
                      const msgsRes: any = await messagesApi.list(uid, String(defaultRecipient.id));
                      setThreadMessages(Array.isArray(msgsRes?.data) ? msgsRes.data : []);
                    }
                  } catch (err) {
                    console.error('Error preparing conversation', err);
                    toast.showToast?.('Impossible d\'ouvrir la conversation', 'error');
                  } finally {
                    setThreadLoading(false);
                  }
                })();
              }}>
                Ouvrir la conversation
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => setSelectedContenu(null)}>
                Fermer
              </ActionButton>
            </div>
            
            {/* Conversation thread (if a recipient is selected) */}
            {currentUserId && (
              <div className="mt-4">
                <label className="text-xs text-gray-400">Destinataire</label>
                <select
                  value={recipientId ?? ''}
                  onChange={e => setRecipientId(e.target.value || null)}
                  className="w-full mt-2 mb-3 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="">Sélectionner un destinataire...</option>
                  {usersList.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name || u.email || u.id}</option>
                  ))}
                </select>

                <div className="max-h-48 overflow-y-auto p-3 bg-gray-900 border border-gray-700 rounded">
                  {threadLoading ? (
                    <div className="text-gray-400 text-sm">Chargement des messages...</div>
                  ) : threadMessages.length === 0 ? (
                    <div className="text-gray-400 text-sm">Aucun message pour cette conversation.</div>
                  ) : (
                    threadMessages.map((m: any) => (
                      <div key={m.id} className={`mb-2 ${String(m.fromId) === String(currentUserId) ? 'text-right' : 'text-left'}`}>
                        <div className="inline-block max-w-[80%] bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400">{String(m.fromId) === String(currentUserId) ? 'Vous' : (m.fromId)}</div>
                          <div className="text-sm text-white">{m.content}</div>
                          <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={composer}
                    onChange={e => setComposer(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Écrire un message..."
                  />
                  <ActionButton loading={sendLoading} onClick={async () => {
                    if (!currentUserId || !recipientId) return toast.showToast?.('Identifiants manquants', 'warning');
                    if (!composer.trim()) return toast.showToast?.('Message vide', 'warning');
                    setSendLoading(true);
                    try {
                      const res: any = await messagesApi.create({ fromId: currentUserId, toId: recipientId, content: composer.trim() });
                      const added = res?.data;
                      if (added) setThreadMessages(prev => [...prev, added]);
                      setComposer('');
                      toast.showToast?.('Message envoyé', 'success');
                    } catch (err) {
                      console.error('Send message error', err);
                      toast.showToast?.('Erreur envoi message', 'error');
                    } finally {
                      setSendLoading(false);
                    }
                  }}>Envoyer</ActionButton>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default MessagePage;