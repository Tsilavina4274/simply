import React from 'react';
import type { Fan } from '../types/types';

interface ElementFanProps {
  fan: Fan;
}

const getCouleurStatut = (statut: Fan['statut']) => {
  switch (statut) {
    case 'Spender': return 'bg-green-600';
    case 'Good buyer': return 'bg-yellow-500';
    case 'Timewaster': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
}

export const ElementFan: React.FC<ElementFanProps> = ({ fan }) => (
  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800 transition-colors border-b border-gray-700">
    <div className="flex items-center min-w-0 flex-1">
      {/* Avatar */}
      {fan.urlAvatar ? (
        <img
          src={fan.urlAvatar}
          alt={fan.nom}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-3 flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 text-sm sm:text-base">
          {fan.initiale}
        </div>
      )}

      {/* Informations du fan */}
      <div className="min-w-0 flex-1">
        <div className="text-white text-sm sm:text-base truncate">{fan.nom}</div>
        <div className="text-gray-400 text-xs sm:text-sm truncate">{fan.derniereActivite}</div>
      </div>
    </div>

    {/* Étiquette de statut */}
    <div className="flex items-center flex-shrink-0 ml-2">
      <div className={`text-xs px-2 py-1 rounded-full text-black ${getCouleurStatut(fan.statut)} text-center min-w-[70px] sm:min-w-[80px]`}>
        {fan.statut}
      </div>
      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);