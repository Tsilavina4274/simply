import React from 'react';
import { DollarSign, Package } from 'lucide-react';
import type { Contenu } from '../types/types';

interface CarteContenuProps {
  contenu: Contenu;
}

const getClassesEtiquette = (titre: Contenu['titre']) => {
  switch (titre) {
    case 'Acheté': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    case 'En attente': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case 'Refusé': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
    case 'Gratuit': return 'bg-gradient-to-r from-white to-gray-200 text-black';
    case 'Public': return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const CarteContenu: React.FC<CarteContenuProps> = ({ contenu }) => {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image */}
      <img
        src={contenu.urlImage}
        alt={contenu.titre}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay au survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Étiquette de statut */}
      <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${getClassesEtiquette(contenu.titre)} backdrop-blur-sm`}>
        {contenu.titre}
      </div>

      {/* Prix */}
      <div className="absolute bottom-3 right-3 text-white bg-gray-900/80 backdrop-blur-md font-bold text-lg px-3 py-2 rounded-xl shadow-lg border border-white/20">
        <DollarSign className="inline w-4 h-4" />
        {contenu.prix}
      </div>

      {/* Icône de package au survol */}
      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Package className="text-white w-8 h-8 drop-shadow-lg" />
      </div>
    </div>
  );
};