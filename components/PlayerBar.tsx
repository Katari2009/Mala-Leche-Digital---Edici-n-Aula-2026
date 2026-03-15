
import React from 'react';
import { Player } from '../types';

interface PlayerBarProps {
  players: Player[];
  currentPlayerId: string;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="w-full lg:w-64 bg-neutral-900 border-r border-neutral-800 p-4 overflow-y-auto">
      <h2 className="font-bebas text-2xl mb-4 text-yellow-500 tracking-wider">Jugadores</h2>
      <div className="space-y-3">
        {players.map((p) => (
          <div 
            key={p.id} 
            className={`p-3 rounded-lg border transition-colors ${p.id === currentPlayerId ? 'bg-neutral-800 border-yellow-600' : 'bg-neutral-950 border-neutral-800'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold truncate text-sm">
                {p.isDealer && <span className="mr-1">👑</span>}
                {p.name}
              </span>
              <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded">Pts: {p.score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400 font-mono">
                {p.lucas.toLocaleString()} LUCAS
              </span>
              {p.id === currentPlayerId && <span className="text-[10px] uppercase text-neutral-500">Tú</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
